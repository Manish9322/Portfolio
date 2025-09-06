import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Education from '@/models/Education.model';
import Activity from '@/models/Activity.model';
import mongoose from "mongoose";

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'education', icon = 'Plus', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Education'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// GET all education
export async function GET() {
  try {
    await _db();
    const education = await Education.find({}).sort({ order: 1 });
    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Error fetching education' }, { status: 500 });
  }
}

// POST new education
export async function POST(request) {
  try {
    await _db();
    const data = await request.json();
    const count = await Education.countDocuments();
    const education = await Education.create({ ...data, order: count });
    
    // Log activity
    await logActivity(
      'Added education',
      education.institution || 'New Institution',
      `Added education at ${education.institution} - ${education.degree || 'Degree'}`,
      'education',
      'Plus',
      education._id.toString()
    );
    
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Error creating education' }, { status: 500 });
  }
}

// PUT update education
export async function PUT(request) {
  try {
    await _db();
    const data = await request.json();
    const { _id, ...rest } = data;
    
    const updatedEducation = await Education.findByIdAndUpdate(
      _id,
      { ...rest },
      { new: true }
    );
    
    if (!updatedEducation) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }
    
    // Log activity
    await logActivity(
      'Updated education',
      updatedEducation.institution || 'Institution',
      `Updated education entry for ${updatedEducation.institution} - ${updatedEducation.degree || 'Degree'}`,
      'education',
      'Edit',
      updatedEducation._id.toString()
    );
    
    return NextResponse.json(updatedEducation);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating education entry' }, { status: 500 });
  }
}

// DELETE education
export async function DELETE(request) {
  try {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    }
    const session = await mongoose.startSession();
    try {
      let deletedEducation;
      await session.withTransaction(async () => {
        deletedEducation = await Education.findByIdAndDelete(id, { session });
        if (!deletedEducation) {
          throw new Error('Education not found');
        }
        // Re-normalize order values
        const remainingEducations = await Education.find({})
          .sort({ order: 1 })
          .session(session);
        for (let i = 0; i < remainingEducations.length; i++) {
          await Education.findByIdAndUpdate(
            remainingEducations[i]._id,
            { order: i },
            { session }
          );
        }
      });
      
      // Log activity (after transaction)
      if (deletedEducation) {
        await logActivity(
          'Removed education',
          deletedEducation.institution || 'Institution',
          `Removed education entry for ${deletedEducation.institution} - ${deletedEducation.degree || 'Degree'}`,
          'education',
          'Trash',
          deletedEducation._id.toString()
        );
      }
      
      return NextResponse.json({ message: 'Education deleted successfully' });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Error deleting education' }, { status: 500 });
  }
}