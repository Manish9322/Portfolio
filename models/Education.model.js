import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
    },
    period: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    gpa: {
      type: String,
    },
    achievements: [
      {
        type: String,
      },
    ],
    logo: {
      type: String,
      default: "/placeholder.svg?height=80&width=80",
    },
    website: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    icon: {
      type: String,
      default: "graduation",
    },
    certificateUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ["degree", "certification", "course"],
      default: "degree",
    },
    order: {
      type: Number,
      default: 0,
      index: true, // NEW: Add index for faster sorting
    },
  },
  {
    timestamps: true,
  }
);

const Education =
  mongoose.models.Education || mongoose.model("Education", EducationSchema);

export default Education;