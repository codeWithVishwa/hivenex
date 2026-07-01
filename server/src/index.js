import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import postRoutes from "./routes/posts.js";
import registrationRoutes from "./routes/registrations.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/registrations", registrationRoutes);

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
    console.error("   Make sure MongoDB is running, then restart the server.");
  }
  // Listen regardless so the API is reachable even if DB is momentarily down.
  app.listen(PORT, () =>
    console.log(`🚀 API listening on http://localhost:${PORT}`)
  );
}

start();
