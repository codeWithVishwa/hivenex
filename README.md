# Hivenex — Studio Site + Admin

A premium dark agency website (React + Vite + Tailwind v4 + Framer Motion) with a
Node/Express/MongoDB backend powering services, blog posts and service
registrations, plus a password-gated admin dashboard.

## Stack

- **Frontend** — React 19, Vite, Tailwind CSS v4, Framer Motion, React Router
- **Backend** — Express, MongoDB (Mongoose), JWT auth
- **Routes** — `/` public site · `/admin` dashboard

## Prerequisites

- Node 18+
- A running **MongoDB** (local `mongodb://127.0.0.1:27017` or Atlas URI)

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then edit values
npm run dev            # http://localhost:5000
```

`.env` keys:

| Key                    | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `PORT`                 | API port (default 5000)                          |
| `MONGODB_URI`          | Mongo connection string                          |
| `JWT_SECRET`           | Secret used to sign auth tokens                  |
| `SUPER_ADMIN_USERNAME` | Seeded super admin username (default `superadmin`) |
| `SUPER_ADMIN_PASSWORD` | Seeded super admin password (falls back to `ADMIN_PASSWORD`) |
| `CLIENT_ORIGIN`        | Allowed CORS origin(s), comma-separated          |

On first boot the server seeds default content (services, posts, projects,
FAQ, stats) and the **super admin** account.

### 2. Frontend

```bash
# from the project root
npm install
npm run dev            # http://localhost:5173
```

Vite proxies `/api` → `http://localhost:5000`, so run both at once.

## Admin & roles

Visit `http://localhost:5173/admin` and sign in with a **username + password**.
On first run a **super admin** is seeded from `SUPER_ADMIN_USERNAME` /
`SUPER_ADMIN_PASSWORD` (falls back to `superadmin` / `ADMIN_PASSWORD`).

Three roles, enforced on the backend and reflected in the dashboard tabs:

| Role | Can do |
| ---- | ------ |
| **super_admin** | Everything, **plus** create/remove admins & moderators (Team tab) |
| **admin** | Manage all content — services, projects, blog, FAQ, stats, registrations, analytics |
| **moderator** | Manage **blog posts only** |

From the dashboard you can view/export **registrations** (CSV), manage **blog
posts**, **services**, **projects (Selected work)**, **FAQ**, **stats**, see
**analytics**, and (super admin) manage the **team**.

## Production

In production the Express server also serves the built React app, so the whole
thing runs as **one service** (API under `/api`, SPA everywhere else). This is
enabled when `NODE_ENV=production`.

### Build & run locally

```bash
npm run setup      # installs root + server deps
npm run build      # builds the frontend into ./dist
NODE_ENV=production npm start   # server serves ./dist + /api on :5000
```

Then open `http://localhost:5000`.

### Docker (single image)

```bash
docker build -t hivenex .
docker run -p 5000:5000 --env-file server/.env hivenex
```

### Deploy to Vercel (recommended)

The API runs as a **serverless function** (`api/[...path].js`, a catch-all that
wraps the Express app) and the frontend is served as static files — all from
this one repo. Config lives in [`vercel.json`](vercel.json).

**1. Push to GitHub**, then in Vercel: **Add New → Project → import the repo.**
The framework auto-detects as Vite; leave the defaults (build `vite build`,
output `dist`). `vercel.json` handles routing:
- `/api/*` → the serverless Express function
- everything else → `index.html` (SPA), with static assets served directly

**2. Add Environment Variables** (Project → Settings → Environment Variables):

| Key | Value |
| --- | ----- |
| `MONGODB_URI` | Your MongoDB **Atlas** SRV connection string |
| `JWT_SECRET` | A long random string |
| `SUPER_ADMIN_USERNAME` | e.g. `superadmin` |
| `SUPER_ADMIN_PASSWORD` | A strong password |
| `CLIENT_ORIGIN` | *(optional — same-origin, so usually unneeded)* |

**3. MongoDB Atlas → Network Access:** allow `0.0.0.0/0` (Vercel functions use
dynamic IPs). Without this the function can't reach the database.

**4. Deploy.** On first request the DB connects (cached across warm
invocations) and seeds default content + the super admin. Visit `/admin`.

Or via CLI: `npm i -g vercel` → `vercel` (preview) → `vercel --prod`.

> Note: local dev/Docker still use `server/` with its own `package.json`. The
> backend deps are **also** in the root `package.json` so Vercel installs them
> for the function — keep the two in sync if you upgrade.

### Split deploy — backend on Render, frontend on Vercel/Netlify

The API and the site live on **different origins**. There's a
[`render.yaml`](render.yaml) Blueprint for the backend.

**Backend on Render** (New → Blueprint, or New → Web Service):

| Setting | Value |
| ------- | ----- |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Env vars | `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`, and optionally `CLIENT_ORIGIN` |

Render provides `PORT` automatically. The server detects there's no frontend
build present and runs **API-only** (root `/` returns a JSON health payload).
On MongoDB Atlas, allow Render's outbound IPs (or `0.0.0.0/0`).

**Frontend** (Vercel / Netlify / Render static site) — build it pointing at the
Render API by setting **one build-time env var**:

```
VITE_API_URL=https://<your-service>.onrender.com/api
```

Then set **`CLIENT_ORIGIN`** on the Render service to your frontend URL
(comma-separate multiples). Leaving it unset allows any origin — safe here since
the API authenticates with JWTs (not cookies), but setting it is tidier.

> On the **free** Render plan the service sleeps after inactivity, so the first
> request after idle takes ~50s to cold-start.
>
> If you're already deploying the whole thing on Vercel (previous section), you
> don't need Render — pick one. With Render as the backend, the Vercel `/api`
> function simply goes unused.

### Hardening included

- `helmet` security headers + `compression`
- Rate limiting on `/api/auth` (20/15min) and `/api/registrations` (30/15min)
- 100 kb JSON body limit, `trust proxy` for correct client IPs
- CORS locked to `CLIENT_ORIGIN`

### Before going live

- **Rotate secrets:** use a long random `JWT_SECRET` and a strong
  `SUPER_ADMIN_PASSWORD` (the defaults/committed values are for local dev only).
  Then change the super admin's password from the Team tab.
- Restrict MongoDB Atlas network access to your host's IPs.
- `.env` files are gitignored — never commit real credentials.

## API

`admin+` = admin or super_admin · `mod+` = moderator, admin or super_admin.
Projects, FAQ and stats follow the same `GET —` / write `admin+` pattern as services.

| Method | Route                      | Auth        | Description            |
| ------ | -------------------------- | ----------- | ---------------------- |
| POST   | `/api/auth/login`          | —           | Log in → token + user  |
| GET    | `/api/auth/me`             | any user    | Current user           |
| GET    | `/api/services` `/posts` … | —           | List content           |
| POST/PUT/DELETE | `/api/posts/*`    | mod+        | Manage blog posts      |
| POST/PUT/DELETE | `/api/services\|projects\|faqs\|stats/*` | admin+ | Manage content |
| POST   | `/api/registrations`       | —           | Submit a registration  |
| GET/DELETE | `/api/registrations/*` | admin+      | View / delete leads    |
| GET    | `/api/analytics`           | admin+      | Aggregated analytics   |
| POST   | `/api/analytics/pageview`  | —           | Record a page view     |
| GET/POST/PUT/DELETE | `/api/users/*` | super_admin | Manage team members    |
