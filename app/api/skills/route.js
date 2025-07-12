import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Skill from '@/models/Skills.model';

// GET all skills
export async function GET() {
  try {
    await _db();
    const skills = await Skill.find({}).sort({ order: 1 }); // Sort by order ascending
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching skills' }, { status: 500 });
  }
}

// POST new skill
export async function POST(request) {
  try {
    await _db();
    const data = await request.json();
    // Find the highest order value to place new skill at the end
    const maxOrder = await Skill.findOne().sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    const skill = await Skill.create({ ...data, order: newOrder });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating skill' }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(request) {
  try {
    await _db();
    const data = await request.json();
    const { _id, category, items, order } = data;
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      _id,
      { category, items, order },
      { new: true }
    );
    
    if (!updatedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating skill' }, { status: 500 });
  }
}

// PUT update skill order
export async function PATCH(request) {
  try {
    await _db();
    const { orderedIds } = await request.json();
    
    // Update order for each skill
    const updatePromises = orderedIds.map((id, index) =>
      Skill.findByIdAndUpdate(
        id,
        { order: index },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ message: 'Skill order updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating skill order' }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(request) {
  try {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    const deletedSkill = await Skill.findByIdAndDelete(id);
    
    if (!deletedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Error deleting skill' }, { status: 500 });
  }
}