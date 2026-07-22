import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB } from "../lib/store";

const spring = { stiffness: 150, damping: 18, mass: 0.4 };

// Link that also accepts framer-motion props, so the card keeps its tilt
// animation while navigating client-side to the case-study page.
const MotionLink = motion.create(Link);

function ProjectCard({ project, index }) {
  const ref = useRef(null);

  // normalised cursor position within the card (0..1)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // interactive 3D tilt toward the cursor
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), spring);

  // in-card parallax for the title watermark
  const wmX = useSpring(useTransform(mx, [0, 1], [-20, 20]), spring);
  const wmY = useSpring(useTransform(my, [0, 1], [-14, 14]), spring);

  // cursor-following spotlight
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 60%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <MotionLink
      to={`/work/${project.id}`}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative block rounded-3xl border border-white/10 bg-ink"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-t-3xl"
        style={{
          backgroundImage: `linear-gradient(135deg, #2a1030 0%, #160a2e 55%, ${project.accent}4d 100%)`,
        }}
      >
        {/* cursor spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        {/* soft radial */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.06),transparent_50%)]" />

        {/* parallax title watermark */}
        <motion.div
          style={{ x: wmX, y: wmY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="font-display text-7xl font-bold opacity-[0.09] transition-opacity duration-500 group-hover:opacity-25 md:text-8xl"
            style={{ color: project.accent }}
          >
            {project.name.split(" ")[0]}
          </span>
        </motion.div>

        {/* arrow badge */}
        <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
          <HiArrowUpRight className="text-lg transition-transform group-hover:rotate-45" />
        </div>

        {/* hover reveal — "view case study" bar slides up */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center pb-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          <span
            className="rounded-full px-5 py-2.5 text-sm font-medium text-black shadow-lg"
            style={{ background: project.accent }}
          >
            View case study →
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-white">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-haze">{project.category}</p>
        </div>
        <span className="font-display text-sm text-haze">{project.year}</span>
      </div>

      {/* accent underline */}
      <span
        className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{ background: project.accent }}
      />
    </MotionLink>
  );
}

export default function Work() {
  const { projects } = useDB();

  return (
    <section
      id="work"
      className="relative overflow-hidden bg-ink-soft px-6 py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
                <span className="h-px w-8 bg-accent" /> Selected work
              </span>
            </Reveal>
            <TextReveal
              text="Projects we're proud of"
              className="fluid-h2 font-display font-semibold"
            />
          </div>
          <Reveal delay={0.1}>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-haze transition-colors hover:text-white"
            >
              View all
              <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
