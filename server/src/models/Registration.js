import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    service: { type: String, required: true },
    budget: { type: String, default: "" },
    timeline: { type: String, default: "" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
