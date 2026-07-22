import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Compared against when the username doesn't exist, so unknown-user and
// wrong-password responses take the same time (no username enumeration).
const DUMMY_HASH = bcrypt.hashSync("dummy-timing-equalizer", 12);

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
  // Always run one bcrypt compare, even for unknown usernames (see DUMMY_HASH).
  const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  res.json({ token: signToken(user), user: user.toSafeJSON() });
});

// PUT /api/auth/password  { currentPassword, newPassword } — change your own
// password. This is the only way to rotate the super admin's password (the
// users route deliberately refuses to touch super_admin accounts).
router.put("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be 8+ characters" });
  }
  const user = await User.findById(req.user.id);
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();
  res.json({ ok: true });
});

// GET /api/auth/me  — current user (for restoring the session)
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "User no longer exists" });
  res.json({ user: user.toSafeJSON() });
});

export default router;
