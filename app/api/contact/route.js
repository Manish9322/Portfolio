import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";
import _db from '@/utils/db';
import Activity from '@/models/Activity.model';
import Contact from '@/models/Contact.model.js';

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'messages', icon = 'MessageSquare') => {
  try {
    await _db();
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      user: 'System'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Telegram notification function
const sendTelegramNotification = async (firstName, lastName, email, message) => {
  const T_TOKEN = process.env.TELEGRAM_TOKEN;
  const T_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!T_TOKEN || !T_CHAT_ID) {
    console.warn("Telegram credentials not configured. Skipping Telegram notification.");
    return false;
  }

  const text = `Portfolio Contact form : \n\n First name: ${firstName} \n Last name : ${lastName} \n Email: ${email} \n\n Message: ${message}`;
  
  const url = `https://api.telegram.org/bot${T_TOKEN}/sendMessage`;
  const payload = {
    chat_id: T_CHAT_ID,
    text: text
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    console.log("Telegram notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    return false;
  }
};

const uri = process.env.MONGODB_URL;
let client = null;

// Only initialize MongoDB client if URI is provided
if (uri && uri.trim() !== '') {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

// Email transporter configuration (optional - only if credentials are provided)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Split name into first and last name for Telegram notification
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let mongoSaved = false;
    let emailSent = false;
    let telegramSent = false;

    // Send Telegram notification (this is the main functionality you want)
    telegramSent = await sendTelegramNotification(firstName, lastName, email, message);

    // Log the contact message activity
    await logActivity(
      'Received message',
      `from ${name}`,
      `New inquiry from ${name} (${email}): "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`,
      'messages',
      'MessageSquare'
    );

    // Save to MongoDB using mongoose
    try {
      await _db();
      
      const contactSubmission = new Contact({
        name,
        email,
        message,
        subject: 'Contact Form Inquiry',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('remote-addr'),
        userAgent: request.headers.get('user-agent')
      });
      
      await contactSubmission.save();
      mongoSaved = true;
      console.log("Contact saved to MongoDB successfully");
    } catch (error) {
      console.warn("MongoDB save failed:", error.message);
    }

    // Try to send email notification (optional)
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: "New Contact Form Submission",
          text: `
            New contact form submission:
            Name: ${name}
            Email: ${email}
            Message: ${message}
            Submitted at: ${new Date().toISOString()}
          `,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log("Email notification sent successfully");
      } catch (error) {
        console.warn("Email notification failed:", error.message);
      }
    } else {
      console.log("Email not configured, skipping email notification");
    }

    // Return success response
    return NextResponse.json({ 
      message: telegramSent ? "Message sent successfully via Telegram" : "Message processed",
      success: true,
      details: {
        telegram: telegramSent,
        email: emailSent,
        database: mongoSaved
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      success: false 
    }, { status: 500 });
  }
}

// GET - Fetch all contact messages
export async function GET(request) {
  try {
    await _db();
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const filter = url.searchParams.get('filter') || 'all'; // all, unread, starred, archived
    
    const skip = (page - 1) * limit;
    
    // Build filter query
    let query = {};
    switch (filter) {
      case 'unread':
        query.read = false;
        break;
      case 'starred':
        query.starred = true;
        break;
      case 'archived':
        query.archived = true;
        break;
      case 'inbox':
        query.archived = false;
        break;
    }
    
    // Get messages with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Contact.countDocuments(query);
    
    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT - Update message (mark as read, starred, archived, etc.)
export async function PUT(request) {
  try {
    await _db();
    
    const { id, updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        error: "Message ID is required" 
      }, { status: 400 });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id, 
      { ...updates }, 
      { new: true }
    );
    
    if (!contact) {
      return NextResponse.json({ 
        error: "Message not found" 
      }, { status: 404 });
    }
    
    // Log activity for important updates
    if (updates.read !== undefined) {
      await logActivity(
        updates.read ? 'Marked message as read' : 'Marked message as unread',
        `message from ${contact.name}`,
        `Message from ${contact.name} (${contact.email})`,
        'messages',
        'MessageSquare'
      );
    }
    
    if (updates.archived !== undefined) {
      await logActivity(
        updates.archived ? 'Archived message' : 'Unarchived message',
        `message from ${contact.name}`,
        `Message from ${contact.name} (${contact.email})`,
        'messages',
        'Archive'
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      contact 
    });
    
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// DELETE - Delete a message
export async function DELETE(request) {
  try {
    await _db();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        error: "Message ID is required" 
      }, { status: 400 });
    }
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json({ 
        error: "Message not found" 
      }, { status: 404 });
    }
    
    await Contact.findByIdAndDelete(id);
    
    // Log activity
    await logActivity(
      'Deleted message',
      `from ${contact.name}`,
      `Deleted message from ${contact.name} (${contact.email})`,
      'messages',
      'Trash2'
    );
    
    return NextResponse.json({ 
      success: true,
      message: "Message deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
