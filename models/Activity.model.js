import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['projects', 'skills', 'experience', 'messages', 'analytics', 'profile', 'settings', 'system', 'education', 'gallery', 'blog', 'testimonials']
    },
    user: {
      type: String,
      default: 'You',
    },
    icon: {
      type: String,
      default: 'Edit',
    },
    relatedId: {
      type: String, // ID of the related document
      default: null,
    },
    relatedModel: {
      type: String, // Model name of the related document
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
ActivitySchema.index({ category: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ isVisible: 1, createdAt: -1 });

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
