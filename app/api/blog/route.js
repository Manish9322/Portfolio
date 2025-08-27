import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/models/Blog.model";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ order: 1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error in GET /api/blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const newBlog = await Blog.create(body);
    return NextResponse.json(newBlog);
  } catch (error) {
    console.error("Error in POST /api/blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    await connectDB();
    const updatedBlog = await Blog.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error in PUT /api/blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await connectDB();
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { orderedIds } = await request.json();
    await connectDB();
    
    for (let i = 0; i < orderedIds.length; i++) {
      await Blog.findByIdAndUpdate(orderedIds[i], { order: i });
    }
    
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error in PATCH /api/blog:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
