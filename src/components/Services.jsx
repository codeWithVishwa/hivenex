import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB } from "../lib/store";

const accents = ["#ff5e7a", "#d63f9d", "#8b5cf6", "#7c3aed"];

function RaiseCard({ service, index }) {
  const ref = useRef(null);
  // Scroll-linked "raise": as the card travels up the viewport it lifts,
  // scales up, flattens out of a 3D tilt and fades in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.42"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [110, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const accent = accents[index % accents.length];
  const num = String(index + 1).padStart(2, "0");

  return (
    <div ref={ref} style={{ perspective: 1200 }}>
      {/* Scroll layer — owns y/scale/rotateX/opacity (driven by scroll only) */}
      <motion.div style={{ y, scale, rotateX, opacity }} className="will-change-transform">
        {/* Hover layer — owns its own y (the lift), so the two never fight */}
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.01] p-8 backdrop-blur-xl md:p-12"
        >
        {/* accent glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-35 blur-[90px] transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: accent }}
        />
        {/* number watermark */}
        <span className="pointer-events-none absolute -top-4 right-4 font-display text-[7rem] font-bold leading-none text-white/[0.05] md:text-[10rem]">
          {num}
        </span>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
              />
              <span className="text-xs uppercase tracking-[0.3em] text-haze">
                Service {num}
              </span>
            </div>

            <h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              {service.title}
            </h3>
            <p className="mt-4 max-w-lg leading-relaxed text-haze">
              {service.desc}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {service.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 transition-colors group-hover:border-white/30"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
            <HiArrowUpRight className="text-xl transition-transform group-hover:rotate-45" />
          </span>
        </div>

          {/* animated bottom accent line */}
          <span
            className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
            style={{ background: accent }}
          />
        </motion.article>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const { services } = useDB();

  return (
    <section id="services" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
                <span className="h-px w-8 bg-accent" /> What we do
              </span>
            </Reveal>
            <TextReveal
              text="Capabilities engineered for impact"
              className="fluid-h2 font-display font-semibold"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-balance text-haze">
              A full-stack studio. One team, from the first sketch to the final
              deploy.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {services.map((s, i) => (
            <RaiseCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
