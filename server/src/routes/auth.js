import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/login  { username, password }
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const user = await User.findOne({ username: String(username).toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  res.json({ token: signToken(user), user: user.toSafeJSON() });
});

// GET /api/auth/me  — current user (for restoring the session)
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "User no longer exists" });
  res.json({ user: user.toSafeJSON() });
});

export default router;
