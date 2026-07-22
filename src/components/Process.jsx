import { motion } from "framer-motion";
import { Reveal, TextReveal } from "./ui/Reveal";

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

        {/* Vertical timeline — nodes on a central spine, cards alternating
            left/right on desktop and stacked to the right on mobile. */}
        <div className="relative mx-auto max-w-4xl">
          {/* Spine: fades in/out at the ends so it doesn't hard-stop */}
          <div
            aria-hidden
            className="absolute bottom-2 top-2 left-6 w-px bg-[linear-gradient(to_bottom,transparent,var(--color-accent)_12%,var(--color-accent)_88%,transparent)] opacity-40 md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, i) => {
              const onLeft = i % 2 === 0; // alternate sides on desktop
              return (
                <motion.div
                  key={step.no}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-16 md:grid md:grid-cols-2 md:items-center md:gap-0 md:pl-0"
                >
                  {/* Node on the spine: filled dot with a soft accent halo,
                      plus a short connector tick reaching toward the card. */}
                  <span className="absolute left-6 top-1 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    {/* Connector: points right on mobile; follows the card's
                        side on desktop (left for left-hand cards). */}
                    <span
                      className={
                        onLeft
                          ? "absolute left-1/2 top-1/2 h-px w-8 -translate-y-1/2 bg-accent/50 md:left-auto md:right-1/2"
                          : "absolute left-1/2 top-1/2 h-px w-8 -translate-y-1/2 bg-accent/50"
                      }
                    />
                    <span className="relative block h-4 w-4 rounded-full bg-accent shadow-[0_0_0_5px_rgba(214,63,157,0.18)]" />
                  </span>

                  {/* Card */}
                  <div
                    className={
                      onLeft
                        ? "md:col-start-1 md:pr-16 md:text-right"
                        : "md:col-start-2 md:pl-16"
                    }
                  >
                    <span className="font-display text-5xl font-semibold leading-none text-accent/25">
                      {step.no}
                    </span>
                    <div className="mt-4">
                      <span className="inline-block rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        {step.title}
                      </span>
                    </div>
                    <p
                      className={
                        onLeft
                          ? "mt-4 text-sm leading-relaxed text-haze md:ml-auto md:max-w-sm"
                          : "mt-4 text-sm leading-relaxed text-haze md:max-w-sm"
                      }
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
