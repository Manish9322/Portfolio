import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Activity from "@/models/Activity.model";

// GET - Fetch all activities
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const category = searchParams.get('category');
    const user = searchParams.get('user');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query = { isVisible: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (user && user !== 'all') {
      query.user = user;
    }

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { item: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch activities with pagination
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalActivities = await Activity.countDocuments(query);

    // Get unique categories and users for filters
    const categories = await Activity.distinct('category', { isVisible: true });
    const users = await Activity.distinct('user', { isVisible: true });

    // Transform activities to match frontend format
    const formattedActivities = activities.map(activity => ({
      id: activity._id.toString(),
      action: activity.action,
      item: activity.item,
      details: activity.details,
      time: getRelativeTime(activity.createdAt),
      date: activity.createdAt.toISOString().split('T')[0],
      icon: activity.icon,
      category: activity.category,
      user: activity.user,
      createdAt: activity.createdAt,
      metadata: activity.metadata || {}
    }));

    return NextResponse.json({
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        total: totalActivities,
        totalPages: Math.ceil(totalActivities / limit)
      },
      filters: {
        categories,
        users
      }
    });

  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// POST - Create new activity
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, item, details, category, user, icon, relatedId, relatedModel, metadata } = body;

    // Validate required fields
    if (!action || !item || !details || !category) {
      return NextResponse.json(
        { error: "Missing required fields: action, item, details, category" },
        { status: 400 }
      );
    }

    const activity = new Activity({
      action,
      item,
      details,
      category,
      user: user || 'You',
      icon: icon || 'Edit',
      relatedId,
      relatedModel,
      metadata: metadata || {}
    });

    await activity.save();

    const formattedActivity = {
      id: activity._id.toString(),
      action: activity.action,
      item: activity.item,
      details: activity.details,
      time: getRelativeTime(activity.createdAt),
      date: activity.createdAt.toISOString().split('T')[0],
      icon: activity.icon,
      category: activity.category,
      user: activity.user,
      createdAt: activity.createdAt,
      metadata: activity.metadata
    };

    return NextResponse.json(formattedActivity, { status: 201 });

  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

// DELETE - Remove activity
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 }
      );
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      { isVisible: false },
      { new: true }
    );

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Activity deleted successfully" });

  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}

// Helper function to get relative time
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return 'Last week';
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months === 1) return 'Last month';
  if (months < 12) return `${months} months ago`;
  
  return 'More than a year ago';
}
