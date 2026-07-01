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

| Key             | Purpose                                  |
| --------------- | ---------------------------------------- |
| `PORT`          | API port (default 5000)                  |
| `MONGODB_URI`   | Mongo connection string                  |
| `JWT_SECRET`    | Secret used to sign admin tokens         |
| `ADMIN_PASSWORD`| Password for the admin dashboard login   |
| `CLIENT_ORIGIN` | Allowed CORS origin (Vite dev = :5173)   |

On first boot the server seeds default services and blog posts.

### 2. Frontend

```bash
# from the project root
npm install
npm run dev            # http://localhost:5173
```

Vite proxies `/api` → `http://localhost:5000`, so run both at once.

## Admin

Visit `http://localhost:5173/admin` and log in with `ADMIN_PASSWORD`
(default `admin123`). From there you can:

- View / export service **registrations** (CSV)
- Create, edit, delete **blog posts** (one featured at a time)
- Create, edit, delete **services** (the register form dropdown updates live)

## API

| Method | Route                     | Auth  | Description              |
| ------ | ------------------------- | ----- | ------------------------ |
| POST   | `/api/auth/login`         | —     | Get a JWT                |
| GET    | `/api/services`           | —     | List services           |
| POST   | `/api/services`           | admin | Create service          |
| PUT    | `/api/services/:id`       | admin | Update service          |
| DELETE | `/api/services/:id`       | admin | Delete service          |
| GET    | `/api/posts`              | —     | List posts              |
| POST   | `/api/posts`              | admin | Create post             |
| PUT    | `/api/posts/:id`          | admin | Update post             |
| DELETE | `/api/posts/:id`          | admin | Delete post             |
| POST   | `/api/registrations`      | —     | Submit a registration   |
| GET    | `/api/registrations`      | admin | List registrations      |
| DELETE | `/api/registrations/:id`  | admin | Delete registration     |
