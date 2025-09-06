import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/models/Blog.model";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    // Increment view count
    await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error in GET /api/blog/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'like') {
      const { userId } = body;
      const blog = await Blog.findById(id);
      
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      // Check if user already liked
      const existingLike = blog.likes.find((like: any) => like.userId === userId);
      
      if (existingLike) {
        // Unlike
        blog.likes = blog.likes.filter((like: any) => like.userId !== userId);
        blog.likesCount = Math.max(0, blog.likesCount - 1);
      } else {
        // Like
        blog.likes.push({ userId, timestamp: new Date() });
        blog.likesCount = blog.likesCount + 1;
      }

      await blog.save();
      return NextResponse.json({ 
        liked: !existingLike, 
        likesCount: blog.likesCount 
      });
    }

    if (action === 'share') {
      await Blog.findByIdAndUpdate(id, { $inc: { shares: 1 } });
      return NextResponse.json({ success: true });
    }

    if (action === 'comment') {
      const { name, email, website, comment } = body;
      
      if (!name || !email || !comment) {
        return NextResponse.json(
          { error: "Name, email, and comment are required" },
          { status: 400 }
        );
      }

      const newComment = {
        name,
        email,
        website,
        comment,
        timestamp: new Date(),
        approved: false, // Comments need approval
        replies: []
      };

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { 
          $push: { comments: newComment },
          $inc: { commentsCount: 1 }
        },
        { new: true }
      );

      return NextResponse.json({ 
        success: true,
        message: "Comment submitted successfully. It will appear after approval."
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/blog/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}
