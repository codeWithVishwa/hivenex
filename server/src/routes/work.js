import { Router } from "express";
import ClientProject, {
  WORK_STATUSES,
  TODO_STATUSES,
} from "../models/ClientProject.js";
import { requireRole } from "../middleware/auth.js";

const adminOnly = requireRole("admin", "super_admin");
// Workers may read their own tasks and update their status — nothing else.
const staff = requireRole("admin", "super_admin", "worker");

const router = Router();

const isAdmin = (req) => ["admin", "super_admin"].includes(req.user.role);

// Populate refs the UI needs: client name + assignee usernames.
const populated = (query) =>
  query.populate("client", "name status").populate("todos.assignedTo", "username");

const todoAssigneeId = (todo) =>
  String(todo.assignedTo?._id ?? todo.assignedTo ?? "");

// Strip a project down to only the todos assigned to this worker.
function workerView(project, userId) {
  const p = project.toObject({ virtuals: false });
  p.todos = p.todos.filter((t) => String(t.assignedTo?._id ?? t.assignedTo) === userId);
  return p;
}

// GET /api/work — admins see everything; workers see only projects that
// contain todos assigned to them, with the todo list filtered to theirs.
router.get("/", staff, async (req, res) => {
  if (isAdmin(req)) {
    const projects = await populated(
      ClientProject.find().sort({ updatedAt: -1 })
    );
    return res.json(projects);
  }
  const projects = await populated(
    ClientProject.find({ "todos.assignedTo": req.user.id }).sort({
      updatedAt: -1,
    })
  );
  res.json(projects.map((p) => workerView(p, req.user.id)));
});

router.post("/", adminOnly, async (req, res) => {
  const { name, client, status, deadline } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Name required" });
  const project = await ClientProject.create({
    name,
    client: client || null,
    status: WORK_STATUSES.includes(status) ? status : "planned",
    deadline,
  });
  res.status(201).json(await populated(ClientProject.findById(project._id)));
});

router.put("/:id", adminOnly, async (req, res) => {
  const { name, client, status, deadline } = req.body || {};
  const patch = { name, deadline };
  if (client !== undefined) patch.client = client || null;
  if (WORK_STATUSES.includes(status)) patch.status = status;
  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

  const project = await populated(
    ClientProject.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    })
  ).catch(() => null);
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

router.delete("/:id", adminOnly, async (req, res) => {
  await ClientProject.findByIdAndDelete(req.params.id).catch(() => null);
  res.json({ ok: true });
});

// Add a todo to a project
router.post("/:id/todos", adminOnly, async (req, res) => {
  const { title, assignedTo } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: "Title required" });
  const project = await ClientProject.findById(req.params.id).catch(() => null);
  if (!project) return res.status(404).json({ error: "Not found" });
  project.todos.push({ title, assignedTo: assignedTo || null });
  await project.save();
  res.status(201).json(await populated(ClientProject.findById(project._id)));
});

// Update a todo. Admins can change anything; workers can only move the
// status of a todo that is assigned to them.
router.put("/:id/todos/:todoId", staff, async (req, res) => {
  const project = await ClientProject.findById(req.params.id).catch(() => null);
  const todo = project?.todos.id(req.params.todoId);
  if (!todo) return res.status(404).json({ error: "Not found" });

  const { title, status, assignedTo } = req.body || {};

  if (isAdmin(req)) {
    if (title !== undefined) todo.title = title;
    if (assignedTo !== undefined) todo.assignedTo = assignedTo || null;
  } else if (todoAssigneeId(todo) !== req.user.id) {
    return res.status(403).json({ error: "Not your task" });
  }
  if (status !== undefined) {
    if (!TODO_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    todo.status = status;
  }

  await project.save();
  const fresh = await populated(ClientProject.findById(project._id));
  res.json(isAdmin(req) ? fresh : workerView(fresh, req.user.id));
});

router.delete("/:id/todos/:todoId", adminOnly, async (req, res) => {
  const project = await ClientProject.findById(req.params.id).catch(() => null);
  if (!project) return res.status(404).json({ error: "Not found" });
  project.todos.pull({ _id: req.params.todoId });
  await project.save();
  res.json(await populated(ClientProject.findById(project._id)));
});

export default router;
