import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "General" },
    excerpt: { type: String, default: "" },
    date: { type: String, default: "" },
    read: { type: String, default: "5 min read" },
    featured: { type: Boolean, default: false },
    gradient: {
      type: String,
      default: "from-[#2a1030] via-[#160a2e] to-[#d63f9d]/30",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
