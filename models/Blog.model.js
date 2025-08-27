import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "/images/blog-placeholder.svg",
    },
    tags: [{
      type: String,
    }],
    readTime: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: String,
      required: true,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: "/images/avatar-placeholder.svg",
      },
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
