import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";

const uri = process.env.MONGODB_URL || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Email transporter configuration (using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("portfolio");
    const collection = db.collection("contacts");

    // Store form submission
    const submission = {
      name,
      email,
      message,
      timestamp: new Date(),
    };
    await collection.insertOne(submission);

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email address to receive notifications
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

    return NextResponse.json({ message: "Submission saved and email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}