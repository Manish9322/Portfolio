import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Gallery from "@/models/Gallery.model";

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
    await Gallery.findByIdAndDelete(id);
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
