import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    year: { type: String, default: "" },
    accent: { type: String, default: "#8b5cf6" },
    url: { type: String, default: "#" },
    order: { type: Number, default: 0 },
    // Case-study detail (shown on /work/:id). All optional — a project with
    // none of these still renders as a hero-only page.
    tagline: { type: String, default: "" },
    overview: { type: String, default: "" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
