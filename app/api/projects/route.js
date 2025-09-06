import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';
import Activity from '@/models/Activity.model';

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'projects', icon = 'Edit', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Project'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export async function GET() {
  try {
    await _db();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await _db();
    const data = await request.json();
    const project = await Project.create(data);
    
    // Log activity
    await logActivity(
      'Created project',
      project.title || 'Untitled Project',
      `New project "${project.title}" has been added to the portfolio`,
      'projects',
      'Plus',
      project._id.toString()
    );
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await _db();
    const data = await request.json();
    const { _id, ...rest } = data;

    const updatedProject = await Project.findByIdAndUpdate(_id, rest, { new: true });

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'Updated project',
      updatedProject.title || 'Untitled Project',
      `Project "${updatedProject.title}" has been updated with new information`,
      'projects',
      'Edit',
      updatedProject._id.toString()
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'Deleted project',
      deletedProject.title || 'Untitled Project',
      `Project "${deletedProject.title}" has been removed from the portfolio`,
      'projects',
      'Trash',
      deletedProject._id.toString()
    );

    return NextResponse.json(deletedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
