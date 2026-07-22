import { Router } from "express";
import crypto from "crypto";
import { requireRole } from "../middleware/auth.js";

const adminOnly = requireRole("admin", "super_admin");

const router = Router();

// GET /api/uploads/signature — signs a direct browser → Cloudinary upload.
// The file itself never passes through this server (avoids the 100kb JSON
// body limit and serverless disk limits); we only vouch for the request.
// Returns 501 when Cloudinary env vars aren't configured, which the UI
// treats as "image uploads unavailable".
router.get("/signature", adminOnly, (_req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(501).json({ error: "Image uploads not configured" });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "hivenex-clients";
  // Cloudinary signature: SHA-1 over the sorted params + API secret
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");

  res.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});

export default router;
