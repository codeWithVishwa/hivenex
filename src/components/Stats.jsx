import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Reveal, TextReveal } from "./ui/Reveal";

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 38, suffix: "+", label: "Global clients" },
  { value: 14, suffix: "", label: "Design awards" },
  { value: 9, suffix: "yr", label: "In the game" },
];

export default function Stats() {
  return (
    <section id="studio" className="relative bg-ink-soft px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
              <span className="h-px w-8 bg-accent" /> The studio
            </span>
          </Reveal>
          <TextReveal
            text="Small team. Outsized ambition."
            className="fluid-h2 font-display font-semibold"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-balance text-lg leading-relaxed text-haze">
              We're a tight crew of designers, engineers and storytellers who
              treat every brand like our own. No bloated retainers, no
              account-manager telephone game — just makers, talking to makers.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-2 border-b border-accent pb-1 text-sm uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-70"
            >
              Meet the team
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-px self-center overflow-hidden rounded-3xl border border-line bg-line">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ink-soft p-8 md:p-10"
            >
              <div className="font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm text-haze">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
