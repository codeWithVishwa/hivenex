import { Router } from "express";
import Registration from "../models/Registration.js";
import { requireRole } from "../middleware/auth.js";

const adminOnly = requireRole("admin", "super_admin");

const router = Router();

// Public: submit a service registration from the site
router.post("/", async (req, res) => {
  const { name, email, company, phone, service, budget, timeline, message } =
    req.body;
  if (!name?.trim() || !email?.trim() || !service) {
    return res
      .status(400)
      .json({ error: "Name, email and service are required" });
  }
  const reg = await Registration.create({
    name,
    email,
    company,
    phone,
    service,
    budget,
    timeline,
    message,
  });
  res.status(201).json(reg);
});

// Admin: list all registrations (newest first)
router.get("/", adminOnly, async (_req, res) => {
  const regs = await Registration.find().sort({ createdAt: -1 });
  res.json(regs);
});

// Admin: delete
router.delete("/:id", adminOnly, async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
