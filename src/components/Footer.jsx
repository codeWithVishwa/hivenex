import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

const socials = ["Instagram", "Twitter / X", "LinkedIn", "Dribbble"];
const sitemap = ["Work", "Services", "Process", "Studio"];

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);

  return (
    <footer ref={ref} id="contact" className="relative overflow-hidden px-6 pt-28 md:pt-40">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,63,157,0.2),transparent_60%)] blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Big CTA */}
        <motion.div style={{ y }} className="relative text-center">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-haze">
            Have a project in mind?
          </p>
          <a href="mailto:hello@hivenex.studio" className="group inline-block">
            <h2 className="fluid-mega font-display font-semibold transition-colors">
              <span className="block transition-transform duration-500 group-hover:-translate-y-1">
                Let's make
              </span>
              <span className="text-gradient block transition-transform duration-500 group-hover:translate-y-1">
                something great.
              </span>
            </h2>
          </a>
          <div>

          <motion.a
            href="mailto:hello@hivenex.studio"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-violet mt-12 inline-flex items-center gap-3 rounded-full px-8 py-4 font-medium"
          >
            hello@hivenex.studio
            <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
          </motion.a>
          </div>
        </motion.div>

        {/* Footer grid */}
        <div className="mt-28 grid grid-cols-2 gap-10 border-t border-line py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
              <span className="font-display text-lg font-semibold">
                <span className="text-gradient">Hivenex.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-haze">
              Independent design & technology studio building brands that refuse
              to blend in.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-haze">
              Sitemap
            </p>
            <ul className="space-y-2.5">
              {sitemap.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-white/80 transition-colors hover:text-accent"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-haze">
              Social
            </p>
            <ul className="space-y-2.5">
              {socials.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-white/80 transition-colors hover:text-accent"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-haze">
              Say hello
            </p>
            <a
              href="mailto:hello@hivenex.studio"
              className="text-sm text-white/80 transition-colors hover:text-accent"
            >
              hello@hivenex.studio
            </a>
            <p className="mt-3 text-sm text-haze">
              Remote · Working worldwide
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-8 text-xs text-haze md:flex-row">
          <span>© {new Date().getFullYear()} Hivenex Studio. All rights reserved.</span>
          <span>Designed & built with intent.</span>
        </div>
      </div>
    </footer>
  );
}
