import mongoose from "mongoose";

export const WORK_STATUSES = ["planned", "in_progress", "on_hold", "completed"];
export const TODO_STATUSES = ["todo", "in_progress", "done"];

// A single task inside an internal project. Assignable to any user
// (typically a worker).
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: TODO_STATUSES, default: "todo" },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Internal (non-portfolio) project used for ongoing work tracking.
// Deliberately separate from the public Project model that feeds the site.
const clientProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    status: { type: String, enum: WORK_STATUSES, default: "planned" },
    deadline: { type: String, default: "" },
    todos: [todoSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ClientProject", clientProjectSchema);
