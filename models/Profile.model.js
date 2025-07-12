import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/placeholder.svg?height=400&width=400",
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;