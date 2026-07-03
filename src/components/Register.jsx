import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowUpRight, HiCheck } from "react-icons/hi2";
import { Reveal } from "./ui/Reveal";

const perks = [
  "Tailored proposal in 48h",
  "Free discovery call",
  "Direct access to the makers",
];

export default function Register() {
  return (
    <section id="register" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink-soft px-8 py-14 text-center md:px-16 md:py-20">
            {/* glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,63,157,0.22),transparent_60%)] blur-2xl" />

            <span className="relative mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
              <span className="h-px w-8 bg-accent" /> Start a project
            </span>

            <h2 className="fluid-h2 relative mx-auto max-w-2xl font-display font-semibold">
              Ready to build something that refuses to blend in?
            </h2>

            <p className="relative mx-auto mt-6 max-w-md text-balance leading-relaxed text-haze">
              Share your project in our quick form — the more detail you give,
              the sharper the proposal you'll get back.
            </p>

            <div className="relative mt-10 flex justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="btn-violet group inline-flex items-center gap-3 rounded-full px-8 py-4 font-medium"
                >
                  Register your project
                  <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
                </Link>
              </motion.div>
            </div>

            <ul className="relative mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/80">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <HiCheck className="text-xs" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
