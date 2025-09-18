import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import _db from '@/utils/db';
import Activity from '@/models/Activity.model';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'gallery', icon = 'Plus') => {
  try {
    await _db();
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      user: 'You'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

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
    const extension = file.name.split('.').pop();
    const sanitizedName = sanitizeFilename(file.name.replace(`.${extension}`, ''));
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    
    try {
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            public_id: filename,
            folder: "portfolio/gallery", // This creates a folder structure in Cloudinary
            format: extension,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      // Log activity
      await logActivity(
        'Uploaded file',
        sanitizedName || 'New File',
        `Uploaded file "${sanitizedName}" to the gallery`,
        'gallery',
        'Plus'
      );
      
      return NextResponse.json({ 
        message: "File uploaded successfully",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        name: sanitizedName
      });
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      return NextResponse.json(
        { error: "Error uploading file: " + uploadError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file: " + error.message },
      { status: 500 }
    );
  }
}
