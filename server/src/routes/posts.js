import { Router } from "express";
import Post from "../models/Post.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

// Moderators (and above) can manage blog posts
const canEditPosts = requireRole("moderator", "admin", "super_admin");

// Public: list posts (newest first)
router.get("/", async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Public: a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// Admin: create
router.post("/", canEditPosts, async (req, res) => {
  if (!req.body.title?.trim())
    return res.status(400).json({ error: "Title required" });
  // only one featured post at a time
  if (req.body.featured) await Post.updateMany({}, { featured: false });
  const post = await Post.create(req.body);
  res.status(201).json(post);
});

// Admin: update
router.put("/:id", canEditPosts, async (req, res) => {
  if (req.body.featured)
    await Post.updateMany({ _id: { $ne: req.params.id } }, { featured: false });
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// Admin: delete
router.delete("/:id", canEditPosts, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
