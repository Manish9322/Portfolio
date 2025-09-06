import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["project", "general"],
      required: true,
    },
    projectName: {
      type: String,
      trim: true,
      required: function() {
        return this.type === "project";
      }
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
FeedbackSchema.index({ order: 1, createdAt: -1 });

// Index for visibility and approval
FeedbackSchema.index({ isVisible: 1, isApproved: 1 });

// Virtual for formatted date
FeedbackSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Ensure virtual fields are serialized
FeedbackSchema.set("toJSON", {
  virtuals: true,
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
