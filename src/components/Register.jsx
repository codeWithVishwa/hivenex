import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUpRight, HiCheck } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB, addRegistration } from "../lib/store";

const perks = [
  "Priority project slots",
  "Free brand audit call",
  "Early access to the studio playbook",
];

const initial = { name: "", email: "", company: "", service: "", password: "" };

export default function Register() {
  const { services } = useDB();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    if (form.password.length < 6) next.password = "Min. 6 characters";
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
      // password is intentionally not persisted
      await addRegistration({
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.service,
      });
      setDone(true);
      setForm(initial);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    { key: "name", label: "Full name", type: "text", placeholder: "Ada Lovelace", span: 1 },
    { key: "company", label: "Company (optional)", type: "text", placeholder: "Studio Inc.", span: 1 },
    { key: "email", label: "Email", type: "email", placeholder: "you@company.com", span: 2 },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", span: 2 },
  ];

  return (
    <section id="register" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — pitch */}
        <div>
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
              <span className="h-px w-8 bg-accent" /> Join the studio
            </span>
          </Reveal>
          <TextReveal
            text="Create your account"
            className="fluid-h2 font-display font-semibold"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-balance text-lg leading-relaxed text-haze">
              Spin up a client workspace to brief projects, track progress and
              collaborate with the team in real time.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 space-y-4">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-white/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                    <HiCheck className="text-sm" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Right — form card */}
        <Reveal delay={0.1} className="relative self-center">
          <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(214,63,157,0.22),transparent_60%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-soft p-8 md:p-10">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <span className="btn-violet flex h-16 w-16 items-center justify-center rounded-full">
                    <HiCheck className="text-3xl" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-medium">
                    You're on the list
                  </h3>
                  <p className="mt-3 max-w-xs text-haze">
                    Welcome to Hivenex. Check your inbox to confirm your
                    workspace.
                  </p>
                  <button
                    onClick={() => setDone(false)}
                    className="mt-8 text-sm uppercase tracking-[0.2em] text-haze transition-colors hover:text-white"
                  >
                    Register another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  noValidate
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className={field.span === 2 ? "sm:col-span-2" : ""}
                    >
                      <label
                        htmlFor={field.key}
                        className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.key}
                        type={field.type}
                        value={form[field.key]}
                        onChange={update(field.key)}
                        placeholder={field.placeholder}
                        className={`w-full rounded-xl border bg-black/40 px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-accent ${
                          errors[field.key] ? "border-red-500/60" : "border-line"
                        }`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1.5 text-xs text-red-400">
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="service"
                      className="mb-2 block text-xs uppercase tracking-[0.15em] text-haze"
                    >
                      Service you're interested in
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={update("service")}
                      className={`w-full appearance-none rounded-xl border bg-black/40 px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-accent ${
                        errors.service ? "border-red-500/60" : "border-line"
                      } ${form.service ? "text-white" : "text-white/25"}`}
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

                  {submitError && (
                    <p className="text-center text-xs text-red-400 sm:col-span-2">
                      {submitError}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={busy}
                    whileHover={{ scale: busy ? 1 : 1.02 }}
                    whileTap={{ scale: busy ? 1 : 0.98 }}
                    className="btn-violet group mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium disabled:opacity-60 sm:col-span-2"
                  >
                    {busy ? "Creating account…" : "Create account"}
                    {!busy && (
                      <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-haze sm:col-span-2">
                    Already with us?{" "}
                    <a href="#" className="text-white underline-offset-4 hover:underline">
                      Sign in
                    </a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
