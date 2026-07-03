import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { useDB } from "../lib/store";

// Ordered to match the actual top-to-bottom flow of the page, so the active
// underline moves in one direction as you scroll (no more back-and-forth).
const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Studio", href: "#studio" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // Some sections (Blog, FAQ, Work…) only mount once their data loads, so this
  // signature changes as sections appear/disappear and re-arms the observer.
  const sectionSignature = `${db.loading}|${db.posts.length}|${db.faqs.length}|${db.projects.length}|${db.services.length}|${db.stats.length}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the viewport grows to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Highlight the nav link for whichever section is currently in view
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry nearest the top of the active band
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // re-run when the set of on-page sections changes
  }, [sectionSignature]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
          scrolled
            ? "my-3 rounded-2xl border border-line bg-black/60 py-3 backdrop-blur-2xl"
            : "my-0 border-b border-transparent py-6"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
          <span className="font-display text-lg font-semibold tracking-tight">
            <span className="text-gradient">Hivenex.</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`group relative text-sm transition-colors ${
                  isActive ? "text-white" : "text-haze hover:text-white"
                }`}
              >
                {link.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                )}
              </a>
            );
          })}
        </div>

        <Link
          to="/register"
          className="btn-violet group hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03] lg:inline-flex"
        >
          Start a project
          <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-white transition-all ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-white transition-all ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-black/80 p-4 backdrop-blur-2xl lg:hidden"
          >
            {links.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-lg transition-colors hover:bg-white/5 ${
                    isActive ? "bg-white/5 text-white" : "text-haze hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </a>
              );
            })}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="btn-violet mt-2 rounded-xl px-4 py-3 text-center font-medium"
            >
              Start a project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
