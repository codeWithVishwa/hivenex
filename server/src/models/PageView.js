import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, default: "/" },
    ref: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("PageView", pageViewSchema);
