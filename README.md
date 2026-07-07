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

### Deploy to a PaaS (Render / Railway / Fly / VPS)

- **Build command:** `npm run setup && npm run build`
- **Start command:** `npm start`
- **Env vars:** set `NODE_ENV=production` plus every key from `server/.env`
  (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN`, `PORT`).

Set `CLIENT_ORIGIN` to your public URL (comma-separate multiple origins). For a
single-service deploy the frontend calls the same origin, so you don't need
`VITE_API_URL`. For a **split** deploy (static frontend + separate API), set
`VITE_API_URL=https://your-api-host/api` at build time (see `.env.example`).

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
