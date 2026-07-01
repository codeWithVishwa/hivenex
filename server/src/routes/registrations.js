import { Router } from "express";
import Registration from "../models/Registration.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: submit a service registration from the site
router.post("/", async (req, res) => {
  const { name, email, company, service } = req.body;
  if (!name?.trim() || !email?.trim() || !service) {
    return res
      .status(400)
      .json({ error: "Name, email and service are required" });
  }
  const reg = await Registration.create({ name, email, company, service });
  res.status(201).json(reg);
});

// Admin: list all registrations (newest first)
router.get("/", requireAuth, async (_req, res) => {
  const regs = await Registration.find().sort({ createdAt: -1 });
  res.json(regs);
});

// Admin: delete
router.delete("/:id", requireAuth, async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
