import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Nova — an interactive floating robot mascot.
 * Everything lives inside one fixed 128px box so the parts never drift apart.
 * The eyes follow the cursor; it blinks, floats, and reacts to hover / tap.
 * Built entirely with Framer Motion (no extra dependencies).
 */
export default function Mascot({ className = "" }) {
  const [waving, setWaving] = useState(false);
  const [hi, setHi] = useState(false);

  // cursor position, normalised to -1..1
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 14 });
  const sy = useSpring(my, { stiffness: 120, damping: 14 });

  const pupilX = useTransform(sx, [-1, 1], [-5, 5]);
  const pupilY = useTransform(sy, [-1, 1], [-4, 4]);
  const tilt = useTransform(sx, [-1, 1], [8, -8]);

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div className={className}>
      {/* idle float wrapper */}
      <motion.div
        className="relative h-32 w-32"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        onHoverStart={() => {
          setWaving(true);
          setHi(true);
        }}
        onHoverEnd={() => {
          setWaving(false);
          setHi(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        {/* speech bubble */}
        <motion.div
          initial={false}
          animate={hi ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
        >
          Hi, I'm Nova 👋
        </motion.div>

        {/* antenna */}
        <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 -translate-y-full bg-white/25" />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-accent-soft shadow-[0_0_16px_6px_rgba(167,139,250,0.8)]"
          style={{ marginTop: "-1.6rem" }}
        />

        {/* head (fills the box) with subtle cursor tilt */}
        <motion.div
          style={{ rotate: tilt }}
          className="absolute inset-0 rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#ff5e7a] via-[#d63f9d] to-[#7c3aed] shadow-[0_20px_60px_-12px_rgba(214,63,157,0.75),inset_0_2px_10px_rgba(255,255,255,0.3)]"
        >
          {/* glossy highlight */}
          <div className="absolute inset-2 rounded-[1.6rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />

          {/* face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* eyes */}
            <motion.div
              className="flex gap-4"
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 3.4, times: [0, 0.85, 0.92, 1] }}
              style={{ transformOrigin: "center" }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative h-6 w-6 overflow-hidden rounded-full bg-white shadow-inner"
                >
                  <motion.span
                    className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-[#1e1033]"
                    style={{ x: pupilX, y: pupilY }}
                  />
                </div>
              ))}
            </motion.div>

            {/* cheeks */}
            <div className="mt-1 flex gap-8">
              <span className="h-1.5 w-2.5 rounded-full bg-pink-400/50" />
              <span className="h-1.5 w-2.5 rounded-full bg-pink-400/50" />
            </div>

            {/* smile */}
            <div className="mt-1 h-2.5 w-6 rounded-b-full border-b-2 border-white/70" />
          </div>
        </motion.div>

        {/* waving hand — tucked to the head's bottom-right */}
        <motion.div
          className="absolute -right-2 bottom-2 text-2xl"
          animate={waving ? { rotate: [0, 20, -10, 20, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: waving ? Infinity : 0 }}
          style={{ transformOrigin: "bottom left" }}
        >
          👋
        </motion.div>

        {/* floating shadow */}
        <motion.div
          animate={{ scaleX: [1, 0.8, 1], opacity: [0.4, 0.25, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-accent-deep/50 blur-md"
        />
      </motion.div>
    </div>
  );
}
