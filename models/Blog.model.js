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
    // New fields for enhanced functionality
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      userId: String,
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [{
      id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      website: String,
      comment: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      approved: {
        type: Boolean,
        default: false,
      },
      replies: [{
        id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        approved: {
          type: Boolean,
          default: false,
        },
      }]
    }],
    commentsCount: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
