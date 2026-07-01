import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowDown } from "react-icons/hi2";
import Mascot from "./Mascot";

// Heavy WebGL background — code-split so it doesn't block first paint
const Hyperspeed = lazy(() => import("./Hyperspeed"));

const line = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

// Brand-coloured light trails for the Hyperspeed background
const hyperspeedOptions = {
  colors: {
    roadColor: 0x0f0620,
    islandColor: 0x160a2e,
    background: 0x0f0620,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xff5e7a, 0xd63f9d, 0xb54dd9],
    rightCars: [0x7c3aed, 0x8b5cf6, 0xa78bfa],
    sticks: 0xd63f9d,
  },
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-driven parallax
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-28 pb-16 sm:px-6 sm:pt-32"
    >
      {/* Hyperspeed WebGL background (click & hold to warp) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Hyperspeed effectOptions={hyperspeedOptions} />
        </Suspense>
      </div>

      {/* legibility overlay — keeps the headline readable over the road */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(15,6,32,0.92),rgba(15,6,32,0.55)_45%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />

      {/* interactive mascot — only where there's clear room beside the headline */}
      <Mascot className="absolute right-6 top-28 z-20 hidden origin-top-right lg:block lg:scale-90 xl:right-[7%] xl:scale-100" />

      <motion.div
        style={{ y: yTitle, opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-haze"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Independent design & technology studio
        </motion.div>

        <h1 className="fluid-hero font-display font-semibold">
          {["We build", "brands that", "refuse to"].map((t, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={line}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.15 + i * 0.12 }}
              >
                {t}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span
              className="text-gradient block italic"
              style={{ fontFamily: "Space Grotesk" }}
              variants={line}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.51 }}
            >
              blend in.
            </motion.span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-md text-balance text-lg leading-relaxed text-haze"
          >
            Hivenex is a digital studio crafting bold identities, immersive
            websites, and products that move people — and metrics.
          </motion.p>

          <motion.a
            href="#work"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-haze transition-colors hover:text-white"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <HiArrowDown className="animate-bounce" />
            </span>
            Scroll to explore
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
