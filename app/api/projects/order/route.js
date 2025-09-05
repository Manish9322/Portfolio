import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Project from '@/models/Projects.model';

export async function PATCH(request) {
  try {
    await _db();
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 });
    }
    // Update each project's order field
    await Promise.all(
      orderedIds.map((id, idx) =>
        Project.findByIdAndUpdate(id, { order: idx }, { new: true })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating project order' }, { status: 500 });
  }
}
