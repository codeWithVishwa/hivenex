import { Router } from "express";
import PageView from "../models/PageView.js";
import Registration from "../models/Registration.js";
import Post from "../models/Post.js";
import Service from "../models/Service.js";
import { requireRole } from "../middleware/auth.js";

const adminOnly = requireRole("admin", "super_admin");

const router = Router();

// Public: record a page view
router.post("/pageview", async (req, res) => {
  try {
    const path = String(req.body?.path || "/").slice(0, 200);
    const ref = String(req.body?.ref || "").slice(0, 200);
    await PageView.create({ path, ref });
    res.status(201).json({ ok: true });
  } catch {
    // analytics must never break the site
    res.status(200).json({ ok: false });
  }
});

// Build a zero-filled per-day series for the last N days
function emptySeries(days) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return out;
}

async function dailyCounts(Model, days) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const rows = await Model.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const series = emptySeries(days);
  const map = new Map(rows.map((r) => [r._id, r.count]));
  series.forEach((s) => {
    if (map.has(s.date)) s.count = map.get(s.date);
  });
  return series;
}

// Admin: aggregated analytics
router.get("/", adminOnly, async (_req, res) => {
  const days = 14;

  const [
    totalViews,
    totalRegistrations,
    totalPosts,
    totalServices,
    viewsSeries,
    regsSeries,
    topServices,
    topPaths,
  ] = await Promise.all([
    PageView.estimatedDocumentCount(),
    Registration.estimatedDocumentCount(),
    Post.estimatedDocumentCount(),
    Service.estimatedDocumentCount(),
    dailyCounts(PageView, days),
    dailyCounts(Registration, days),
    Registration.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    PageView.aggregate([
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
  ]);

  res.json({
    totals: {
      views: totalViews,
      registrations: totalRegistrations,
      posts: totalPosts,
      services: totalServices,
    },
    viewsSeries,
    regsSeries,
    topServices: topServices.map((s) => ({ name: s._id || "—", count: s.count })),
    topPaths: topPaths.map((p) => ({ name: p._id || "/", count: p.count })),
  });
});

export default router;
