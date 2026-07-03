import { Router } from "express";
import FaqItem from "../models/FaqItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const faqs = await FaqItem.find().sort({ order: 1, createdAt: 1 });
  res.json(faqs);
});

router.post("/", requireAuth, async (req, res) => {
  if (!req.body.question?.trim())
    return res.status(400).json({ error: "Question required" });
  const faq = await FaqItem.create(req.body);
  res.status(201).json(faq);
});

router.put("/:id", requireAuth, async (req, res) => {
  const faq = await FaqItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) return res.status(404).json({ error: "Not found" });
  res.json(faq);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await FaqItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
