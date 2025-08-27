import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

function sanitizeFilename(filename) {
  // Remove any path traversal characters and unusual characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json(
        { error: "No file received." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with sanitized original name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const extension = path.extname(file.name);
    const sanitizedName = sanitizeFilename(path.basename(file.name, extension));
    const filename = `${uniqueSuffix}-${sanitizedName}${extension}`;
    
    // Ensure gallery directory exists
    const galleryDir = path.join(process.cwd(), "public/gallery");
    if (!existsSync(galleryDir)) {
      await mkdir(galleryDir, { recursive: true });
    }
    
    // Save to /public/gallery/
    const filepath = path.join(galleryDir, filename);
    await writeFile(filepath, buffer);
    
    return NextResponse.json({ 
      message: "File uploaded successfully",
      url: `/gallery/${filename}`,
      name: sanitizedName
    });
  } catch (error) {
    console.error("Error in uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file: " + error.message },
      { status: 500 }
    );
  }
}
