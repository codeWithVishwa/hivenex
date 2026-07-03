import { Router } from "express";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: 1 });
  res.json(projects);
});

router.post("/", requireAuth, async (req, res) => {
  if (!req.body.name?.trim())
    return res.status(400).json({ error: "Name required" });
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

router.put("/:id", requireAuth, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
