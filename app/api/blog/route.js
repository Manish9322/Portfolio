import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/models/Blog.model";
import Activity from "@/models/Activity.model";

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'blog', icon = 'Plus', relatedId = null) => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      relatedId,
      relatedModel: 'Blog'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

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
    
    // Log activity
    await logActivity(
      'Published blog post',
      newBlog.title || 'New Blog Post',
      `Published a new blog post titled "${newBlog.title}"`,
      'blog',
      'Plus',
      newBlog._id.toString()
    );
    
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
    
    // Log activity
    await logActivity(
      'Updated blog post',
      updatedBlog.title || 'Blog Post',
      `Updated blog post "${updatedBlog.title}" with new content`,
      'blog',
      'Edit',
      updatedBlog._id.toString()
    );
    
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
    
    // Get the blog before deleting for activity log
    const blogToDelete = await Blog.findById(id);
    await Blog.findByIdAndDelete(id);
    
    // Log activity
    if (blogToDelete) {
      await logActivity(
        'Deleted blog post',
        blogToDelete.title || 'Blog Post',
        `Deleted blog post "${blogToDelete.title}" from the blog section`,
        'blog',
        'Trash',
        blogToDelete._id.toString()
      );
    }
    
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
