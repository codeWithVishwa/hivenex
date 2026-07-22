import { Router } from "express";
import Client, { CLIENT_STATUSES } from "../models/Client.js";
import { requireRole } from "../middleware/auth.js";

// Clients hold contact details, so the whole router is admin-only —
// workers never see this collection.
const adminOnly = requireRole("admin", "super_admin");

const router = Router();

router.get("/", adminOnly, async (_req, res) => {
  const clients = await Client.find().sort({ updatedAt: -1 });
  res.json(clients);
});

router.post("/", adminOnly, async (req, res) => {
  const { name, company, email, phone, status, notes } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Name required" });
  const client = await Client.create({
    name,
    company,
    email,
    phone,
    status: CLIENT_STATUSES.includes(status) ? status : "lead",
    notes,
  });
  res.status(201).json(client);
});

router.put("/:id", adminOnly, async (req, res) => {
  // Only whitelisted fields — the updates timeline has its own endpoints.
  const { name, company, email, phone, status, notes } = req.body || {};
  const patch = { name, company, email, phone, notes };
  if (CLIENT_STATUSES.includes(status)) patch.status = status;
  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

  const client = await Client.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  }).catch(() => null);
  if (!client) return res.status(404).json({ error: "Not found" });
  res.json(client);
});

router.delete("/:id", adminOnly, async (req, res) => {
  await Client.findByIdAndDelete(req.params.id).catch(() => null);
  res.json({ ok: true });
});

// Post a status update onto the client's timeline
router.post("/:id/updates", adminOnly, async (req, res) => {
  const { text = "", image = "" } = req.body || {};
  if (!text.trim() && !image.trim()) {
    return res.status(400).json({ error: "Update text or image required" });
  }
  const client = await Client.findById(req.params.id).catch(() => null);
  if (!client) return res.status(404).json({ error: "Not found" });
  client.updates.unshift({ text, image, by: req.user.username });
  await client.save();
  res.status(201).json(client);
});

router.delete("/:id/updates/:updateId", adminOnly, async (req, res) => {
  const client = await Client.findById(req.params.id).catch(() => null);
  if (!client) return res.status(404).json({ error: "Not found" });
  client.updates.pull({ _id: req.params.updateId });
  await client.save();
  res.json(client);
});

export default router;
