import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { trackPageview } from "../lib/store";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Services from "../components/Services";
import Work from "../components/Work";
import Process from "../components/Process";
import Stats from "../components/Stats";
import Blog from "../components/Blog";
import FAQ from "../components/FAQ";
import Register from "../components/Register";
import Footer from "../components/Footer";

export default function Site() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Record a page view once per load
  useEffect(() => {
    trackPageview("/");
  }, []);

  // Buttery smooth inertia scrolling
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // let in-page anchor links use Lenis for smooth navigation
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80 });
        }
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-white">
      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-70 h-0.5 origin-left bg-accent"
      />

      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Process />
        <Stats />
        <Blog />
        <FAQ />
        <Register />
      </main>

      <Footer />
    </div>
  );
}
