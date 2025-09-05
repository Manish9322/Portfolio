import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    liveUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    timeline: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    team: {
      type: String,
      required: false,
    },
    challenges: {
      type: [String],
      default: [],
    },
    solutions: {
      type: [String],
      default: [],
    },
    screenshots: {
      type: [{
        url: String,
        caption: String
      }],
      default: [],
    },
      order: {
        type: Number,
        default: 0,
      },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Projects || mongoose.model("Projects", ProjectSchema);
export default Project;