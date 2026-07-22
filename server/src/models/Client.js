import mongoose from "mongoose";

export const CLIENT_STATUSES = ["lead", "active", "on_hold", "completed"];

// A dated progress note on a client (optionally with an image hosted on
// Cloudinary — we only store the delivered URL).
const updateSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    by: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, enum: CLIENT_STATUSES, default: "lead" },
    notes: { type: String, default: "" },
    updates: [updateSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
