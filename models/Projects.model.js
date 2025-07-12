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
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Projects || mongoose.model("Projects", ProjectSchema);
export default Project;