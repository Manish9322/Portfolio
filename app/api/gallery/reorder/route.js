import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Gallery from "@/models/Gallery.model";
import Activity from "@/models/Activity.model";

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'gallery', icon = 'ArrowUpDown', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Gallery'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export async function POST(request) {
  try {
    const { items } = await request.json();
    await connectDB();
    
    // Update each item's order in the database
    const updatePromises = items.map(({ id, order }) =>
      Gallery.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    // Log activity
    await logActivity(
      'Reordered gallery',
      'Gallery Images',
      `Reordered ${items.length} gallery images`,
      'gallery',
      'ArrowUpDown'
    );
    
    return NextResponse.json({ message: "Gallery order updated successfully" });
  } catch (error) {
    console.error("Error in POST /api/gallery/reorder:", error);
    return NextResponse.json(
      { error: "Failed to update gallery order" },
      { status: 500 }
    );
  }
}