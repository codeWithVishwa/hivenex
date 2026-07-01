import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";

const projects = [
  {
    name: "Lumen Finance",
    cat: "Fintech · Brand + Web",
    year: "2025",
    gradient: "from-[#2a1030] via-[#160a2e] to-[#ff5e7a]/30",
    accent: "#ff5e7a",
  },
  {
    name: "Atlas Studios",
    cat: "Media · Identity",
    year: "2025",
    gradient: "from-[#2a1030] via-[#160a2e] to-[#d63f9d]/30",
    accent: "#d63f9d",
  },
  {
    name: "Nova Health",
    cat: "Product · App Design",
    year: "2024",
    gradient: "from-[#1e1245] via-[#160a2e] to-[#a34dd9]/30",
    accent: "#a34dd9",
  },
  {
    name: "Form & Field",
    cat: "E-commerce · Development",
    year: "2024",
    gradient: "from-[#1e1245] via-[#160a2e] to-[#7c3aed]/30",
    accent: "#7c3aed",
  },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // alternating parallax drift (subtle — avoids gaps on smaller screens)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 30 : 60, index % 2 === 0 ? -30 : -60]
  );

  return (
    <motion.a
      href="#"
      ref={ref}
      style={{ y }}
      className={`group relative block overflow-hidden rounded-3xl border border-line ${
        index % 2 === 0 ? "md:mt-0" : "md:mt-24"
      }`}
    >
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${project.gradient}`}
      >
        {/* noise + radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-7xl font-bold opacity-[0.07] transition-all duration-700 group-hover:scale-110 group-hover:opacity-20 md:text-8xl"
            style={{ color: project.accent }}
          >
            {project.name.split(" ")[0]}
          </span>
        </div>
        <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
          <HiArrowUpRight className="text-lg transition-transform group-hover:rotate-45" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-haze">{project.cat}</p>
        </div>
        <span className="font-display text-sm text-haze">{project.year}</span>
      </div>
    </motion.a>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative overflow-hidden bg-ink-soft px-6 py-28 md:py-40">
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
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
