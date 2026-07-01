import { Router } from "express";
import Service from "../models/Service.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list services
router.get("/", async (_req, res) => {
  const services = await Service.find().sort({ createdAt: 1 });
  res.json(services);
});

// Admin: create
router.post("/", requireAuth, async (req, res) => {
  const { title, desc, tags } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title required" });
  const service = await Service.create({ title, desc, tags });
  res.status(201).json(service);
});

// Admin: update
router.put("/:id", requireAuth, async (req, res) => {
  const { title, desc, tags } = req.body;
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { title, desc, tags },
    { new: true, runValidators: true }
  );
  if (!service) return res.status(404).json({ error: "Not found" });
  res.json(service);
});

// Admin: delete
router.delete("/:id", requireAuth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
