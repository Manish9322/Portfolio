import { NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";

export async function POST() {
  try {
    // Create gallery directory if it doesn't exist
    const galleryPath = path.join(process.cwd(), "public/gallery");
    await mkdir(galleryPath, { recursive: true });
    
    return NextResponse.json({ 
      message: "Gallery directory initialized"
    });
  } catch (error) {
    console.error("Error initializing gallery directory:", error);
    return NextResponse.json(
      { error: "Error initializing gallery directory" },
      { status: 500 }
    );
  }
}
