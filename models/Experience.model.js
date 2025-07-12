import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "/placeholder.svg?height=80&width=80",
    },
    achievements: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    projects: {
      type: [
        {
          name: String,
          description: String,
        },
      ],
      default: [],
    },
    website: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    teamSize: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0, // For reordering experiences
    },
  },
  {
    timestamps: true,
  }
);

const Experience =
  mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

export default Experience;
