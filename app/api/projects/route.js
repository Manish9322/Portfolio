import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

export async function GET() {
  try {
    await _db();
    const projects = await Project.find({}).sort({ createdAt: -1 });
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

    return NextResponse.json(deletedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
