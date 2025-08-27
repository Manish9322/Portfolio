import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
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

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;
