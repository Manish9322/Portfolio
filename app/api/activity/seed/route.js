import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Activity from "@/models/Activity.model";

export async function POST(request) {
  try {
    await connectDB();

    // Sample activities to seed the database
    const sampleActivities = [
      {
        action: "System initialized",
        item: "Portfolio CMS",
        details: "Portfolio management system has been set up and configured",
        category: "system",
        icon: "Settings",
        user: "System"
      },
      {
        action: "Created profile",
        item: "Personal Information",
        details: "Initial profile setup with personal information and contact details",
        category: "profile",
        icon: "User",
        user: "You"
      },
      {
        action: "Portfolio viewed",
        item: "First visitor",
        details: "Your portfolio received its first visitor! Keep up the great work.",
        category: "analytics",
        icon: "Eye",
        user: "System"
      },
      {
        action: "Updated settings",
        item: "Theme preferences",
        details: "Changed default theme and display preferences",
        category: "settings",
        icon: "Settings",
        user: "You"
      }
    ];

    // Clear existing activities (optional - remove this line to keep existing data)
    // await Activity.deleteMany({});

    // Insert sample activities
    const activities = await Activity.insertMany(sampleActivities);

    return NextResponse.json({
      message: "Sample activities created successfully",
      count: activities.length,
      activities: activities.map(activity => ({
        id: activity._id.toString(),
        action: activity.action,
        item: activity.item,
        details: activity.details,
        category: activity.category,
        user: activity.user,
        createdAt: activity.createdAt
      }))
    });

  } catch (error) {
    console.error("Error seeding activities:", error);
    return NextResponse.json(
      { error: "Failed to seed activities" },
      { status: 500 }
    );
  }
}
