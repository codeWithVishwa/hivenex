import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
