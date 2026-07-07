import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./app.js";
import { ensureDB } from "./db.js";

const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

// Only serve the SPA when a build is actually present next to the server
// (single-service deploys / Docker). On an API-only host like Render there's no
// ../../dist, so we skip static serving and expose a JSON root instead.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasClientBuild = fs.existsSync(
  path.resolve(__dirname, "../../dist/index.html")
);

const app = createApp({ serveStatic: isProd && hasClientBuild });

// Warm the DB connection (routes also await it lazily, so a failure here is
// non-fatal — the server still boots and retries on the next request).
ensureDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  console.error("   Check MONGODB_URI / network access.");
});

app.listen(PORT, () =>
  console.log(
    `🚀 Server listening on http://localhost:${PORT} (${
      isProd ? "production" : "development"
    })`
  )
);
