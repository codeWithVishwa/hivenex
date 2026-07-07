import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowUpRight } from "react-icons/hi2";
import { trackPageview } from "../lib/store";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview(`404:${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,63,157,0.18),transparent_60%)] blur-3xl" />
      {/* grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
          <span className="font-display text-lg font-semibold">
            <span className="text-gradient">Hivenex.</span>
          </span>
        </div>

        <h1 className="text-gradient fluid-hero font-display font-semibold leading-none">
          404
        </h1>
        <h2 className="mt-4 font-display text-2xl font-medium tracking-tight md:text-3xl">
          This page wandered off.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-haze">
          The link may be broken, or the page may have been moved. Let's get you
          back on track.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-violet group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium"
          >
            <HiArrowLeft /> Back to home
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm text-haze transition-colors hover:text-white"
          >
            Start a project
            <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
