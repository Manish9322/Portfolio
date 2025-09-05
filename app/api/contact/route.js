import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";

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
  transporter = nodemailer.createTransporter({
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

    // Try to save to MongoDB (optional)
    if (client) {
      try {
        await client.connect();
        const db = client.db("portfolio");
        const collection = db.collection("contacts");

        const submission = {
          name,
          email,
          message,
          timestamp: new Date(),
        };
        await collection.insertOne(submission);
        mongoSaved = true;
        console.log("Contact saved to MongoDB successfully");
      } catch (error) {
        console.warn("MongoDB save failed:", error.message);
      } finally {
        if (client) {
          try {
            await client.close();
          } catch (closeError) {
            console.warn("Error closing MongoDB connection:", closeError.message);
          }
        }
      }
    } else {
      console.log("MongoDB not configured, skipping database save");
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
