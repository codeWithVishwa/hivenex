import { Router } from "express";
import Stat from "../models/Stat.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
  res.json(stats);
});

router.post("/", requireAuth, async (req, res) => {
  if (!req.body.label?.trim())
    return res.status(400).json({ error: "Label required" });
  const stat = await Stat.create(req.body);
  res.status(201).json(stat);
});

router.put("/:id", requireAuth, async (req, res) => {
  const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!stat) return res.status(404).json({ error: "Not found" });
  res.json(stat);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Stat.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
