import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Experience from '@/models/Experience.model';
import Activity from '@/models/Activity.model';

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'experience', icon = 'Plus', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Experience'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// GET all experiences
export async function GET() {
  try {
    await _db();
    const experiences = await Experience.find({}).sort({ order: 1 }); // Sort by order ascending
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching experiences' }, { status: 500 });
  }
}

// POST new experience
export async function POST(request) {
  try {
    await _db();
    const data = await request.json();
    // Find the highest order value to place new experience at the end
    const maxOrder = await Experience.findOne().sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    const experience = await Experience.create({ ...data, order: newOrder });
    
    // Log activity
    await logActivity(
      'Added experience',
      experience.company || 'New Company',
      `Added work experience at ${experience.company} as ${experience.position || 'Position'}`,
      'experience',
      'Plus',
      experience._id.toString()
    );
    
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating experience' }, { status: 500 });
  }
}

// PUT update experience
export async function PUT(request) {
  try {
    await _db();
    const data = await request.json();
    const { _id, ...rest } = data;

    const updatedExperience = await Experience.findByIdAndUpdate(
      _id,
      { ...rest },
      { new: true }
    );

    if (!updatedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'Updated experience',
      updatedExperience.company || 'Company',
      `Updated work experience at ${updatedExperience.company} as ${updatedExperience.position || 'Position'}`,
      'experience',
      'Edit',
      updatedExperience._id.toString()
    );

    return NextResponse.json(updatedExperience);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating experience' }, { status: 500 });
  }
}

// PUT update experience order
export async function PATCH(request) {
  try {
    await _db();
    const { orderedIds } = await request.json();

    // Update order for each experience
    const updatePromises = orderedIds.map((id, index) =>
      Experience.findByIdAndUpdate(
        id,
        { order: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Experience order updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating experience order' }, { status: 500 });
  }
}

// DELETE experience
export async function DELETE(request) {
  try {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }

    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'Removed experience',
      deletedExperience.company || 'Company',
      `Removed work experience at ${deletedExperience.company} as ${deletedExperience.position || 'Position'}`,
      'experience',
      'Trash',
      deletedExperience._id.toString()
    );

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Error deleting experience' }, { status: 500 });
  }
}