import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowLeft, HiArrowUpRight, HiCheck } from "react-icons/hi2";
import { useDB, addRegistration, trackPageview } from "../lib/store";

const budgets = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k – $100k",
  "$100k+",
];
const timelines = [
  "ASAP",
  "1–2 months",
  "3–6 months",
  "Just exploring",
];
const perks = [
  "A tailored proposal within 48 hours",
  "A free 30-minute discovery call",
  "Direct access to the makers — no middlemen",
];

const initial = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

const inputCls =
  "w-full rounded-xl border bg-black/40 px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-accent";
const selectCls =
  "w-full appearance-none rounded-xl border bg-black/40 px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent";

export default function RegisterPage() {
  const { services } = useDB();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview("/register");
  }, []);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.service) next.service = "Pick a service";
    if (form.message.trim().length < 10)
      next.message = "A little more detail helps (min. 10 characters)";
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    setSubmitError("");
    try {
      await addRegistration(form);
      setDone(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const border = (key) => (errors[key] ? "border-red-500/60" : "border-line");

  return (
    <div className="relative min-h-screen bg-ink text-white">
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-line bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
            <span className="font-display text-lg font-semibold">
              <span className="text-gradient">Hivenex.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-haze transition-colors hover:text-white"
          >
            <HiArrowLeft /> Back to site
          </Link>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(214,63,157,0.16),transparent_70%)]" />

      <main className="relative mx-auto max-w-5xl px-6 py-14 md:py-20">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl rounded-3xl border border-line bg-ink-soft p-10 text-center md:p-14"
            >
              <span className="btn-violet mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <HiCheck className="text-3xl" />
              </span>
              <h1 className="mt-6 font-display text-3xl font-semibold">
                Request received 🎉
              </h1>
              <p className="mt-4 text-haze">
                Thanks, {form.name.split(" ")[0] || "there"}. We've logged your
                project and a strategist will reach out within 48 hours to book
                your discovery call.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/"
                  className="btn-violet inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                >
                  Back to home <HiArrowUpRight />
                </Link>
                <button
                  onClick={() => {
                    setForm(initial);
                    setDone(false);
                  }}
                  className="rounded-full border border-line px-6 py-3 text-sm text-haze transition-colors hover:text-white"
                >
                  Submit another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
            >
              {/* Left — pitch */}
              <div>
                <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
                  <span className="h-px w-8 bg-accent" /> Start a project
                </span>
                <h1 className="fluid-h2 font-display font-semibold">
                  Let's build something worth talking about.
                </h1>
                <p className="mt-6 max-w-md leading-relaxed text-haze">
                  Tell us about your project and we'll come back with a plan.
                  The more detail you share, the sharper our proposal.
                </p>
                <ul className="mt-10 space-y-4">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-white/85">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <HiCheck className="text-sm" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-10 text-sm text-haze">
                  Prefer email?{" "}
                  <a
                    href="mailto:hello@hivenex.studio"
                    className="text-white underline-offset-4 hover:underline"
                  >
                    hello@hivenex.studio
                  </a>
                </p>
              </div>

              {/* Right — form */}
              <form
                onSubmit={submit}
                noValidate
                className="rounded-3xl border border-line bg-ink-soft p-7 md:p-9"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Full name *
                    </label>
                    <input
                      className={`${inputCls} ${border("name")}`}
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Ada Lovelace"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`${inputCls} ${border("email")}`}
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Phone
                    </label>
                    <input
                      className={`${inputCls} border-line`}
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="+1 555 000 1234"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Company
                    </label>
                    <input
                      className={`${inputCls} border-line`}
                      value={form.company}
                      onChange={update("company")}
                      placeholder="Studio Inc."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Service you need *
                    </label>
                    <select
                      className={`${selectCls} ${border("service")} ${
                        form.service ? "text-white" : "text-white/30"
                      }`}
                      value={form.service}
                      onChange={update("service")}
                    >
                      <option value="" disabled className="text-black">
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="text-black">
                          {s.title}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Budget
                    </label>
                    <select
                      className={`${selectCls} border-line ${
                        form.budget ? "text-white" : "text-white/30"
                      }`}
                      value={form.budget}
                      onChange={update("budget")}
                    >
                      <option value="" className="text-black">
                        Select a range
                      </option>
                      {budgets.map((b) => (
                        <option key={b} value={b} className="text-black">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Timeline
                    </label>
                    <select
                      className={`${selectCls} border-line ${
                        form.timeline ? "text-white" : "text-white/30"
                      }`}
                      value={form.timeline}
                      onChange={update("timeline")}
                    >
                      <option value="" className="text-black">
                        Select a timeline
                      </option>
                      {timelines.map((t) => (
                        <option key={t} value={t} className="text-black">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze">
                      Project details *
                    </label>
                    <textarea
                      className={`${inputCls} min-h-32 resize-y ${border("message")}`}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="What are you building, and what does success look like?"
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <p className="mt-4 text-center text-xs text-red-400">
                    {submitError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: busy ? 1 : 1.02 }}
                  whileTap={{ scale: busy ? 1 : 0.98 }}
                  className="btn-violet mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Submit project request"}
                  {!busy && <HiArrowUpRight />}
                </motion.button>

                <p className="mt-4 text-center text-xs text-haze">
                  By submitting you agree to be contacted about your enquiry.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
