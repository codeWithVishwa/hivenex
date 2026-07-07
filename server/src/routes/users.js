import { Router } from "express";
import User, { ROLES } from "../models/User.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

// Only the super admin can manage team members
const superOnly = requireRole("super_admin");

// List all users
router.get("/", superOnly, async (_req, res) => {
  const users = await User.find().sort({ createdAt: 1 });
  res.json(users.map((u) => u.toSafeJSON()));
});

// Create an admin or moderator
router.post("/", superOnly, async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username?.trim() || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be 6+ characters" });
  }
  // super admins can only mint admins or moderators (not other super admins)
  const safeRole = role === "admin" ? "admin" : "moderator";
  if (!ROLES.includes(safeRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const existing = await User.findOne({
    username: username.toLowerCase(),
  });
  if (existing) {
    return res.status(409).json({ error: "Username already taken" });
  }

  const user = await User.create({
    username: username.toLowerCase(),
    passwordHash: await User.hashPassword(password),
    role: safeRole,
  });
  res.status(201).json(user.toSafeJSON());
});

// Reset a member's password
router.put("/:id/password", superOnly, async (req, res) => {
  const { password } = req.body || {};
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be 6+ characters" });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  if (user.role === "super_admin") {
    return res.status(403).json({ error: "Cannot modify the super admin" });
  }
  user.passwordHash = await User.hashPassword(password);
  await user.save();
  res.json(user.toSafeJSON());
});

// Delete a member (never the super admin, never yourself)
router.delete("/:id", superOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.json({ ok: true });
  if (user.role === "super_admin") {
    return res.status(403).json({ error: "Cannot delete the super admin" });
  }
  if (String(user._id) === req.user.id) {
    return res.status(403).json({ error: "Cannot delete yourself" });
  }
  await user.deleteOne();
  res.json({ ok: true });
});

export default router;
