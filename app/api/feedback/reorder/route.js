import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Feedback from "@/models/Feedback.model";

// POST - Reorder feedbacks
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { feedbackIds } = body; // Array of feedback IDs in the desired order
    
    if (!Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Array of feedback IDs is required",
        },
        { status: 400 }
      );
    }
    
    // Update order for each feedback
    const updatePromises = feedbackIds.map((id, index) =>
      Feedback.findByIdAndUpdate(
        id,
        { order: index + 1 },
        { new: true }
      )
    );
    
    const updatedFeedbacks = await Promise.all(updatePromises);
    
    // Filter out any null results (invalid IDs)
    const validUpdates = updatedFeedbacks.filter(feedback => feedback !== null);
    
    return NextResponse.json({
      success: true,
      data: validUpdates,
      message: "Feedbacks reordered successfully",
      updated: validUpdates.length,
    });
  } catch (error) {
    console.error("Error reordering feedbacks:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reorder feedbacks",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
