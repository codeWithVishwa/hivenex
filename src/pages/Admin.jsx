import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineNewspaper,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBarSquare,
  HiOutlineBriefcase,
  HiOutlineQuestionMarkCircle,
  HiOutlineHashtag,
  HiOutlineUserGroup,
  HiOutlineKey,
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
  saveProject,
  deleteProject,
  saveFaq,
  deleteFaq,
  saveStat,
  deleteStat,
  loadAnalytics,
  createUser,
  deleteUser,
  resetUserPassword,
} from "../lib/store";

/* ------------------------------------------------------------------ */
/* Login gate                                                          */
/* ------------------------------------------------------------------ */
function Login() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(username.trim(), pw);
    setBusy(false);
    if (!ok) setError(true);
  };

  const fieldCls = (bad) =>
    `mt-2 w-full rounded-xl border bg-black/40 px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent ${
      bad ? "border-red-500/60" : "border-line"
    }`;

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
            Team
          </span>
        </div>
        <h1 className="font-display text-2xl font-medium">Sign in</h1>
        <p className="mt-2 text-sm text-haze">
          Sign in with your team credentials.
        </p>

        <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-haze">
          Username
        </label>
        <input
          autoFocus
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(false);
          }}
          placeholder="username"
          autoComplete="username"
          className={fieldCls(error)}
        />

        <label className="mt-4 block text-xs uppercase tracking-[0.15em] text-haze">
          Password
        </label>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="••••••••"
          autoComplete="current-password"
          className={fieldCls(error)}
        />

        {error && (
          <p className="mt-3 text-xs text-red-400">Invalid username or password.</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-violet mt-6 w-full rounded-xl px-6 py-3.5 font-medium disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Enter dashboard"}
        </button>
        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs text-haze transition-colors hover:text-white"
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
  const [expanded, setExpanded] = useState(null);

  const exportCsv = () => {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Budget",
      "Timeline",
      "Message",
      "Date",
    ];
    const lines = rows.map((r) =>
      [
        r.name,
        r.email,
        r.phone || "",
        r.company || "",
        r.service,
        r.budget || "",
        r.timeline || "",
        r.message || "",
        new Date(r.createdAt).toLocaleString(),
      ]
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
          {rows.map((r) => {
            const isOpen = expanded === r.id;
            const hasDetail = r.phone || r.budget || r.timeline || r.message;
            return (
              <div key={r.id} className="border-b border-line last:border-b-0">
                <div
                  onClick={() => hasDetail && setExpanded(isOpen ? null : r.id)}
                  className={`grid grid-cols-1 gap-1 px-5 py-4 text-sm hover:bg-white/[0.015] md:grid-cols-12 md:items-center md:gap-4 ${
                    hasDetail ? "cursor-pointer" : ""
                  }`}
                >
                  <span className="col-span-3 flex items-center gap-2 font-medium text-white">
                    {hasDetail && (
                      <span className={`text-haze transition-transform ${isOpen ? "rotate-90" : ""}`}>
                        ›
                      </span>
                    )}
                    {r.name}
                  </span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRegistration(r.id);
                      }}
                      className="text-haze transition-colors hover:text-red-400"
                      title="Delete"
                    >
                      <HiOutlineTrash />
                    </button>
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && hasDetail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="grid grid-cols-1 gap-4 px-5 py-4 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-haze">Phone</p>
                          <p className="mt-1 text-white/85">{r.phone || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-haze">Budget</p>
                          <p className="mt-1 text-white/85">{r.budget || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-haze">Timeline</p>
                          <p className="mt-1 text-white/85">{r.timeline || "—"}</p>
                        </div>
                        <div className="sm:col-span-3">
                          <p className="text-xs uppercase tracking-[0.15em] text-haze">Message</p>
                          <p className="mt-1 whitespace-pre-wrap text-white/85">
                            {r.message || "—"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
    content: initial?.content || "",
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
        <textarea className={`${inputCls} min-h-20 resize-none`} value={f.excerpt} onChange={set("excerpt")} placeholder="Short summary shown on cards…" />
      </Field>
      <Field label="Content (full article — blank lines separate paragraphs)">
        <textarea className={`${inputCls} min-h-40 resize-y`} value={f.content} onChange={set("content")} placeholder="Write the full post here…" />
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
/* Analytics                                                           */
/* ------------------------------------------------------------------ */
function BarChart({ series, accent = "#d63f9d", label }) {
  const max = Math.max(1, ...series.map((d) => d.count));
  return (
    <div className="rounded-2xl border border-line bg-ink-soft p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium">{label}</h3>
        <span className="text-sm text-haze">
          {series.reduce((a, b) => a + b.count, 0)} total · last {series.length}d
        </span>
      </div>
      <div className="flex h-40 items-end gap-1.5">
        {series.map((d) => (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end">
            <div className="pointer-events-none absolute -top-7 hidden rounded-md border border-line bg-black/80 px-2 py-1 text-[11px] group-hover:block">
              {d.count}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-h-[3px] rounded-t"
              style={{ background: accent, opacity: d.count ? 1 : 0.25 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-haze">
        <span>{series[0]?.date.slice(5)}</span>
        <span>{series[series.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

function RankBars({ title, rows, accent = "#8b5cf6" }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-line bg-ink-soft p-6">
      <h3 className="font-display text-lg font-medium">{title}</h3>
      <div className="mt-5 space-y-4">
        {rows.length === 0 && <p className="text-sm text-haze">No data yet.</p>}
        {rows.map((r) => (
          <div key={r.name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="truncate text-white/85">{r.name}</span>
              <span className="text-haze">{r.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.count / max) * 100}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: accent }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadAnalytics()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  if (error)
    return <p className="text-sm text-red-400">Couldn't load analytics: {error}</p>;
  if (!data)
    return <p className="text-sm text-haze">Loading analytics…</p>;

  const cards = [
    { label: "Page views", value: data.totals.views },
    { label: "Registrations", value: data.totals.registrations },
    { label: "Blog posts", value: data.totals.posts },
    { label: "Services", value: data.totals.services },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-ink-soft p-6">
            <div className="font-display text-4xl font-semibold">{c.value}</div>
            <p className="mt-2 text-sm text-haze">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarChart series={data.viewsSeries} accent="#8b5cf6" label="Page views" />
        <BarChart series={data.regsSeries} accent="#d63f9d" label="Registrations" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RankBars title="Registrations by service" rows={data.topServices} accent="#d63f9d" />
        <RankBars title="Top pages" rows={data.topPaths} accent="#8b5cf6" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Projects (Selected Work) manager                                    */
/* ------------------------------------------------------------------ */
function ProjectForm({ initial, onClose }) {
  const [f, setF] = useState({
    name: initial?.name || "",
    category: initial?.category || "",
    year: initial?.year || String(new Date().getFullYear()),
    accent: initial?.accent || "#8b5cf6",
    url: initial?.url || "",
    order: initial?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await saveProject({ ...initial, ...f, order: Number(f.order) || 0 });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Project name">
        <input className={inputCls} value={f.name} onChange={set("name")} placeholder="Lumen Finance" />
      </Field>
      <Field label="Category">
        <input className={inputCls} value={f.category} onChange={set("category")} placeholder="Fintech · Brand + Web" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Year">
          <input className={inputCls} value={f.year} onChange={set("year")} placeholder="2025" />
        </Field>
        <Field label="Order">
          <input type="number" className={inputCls} value={f.order} onChange={set("order")} />
        </Field>
      </div>
      <Field label="Case-study URL (optional)">
        <input className={inputCls} value={f.url} onChange={set("url")} placeholder="https://…" />
      </Field>
      <Field label="Accent colour">
        <div className="flex items-center gap-3">
          <input type="color" value={f.accent} onChange={set("accent")} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-transparent" />
          <input className={inputCls} value={f.accent} onChange={set("accent")} placeholder="#8b5cf6" />
        </div>
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Add project"}
        </button>
      </div>
    </form>
  );
}

function Projects({ db }) {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">{db.projects.length} projects</p>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
          <HiPlus /> New project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {db.projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-ink-soft p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 rounded-lg border border-white/10" style={{ background: p.accent }} />
                <div>
                  <h3 className="font-display text-lg font-medium">{p.name}</h3>
                  <p className="text-xs text-haze">{p.category || "—"} · {p.year}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 text-haze">
                <button onClick={() => setEditing(p)} className="transition-colors hover:text-accent" title="Edit"><HiOutlinePencilSquare /></button>
                <button onClick={() => deleteProject(p.id)} className="transition-colors hover:text-red-400" title="Delete"><HiOutlineTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "New project" : "Edit project"} onClose={() => setEditing(null)}>
          <ProjectForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ manager                                                         */
/* ------------------------------------------------------------------ */
function FaqForm({ initial, onClose }) {
  const [f, setF] = useState({
    question: initial?.question || "",
    answer: initial?.answer || "",
    order: initial?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.question.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await saveFaq({ ...initial, ...f, order: Number(f.order) || 0 });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Question">
        <input className={inputCls} value={f.question} onChange={set("question")} placeholder="How much does a project cost?" />
      </Field>
      <Field label="Answer">
        <textarea className={`${inputCls} min-h-32 resize-y`} value={f.answer} onChange={set("answer")} placeholder="Write the answer…" />
      </Field>
      <Field label="Order">
        <input type="number" className={inputCls} value={f.order} onChange={set("order")} />
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Add FAQ"}
        </button>
      </div>
    </form>
  );
}

function Faqs({ db }) {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">{db.faqs.length} questions</p>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
          <HiPlus /> New FAQ
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        {db.faqs.map((q) => (
          <div key={q.id} className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-white/[0.015]">
            <div className="min-w-0">
              <h3 className="font-medium text-white">{q.question}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs text-haze">{q.answer}</p>
            </div>
            <div className="flex shrink-0 gap-3 text-haze">
              <button onClick={() => setEditing(q)} className="transition-colors hover:text-accent" title="Edit"><HiOutlinePencilSquare /></button>
              <button onClick={() => deleteFaq(q.id)} className="transition-colors hover:text-red-400" title="Delete"><HiOutlineTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "New FAQ" : "Edit FAQ"} onClose={() => setEditing(null)}>
          <FaqForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats manager                                                       */
/* ------------------------------------------------------------------ */
function StatForm({ initial, onClose }) {
  const [f, setF] = useState({
    value: initial?.value ?? 0,
    suffix: initial?.suffix || "",
    label: initial?.label || "",
    order: initial?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.label.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await saveStat({ ...initial, ...f, value: Number(f.value) || 0, order: Number(f.order) || 0 });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Value (number)">
          <input type="number" className={inputCls} value={f.value} onChange={set("value")} placeholder="120" />
        </Field>
        <Field label="Suffix">
          <input className={inputCls} value={f.suffix} onChange={set("suffix")} placeholder="+ / yr / %" />
        </Field>
      </div>
      <Field label="Label">
        <input className={inputCls} value={f.label} onChange={set("label")} placeholder="Projects shipped" />
      </Field>
      <Field label="Order">
        <input type="number" className={inputCls} value={f.order} onChange={set("order")} />
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Save changes" : "Add stat"}
        </button>
      </div>
    </form>
  );
}

function Stats({ db }) {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">{db.stats.length} stats</p>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
          <HiPlus /> New stat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {db.stats.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-ink-soft p-5">
            <div className="flex items-start justify-between">
              <div className="font-display text-3xl font-semibold">
                {s.value}
                <span className="text-accent">{s.suffix}</span>
              </div>
              <div className="flex gap-2 text-haze">
                <button onClick={() => setEditing(s)} className="transition-colors hover:text-accent" title="Edit"><HiOutlinePencilSquare /></button>
                <button onClick={() => deleteStat(s.id)} className="transition-colors hover:text-red-400" title="Delete"><HiOutlineTrash /></button>
              </div>
            </div>
            <p className="mt-2 text-sm text-haze">{s.label}</p>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "New stat" : "Edit stat"} onClose={() => setEditing(null)}>
          <StatForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Team (users) manager — super admin only                             */
/* ------------------------------------------------------------------ */
const roleLabel = {
  super_admin: "Super admin",
  admin: "Admin",
  moderator: "Moderator",
};

function UserForm({ onClose }) {
  const [f, setF] = useState({ username: "", password: "", role: "moderator" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.username.trim() || f.password.length < 6) {
      setErr("Username and a 6+ character password are required.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await createUser({
        username: f.username.trim().toLowerCase(),
        password: f.password,
        role: f.role,
      });
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Username">
        <input className={inputCls} value={f.username} onChange={set("username")} placeholder="jane" autoComplete="off" />
      </Field>
      <Field label="Temporary password (6+ chars)">
        <input className={inputCls} value={f.password} onChange={set("password")} placeholder="••••••••" />
      </Field>
      <Field label="Role">
        <select className={`${inputCls} text-white`} value={f.role} onChange={set("role")}>
          <option value="moderator" className="text-black">Moderator — can only manage blog posts</option>
          <option value="admin" className="text-black">Admin — can manage all content</option>
        </select>
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Creating…" : "Create member"}
        </button>
      </div>
    </form>
  );
}

function ResetForm({ user, onClose }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 6) {
      setErr("Password must be 6+ characters.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await resetUserPassword(user.id, pw);
      onClose();
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm text-haze">
        Set a new password for <span className="text-white">{user.username}</span>.
      </p>
      <Field label="New password (6+ chars)">
        <input className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
      </Field>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-sm text-haze hover:text-white">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : "Reset password"}
        </button>
      </div>
    </form>
  );
}

function Team({ db }) {
  const [creating, setCreating] = useState(false);
  const [resetting, setResetting] = useState(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-haze">
          {db.users.length} team member{db.users.length === 1 ? "" : "s"}
        </p>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
          <HiPlus /> New member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        {db.users.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-white/[0.015]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 font-display text-sm uppercase text-white">
                {u.username.slice(0, 2)}
              </span>
              <div>
                <h3 className="font-medium text-white">{u.username}</h3>
                <span
                  className={`text-xs ${
                    u.role === "super_admin"
                      ? "text-accent"
                      : u.role === "admin"
                      ? "text-accent-soft"
                      : "text-haze"
                  }`}
                >
                  {roleLabel[u.role]}
                </span>
              </div>
            </div>
            {u.role !== "super_admin" && (
              <div className="flex shrink-0 gap-3 text-haze">
                <button onClick={() => setResetting(u)} className="transition-colors hover:text-accent" title="Reset password">
                  <HiOutlineKey />
                </button>
                <button onClick={() => deleteUser(u.id)} className="transition-colors hover:text-red-400" title="Remove">
                  <HiOutlineTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {creating && (
        <Modal title="New team member" onClose={() => setCreating(false)}>
          <UserForm onClose={() => setCreating(false)} />
        </Modal>
      )}
      {resetting && (
        <Modal title="Reset password" onClose={() => setResetting(null)}>
          <ResetForm user={resetting} onClose={() => setResetting(null)} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard shell                                                     */
/* ------------------------------------------------------------------ */
const ADMIN = ["admin", "super_admin"];
const ALL = ["moderator", "admin", "super_admin"];

const tabs = [
  { id: "overview", label: "Overview", icon: HiOutlineSquares2X2, roles: ADMIN },
  { id: "analytics", label: "Analytics", icon: HiOutlineChartBarSquare, roles: ADMIN },
  { id: "registrations", label: "Registrations", icon: HiOutlineUsers, roles: ADMIN },
  { id: "projects", label: "Selected work", icon: HiOutlineBriefcase, roles: ADMIN },
  { id: "services", label: "Services", icon: HiOutlineWrenchScrewdriver, roles: ADMIN },
  { id: "posts", label: "Blog posts", icon: HiOutlineNewspaper, roles: ALL },
  { id: "faqs", label: "FAQ", icon: HiOutlineQuestionMarkCircle, roles: ADMIN },
  { id: "stats", label: "Stats", icon: HiOutlineHashtag, roles: ADMIN },
  { id: "team", label: "Team", icon: HiOutlineUserGroup, roles: ["super_admin"] },
];

export default function Admin() {
  const db = useDB();
  const role = db.auth.user?.role;
  const visibleTabs = tabs.filter((t) => t.roles.includes(role));
  const [tab, setTab] = useState("posts");

  // Keep the active tab valid for the current role
  useEffect(() => {
    if (
      db.auth.loggedIn &&
      visibleTabs.length &&
      !visibleTabs.some((t) => t.id === tab)
    ) {
      setTab(visibleTabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db.auth.loggedIn, role]);

  if (!db.auth.loggedIn) return <Login />;

  const active = visibleTabs.find((t) => t.id === tab) || visibleTabs[0];

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
            {roleLabel[role] || "Console"}
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-col">
          {visibleTabs.map((t) => {
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
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-line px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs uppercase text-white">
              {(db.auth.user?.username || "?").slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-white">
                {db.auth.user?.username}
              </p>
              <p className="text-xs text-haze">{roleLabel[role]}</p>
            </div>
          </div>
          <Link
            to="/"
            className="mb-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-haze transition-colors hover:bg-white/5 hover:text-white"
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
              {active?.label}
            </h1>
            <p className="mt-1 text-sm text-haze">
              {role === "moderator"
                ? "Create and manage blog posts."
                : "Manage your studio content and leads."}
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
          {tab === "analytics" && <Analytics />}
          {tab === "registrations" && <Registrations db={db} />}
          {tab === "projects" && <Projects db={db} />}
          {tab === "services" && <Services db={db} />}
          {tab === "posts" && <Posts db={db} />}
          {tab === "faqs" && <Faqs db={db} />}
          {tab === "stats" && <Stats db={db} />}
          {tab === "team" && <Team db={db} />}
        </div>
      </main>
    </div>
  );
}
