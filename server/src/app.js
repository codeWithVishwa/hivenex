import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { ensureDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import postRoutes from "./routes/posts.js";
import registrationRoutes from "./routes/registrations.js";
import projectRoutes from "./routes/projects.js";
import faqRoutes from "./routes/faqs.js";
import statRoutes from "./routes/stats.js";
import analyticsRoutes from "./routes/analytics.js";
import userRoutes from "./routes/users.js";
import clientRoutes from "./routes/clients.js";
import workRoutes from "./routes/work.js";
import uploadRoutes from "./routes/uploads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the Express API app (used by index.js for every deploy target).
 *
 * @param {{ serveStatic?: boolean }} options - also serve the built SPA from
 *   ../../dist. True for single-service deploys (Docker / VPS) where the
 *   frontend ships with the server; false for API-only hosts like Render where
 *   the frontend is deployed separately.
 */
export function createApp({ serveStatic = false } = {}) {
  const app = express();

  // Behind a proxy (Vercel / Render / Nginx) so rate-limit sees real client IPs
  app.set("trust proxy", 1);

  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
  );
  app.use(compression());

  // CORS — allow a comma-separated CLIENT_ORIGIN list, or reflect any in dev.
  // (Same-origin deploys don't trigger CORS at all.)
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));

  app.use(express.json({ limit: "100kb" }));

  // Health check — process liveness only, independent of the DB so it responds
  // instantly (Render/uptime pings, cold starts).
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Ensure the (cached) DB connection is ready before any data route runs
  app.use("/api", async (_req, res, next) => {
    try {
      await ensureDB();
      next();
    } catch (err) {
      console.error("DB connection error:", err.message);
      res.status(503).json({ error: "Database unavailable" });
    }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts, try again later." },
  });
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/registrations", writeLimiter, registrationRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/faqs", faqRoutes);
  app.use("/api/stats", statRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/users", authLimiter, userRoutes);
  app.use("/api/clients", clientRoutes);
  app.use("/api/work", workRoutes);
  app.use("/api/uploads", uploadRoutes);

  // JSON 404 for unknown API routes
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  // Serve the built frontend (local prod / Docker single-service only)
  if (serveStatic) {
    const clientDir = path.resolve(__dirname, "../../dist");
    app.use(express.static(clientDir));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  } else {
    // API-only deploy (e.g. Render): a friendly root + a health check target
    app.get("/", (_req, res) =>
      res.json({ ok: true, service: "hivenex-api", health: "/api/health" })
    );
  }

  // Error handler (last)
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  });

  return app;
}

export default createApp;
