import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Profile from '@/models/Profile.model';

// GET profile
export async function GET() {
  try {
    await _db();
    const profile = await Profile.findOne({});
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching profile' }, { status: 500 });
  }
}

// PUT update profile
export async function PUT(request) {
  try {
    await _db();
    const data = await request.json();
    const { _id, ...updateData } = data;

    const updatedProfile = await Profile.findOneAndUpdate(
      _id ? { _id } : {},
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}