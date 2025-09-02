import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

export async function GET(request, { params }) {
  try {
    await _db();
    const { id } = params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
  }
}
