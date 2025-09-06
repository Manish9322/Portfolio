import { NextResponse } from 'next/server';
import _db from '@/utils/db';
import Profile from '@/models/Profile.model';
import Activity from '@/models/Activity.model';

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'profile', icon = 'User', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Profile'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

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

    // Log activity
    await logActivity(
      'Updated profile',
      updatedProfile.name || 'Profile Information',
      `Updated profile information including personal details and contact information`,
      'profile',
      'User',
      updatedProfile._id.toString()
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}