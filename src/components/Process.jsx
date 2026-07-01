import { motion } from "framer-motion";
import { Reveal, TextReveal } from "./ui/Reveal";
import RippleGrid from "./RippleGrid";

const steps = [
  {
    no: "01",
    title: "Discover",
    desc: "We dig into your goals, audience and market to find the angle no one else has.",
  },
  {
    no: "02",
    title: "Design",
    desc: "Concepts become craft. Identity, interface and motion explored until it's undeniable.",
  },
  {
    no: "03",
    title: "Develop",
    desc: "Pixel-perfect, performant builds with clean code and buttery interactions.",
  },
  {
    no: "04",
    title: "Deliver",
    desc: "We launch, measure and refine — partners long after the site goes live.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Ripple Grid WebGL background (reacts to the cursor) */}
      <div className="absolute inset-0 z-0">
        <RippleGrid
          gridColor="#8b5cf6"
          rippleIntensity={0.06}
          gridSize={11}
          gridThickness={13}
          glowIntensity={0.16}
          fadeDistance={1.6}
          vignetteStrength={2.2}
          opacity={0.85}
          mouseInteraction
          mouseInteractionRadius={1.1}
        />
      </div>
      {/* fade edges into the page */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-ink)_92%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
              <span className="h-px w-8 bg-accent" /> How we work
            </span>
          </Reveal>
          <TextReveal
            text="A process without the fluff"
            className="max-w-3xl fluid-h2 font-display font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.no}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[260px] bg-ink p-8 transition-colors hover:bg-ink-soft"
            >
              <span className="font-display text-sm text-accent">{step.no}</span>
              <h3 className="mt-8 font-display text-2xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-haze">
                {step.desc}
              </p>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
