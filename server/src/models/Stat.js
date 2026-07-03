import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Stat", statSchema);
