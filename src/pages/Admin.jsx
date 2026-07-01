import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineNewspaper,
  HiOutlineWrenchScrewdriver,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiArrowRightOnRectangle,
  HiArrowLeft,
  HiXMark,
  HiOutlineArrowDownTray,
  HiStar,
} from "react-icons/hi2";
import {
  useDB,
  login,
  logout,
  deleteRegistration,
  saveService,
  deleteService,
  savePost,
  deletePost,
} from "../lib/store";

/* ------------------------------------------------------------------ */
/* Login gate                                                          */
/* ------------------------------------------------------------------ */
function Login() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(pw);
    setBusy(false);
    if (!ok) setError(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,63,157,0.22),transparent_60%)] blur-3xl" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-line bg-ink-soft p-8"
      >
        <div className="mb-8 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
          <span className="font-display text-lg font-semibold">
            <span className="text-gradient">Hivenex.</span>
          </span>
          <span className="ml-auto text-xs uppercase tracking-[0.2em] text-haze">
            Admin
          </span>
        </div>
        <h1 className="font-display text-2xl font-medium">Sign in</h1>
        <p className="mt-2 text-sm text-haze">
          Enter the admin password to manage the studio.
        </p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className={`mt-6 w-full rounded-xl border bg-black/40 px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent ${
            error ? "border-red-500/60" : "border-line"
          }`}
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">Incorrect password.</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-violet mt-5 w-full rounded-xl px-6 py-3.5 font-medium disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Enter dashboard"}
        </button>
        <p className="mt-5 text-center text-xs text-haze">
          Demo password: <span className="text-white">admin123</span>
        </p>
        <Link
          to="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-haze transition-colors hover:text-white"
        >
          <HiArrowLeft /> Back to site
        </Link>
      </motion.form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */
function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-ink-soft"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h3 className="font-display text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-haze transition-colors hover:text-white"
            >
              <HiXMark />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-black/40 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-accent";
const labelCls =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-haze";

function Field({ label, children }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */
function Overview({ db, setTab }) {
  const cards = [
    { label: "Registrations", value: db.registrations.length, tab: "registrations" },
    { label: "Blog posts", value: db.posts.length, tab: "posts" },
    { label: "Services", value: db.services.length, tab: "services" },
  ];

  // simple per-service tally
  const byService = db.services.map((s) => ({
    name: s.title,
    count: db.registrations.filter((r) => r.service === s.title).length,
  }));
  const max = Math.max(1, ...byService.map((b) => b.count));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => setTab(c.tab)}
            className="group rounded-2xl border border-line bg-ink-soft p-6 text-left transition-colors hover:border-accent/40"
          >
            <div className="font-display text-5xl font-semibold">{c.value}</div>
            <p className="mt-2 text-sm text-haze">{c.label}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-ink-soft p-6">
        <h3 className="font-display text-lg font-medium">
          Registrations by service
        </h3>
        <div className="mt-6 space-y-4">
          {byService.map((b) => (
            <div key={b.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-white/85">{b.name}</span>
                <span className="text-haze">{b.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.count / max) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Registrations                                                       */
/* ------------------------------------------------------------------ */
function Registrations({ db }) {
  const rows = db.registrations;

  const exportCsv = () => {
    const header = ["Name", "Email", "Company", "Service", "Date"];
    const lines = rows.map((r) =>
      [r.name, r.email, r.company, r.service, new Date(r.createdAt).toLocaleString()]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "hivenex-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">
          {rows.length} service registration{rows.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={exportCsv}
          disabled={!rows.length}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-white transition-colors hover:border-accent/40 disabled:opacity-40"
        >
          <HiOutlineArrowDownTray /> Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center text-haze">
          No registrations yet. Submissions from the public register form land
          here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="hidden grid-cols-12 gap-4 border-b border-line bg-ink-soft px-5 py-3 text-xs uppercase tracking-[0.15em] text-haze md:grid">
            <span className="col-span-3">Name</span>
            <span className="col-span-3">Email</span>
            <span className="col-span-2">Company</span>
            <span className="col-span-2">Service</span>
            <span className="col-span-1">Date</span>
            <span className="col-span-1" />
          </div>
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-1 gap-1 border-b border-line px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.015] md:grid-cols-12 md:items-center md:gap-4"
            >
              <span className="col-span-3 font-medium text-white">{r.name}</span>
              <span className="col-span-3 text-haze">{r.email}</span>
              <span className="col-span-2 text-haze">{r.company || "—"}</span>
              <span className="col-span-2">
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                  {r.service}
                </span>
              </span>
              <span className="col-span-1 text-xs text-haze">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
              <span className="col-span-1 md:text-right">
                <button
                  onClick={() => deleteRegistration(r.id)}
                  className="text-haze transition-colors hover:text-red-400"
                  title="Delete"
                >
                  <HiOutlineTrash />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services manager                                                    */
/* ------------------------------------------------------------------ */
function ServiceForm({ initial, onClose }) {
  const [f, setF] = useState({
    title: initial?.title || "",
    desc: initial?.desc || "",
    tags: initial?.tags?.join(", ") || "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await saveService({ ...initial, ...f });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Title">
        <input className={inputCls} value={f.title} onChange={set("title")} placeholder="Web / App Development" />
      </Field>
      <Field label="Description">
        <textarea className={`${inputCls} min-h-24 resize-none`} value={f.desc} onChange={set("desc")} placeholder="What this service delivers…" />
      </Field>
      <Field label="Tags (comma separated)">
        <input className={inputCls} value={f.tags} onChange={set("tags")} placeholder="React, Next.js, React Native" />
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Add service"}
        </button>
      </div>
    </form>
  );
}

function Services({ db }) {
  const [editing, setEditing] = useState(null); // service object or "new"

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">{db.services.length} services</p>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          <HiPlus /> New service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {db.services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-ink-soft p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg font-medium">{s.title}</h3>
              <div className="flex shrink-0 gap-2 text-haze">
                <button onClick={() => setEditing(s)} className="transition-colors hover:text-accent" title="Edit">
                  <HiOutlinePencilSquare />
                </button>
                <button onClick={() => deleteService(s.id)} className="transition-colors hover:text-red-400" title="Delete">
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-haze">{s.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-haze">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "New service" : "Edit service"}
          onClose={() => setEditing(null)}
        >
          <ServiceForm
            initial={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Posts manager                                                       */
/* ------------------------------------------------------------------ */
function PostForm({ initial, onClose }) {
  const [f, setF] = useState({
    title: initial?.title || "",
    category: initial?.category || "",
    excerpt: initial?.excerpt || "",
    date: initial?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    read: initial?.read || "5 min read",
    featured: initial?.featured || false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await savePost({ ...initial, ...f });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Title">
        <input className={inputCls} value={f.title} onChange={set("title")} placeholder="Post headline" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <input className={inputCls} value={f.category} onChange={set("category")} placeholder="Development" />
        </Field>
        <Field label="Read time">
          <input className={inputCls} value={f.read} onChange={set("read")} placeholder="5 min read" />
        </Field>
      </div>
      <Field label="Date">
        <input className={inputCls} value={f.date} onChange={set("date")} placeholder="Jun 12, 2026" />
      </Field>
      <Field label="Excerpt">
        <textarea className={`${inputCls} min-h-24 resize-none`} value={f.excerpt} onChange={set("excerpt")} placeholder="Short summary…" />
      </Field>
      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={f.featured}
          onChange={(e) => setF({ ...f, featured: e.target.checked })}
          className="h-4 w-4 accent-[#d63f9d]"
        />
        <span className="flex items-center gap-1.5 text-white/85">
          <HiStar className="text-accent" /> Feature this post (shown large)
        </span>
      </label>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Publish post"}
        </button>
      </div>
    </form>
  );
}

function Posts({ db }) {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">{db.posts.length} posts</p>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          <HiPlus /> New post
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        {db.posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-white/[0.015]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {p.featured && <HiStar className="shrink-0 text-accent" />}
                <h3 className="truncate font-medium text-white">{p.title}</h3>
              </div>
              <p className="mt-0.5 text-xs text-haze">
                {p.category} · {p.date} · {p.read}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-haze">
              <button onClick={() => setEditing(p)} className="transition-colors hover:text-accent" title="Edit">
                <HiOutlinePencilSquare />
              </button>
              <button onClick={() => deletePost(p.id)} className="transition-colors hover:text-red-400" title="Delete">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "New post" : "Edit post"}
          onClose={() => setEditing(null)}
        >
          <PostForm
            initial={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard shell                                                     */
/* ------------------------------------------------------------------ */
const tabs = [
  { id: "overview", label: "Overview", icon: HiOutlineSquares2X2 },
  { id: "registrations", label: "Registrations", icon: HiOutlineUsers },
  { id: "posts", label: "Blog posts", icon: HiOutlineNewspaper },
  { id: "services", label: "Services", icon: HiOutlineWrenchScrewdriver },
];

export default function Admin() {
  const db = useDB();
  const [tab, setTab] = useState("overview");

  if (!db.auth.loggedIn) return <Login />;

  const active = tabs.find((t) => t.id === tab);

  return (
    <div className="min-h-screen bg-ink text-white lg:flex">
      {/* Sidebar */}
      <aside className="border-b border-line bg-ink-soft lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-6 lg:block">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
            <span className="font-display text-lg font-semibold">
              <span className="text-gradient">Hivenex.</span>
            </span>
          </Link>
          <span className="mt-1 hidden text-xs uppercase tracking-[0.2em] text-haze lg:block">
            Admin console
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-col">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  tab === t.id
                    ? "bg-accent/10 text-accent"
                    : "text-haze hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="text-lg" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden p-4 lg:absolute lg:bottom-0 lg:block lg:w-64">
          <Link
            to="/"
            className="mb-2 flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-haze transition-colors hover:bg-white/5 hover:text-white"
          >
            <HiArrowLeft /> View site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-haze transition-colors hover:bg-white/5 hover:text-white"
          >
            <HiArrowRightOnRectangle /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <header className="flex items-center justify-between border-b border-line px-6 py-6 md:px-10">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {active.label}
            </h1>
            <p className="mt-1 text-sm text-haze">
              Manage your studio content and leads.
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-haze transition-colors hover:text-white lg:hidden"
          >
            <HiArrowRightOnRectangle /> Log out
          </button>
        </header>

        <div className="p-6 md:p-10">
          {tab === "overview" && <Overview db={db} setTab={setTab} />}
          {tab === "registrations" && <Registrations db={db} />}
          {tab === "posts" && <Posts db={db} />}
          {tab === "services" && <Services db={db} />}
        </div>
      </main>
    </div>
  );
}
