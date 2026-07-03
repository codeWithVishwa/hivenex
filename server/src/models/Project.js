import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    year: { type: String, default: "" },
    accent: { type: String, default: "#8b5cf6" },
    url: { type: String, default: "#" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
