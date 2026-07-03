import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dns from "dns/promises";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import postRoutes from "./routes/posts.js";
import registrationRoutes from "./routes/registrations.js";
import projectRoutes from "./routes/projects.js";
import faqRoutes from "./routes/faqs.js";
import statRoutes from "./routes/stats.js";
import analyticsRoutes from "./routes/analytics.js";

// Prefer public resolvers (helps with some MongoDB Atlas SRV lookups)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const app = express();
const PORT = process.env.PORT || 5000;

// Behind a proxy (Render/Railway/Nginx) so rate-limit & secure cookies work
app.set("trust proxy", 1);

// Security headers. CSP is disabled here because the SPA + WebGL effects inline
// styles/blobs; the static host/CDN can layer a stricter CSP if desired.
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());

// CORS — allow a comma-separated list of origins, or all in dev
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);

app.use(express.json({ limit: "100kb" }));

// Rate limiters on the sensitive endpoints
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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/registrations", writeLimiter, registrationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/analytics", analyticsRoutes);

// ---- Serve the built frontend in production (single-service deploy) ----
if (isProd) {
  const clientDir = path.resolve(__dirname, "../../dist");
  app.use(express.static(clientDir));
  // SPA fallback: any non-API GET returns index.html
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

// JSON 404 for unknown API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Fallback error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Check MONGODB_URI / network access, then restart.");
  }
  // Listen regardless so the service is reachable even if the DB is momentarily down.
  app.listen(PORT, () =>
    console.log(
      `🚀 Server listening on http://localhost:${PORT} (${isProd ? "production" : "development"})`
    )
  );
}

start();
