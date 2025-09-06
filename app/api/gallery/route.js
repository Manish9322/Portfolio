import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Gallery from "@/models/Gallery.model";
import Activity from "@/models/Activity.model";

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'gallery', icon = 'Plus', relatedId = null) => {
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

export async function GET() {
  try {
    await connectDB();
    const gallery = await Gallery.find().sort({ order: 1 });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error in GET /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const newGalleryItem = await Gallery.create(body);
    
    // Log activity
    await logActivity(
      'Uploaded image',
      newGalleryItem.title || 'New Image',
      `Added new image "${newGalleryItem.title}" to the gallery`,
      'gallery',
      'Plus',
      newGalleryItem._id.toString()
    );
    
    return NextResponse.json(newGalleryItem);
  } catch (error) {
    console.error("Error in POST /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    await connectDB();
    const updatedGalleryItem = await Gallery.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    
    // Log activity
    await logActivity(
      'Updated image',
      updatedGalleryItem.title || 'Gallery Image',
      `Updated gallery image "${updatedGalleryItem.title}" details`,
      'gallery',
      'Edit',
      updatedGalleryItem._id.toString()
    );
    
    return NextResponse.json(updatedGalleryItem);
  } catch (error) {
    console.error("Error in PUT /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await connectDB();
    
    // Get the item before deleting for activity log
    const itemToDelete = await Gallery.findById(id);
    await Gallery.findByIdAndDelete(id);
    
    // Log activity
    if (itemToDelete) {
      await logActivity(
        'Deleted image',
        itemToDelete.title || 'Gallery Image',
        `Removed image "${itemToDelete.title}" from the gallery`,
        'gallery',
        'Trash',
        itemToDelete._id.toString()
      );
    }
    
    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { orderedIds } = await request.json();
    await connectDB();
    
    for (let i = 0; i < orderedIds.length; i++) {
      await Gallery.findByIdAndUpdate(orderedIds[i], { order: i });
    }
    
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error in PATCH /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
