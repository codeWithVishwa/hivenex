// Vercel serverless entry — wraps the Express API.
// This catch-all function receives every /api/* request via Vercel's filesystem
// routing, so the Express routers mounted at /api/* match req.url directly.
// Static files and the SPA are served by Vercel, so we don't serve static here.
import { createApp } from "../server/src/app.js";

export default createApp({ serveStatic: false });
