import { NextResponse } from "next/server";
import _db from "@/utils/db";
import Education from "@/models/Education.model";
import mongoose from "mongoose";

export async function PUT(request) {
  try {
    await _db();
    const { orderedIds } = await request.json();

    // Validate orderedIds
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: "Invalid or empty orderedIds array" }, { status: 400 });
    }

    // Verify all IDs exist
    const existingEducations = await Education.find({ _id: { $in: orderedIds } });
    if (existingEducations.length !== orderedIds.length) {
      return NextResponse.json({ error: "One or more education IDs not found" }, { status: 400 });
    }

    // Start a session for atomic updates
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Update order for each education entry
        for (let i = 0; i < orderedIds.length; i++) {
          await Education.findByIdAndUpdate(
            orderedIds[i],
            { order: i },
            { session }
          );
        }
      });
    } finally {
      session.endSession();
    }

    return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating education order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}