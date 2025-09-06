import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Feedback from "@/models/Feedback.model";

// GET - Fetch all feedbacks
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'project' | 'general'
    const visible = searchParams.get("visible"); // 'true' | 'false'
    const approved = searchParams.get("approved"); // 'true' | 'false'
    const limit = parseInt(searchParams.get("limit")) || null;
    
    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (visible !== null) filter.isVisible = visible === "true";
    if (approved !== null) filter.isApproved = approved === "true";
    
    let query = Feedback.find(filter).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const feedbacks = await query;
    
    return NextResponse.json({
      success: true,
      data: feedbacks,
      count: feedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch feedbacks",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new feedback
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, role, feedback, type, projectName, rating, email, company } = body;
    
    // Validation
    if (!name || !role || !feedback || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, role, feedback, and type are required",
        },
        { status: 400 }
      );
    }
    
    if (type === "project" && !projectName) {
      return NextResponse.json(
        {
          success: false,
          message: "Project name is required for project feedback",
        },
        { status: 400 }
      );
    }
    
    // Get the highest order number and add 1
    const highestOrder = await Feedback.findOne().sort({ order: -1 }).select("order");
    const order = highestOrder ? highestOrder.order + 1 : 1;
    
    const newFeedback = new Feedback({
      name,
      role,
      feedback,
      type,
      projectName: type === "project" ? projectName : undefined,
      rating: rating || 5,
      email,
      company,
      order,
      isApproved: false, // Admin needs to approve
      isVisible: true,
    });
    
    const savedFeedback = await newFeedback.save();
    
    return NextResponse.json({
      success: true,
      data: savedFeedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update feedback (for admin operations like approval, visibility, order)
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback ID is required",
        },
        { status: 400 }
      );
    }
    
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedFeedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedFeedback,
      message: "Feedback updated successfully",
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete feedback
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback ID is required",
        },
        { status: 400 }
      );
    }
    
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
