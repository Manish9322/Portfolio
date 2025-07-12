import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    items: [
      {
        type: String,
        required: true,
      },
    ],
    order: {
      type: Number,
      default: 0, // Default order for existing and new skills
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

export default Skill;