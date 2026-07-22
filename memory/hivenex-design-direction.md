---
name: hivenex-design-direction
description: Hivenex site's intended visual direction — premium Apple-style dark minimalism
metadata:
  type: project
---

The Hivenex studio site was restyled (2026-07-19) from a neon gradient look (pink→magenta→violet, WebGL Hyperspeed/RippleGrid, Space Grotesk) to **premium Apple-dark discipline**: pure-black canvas, Apple grays (`#f5f5f7` text, `#86868b` secondary), a single restrained **violet** accent `#8b5cf6`, SF Pro via the system font stack (Inter fallback), generous whitespace, calm fade-rise motion.

The **hero is video-only** — no title/text/CTA — playing [src/assets/robot.mp4](../src/assets/robot.mp4). It is **scroll-scrubbed** (no autoplay) via **GSAP ScrollTrigger** (gsap 3.15): `ScrollTrigger.create` pins the `h-screen` section (`pin: true, scrub: true`, `end: "+=" + innerHeight*SCRUB_SCREENS`, SCRUB_SCREENS=3) and `onUpdate` maps `self.progress * duration` onto `video.currentTime`, bidirectional. Trigger is built on `loadedmetadata`; cleaned up via `gsap.context().revert()`. Logic in [src/components/Hero.jsx](../src/components/Hero.jsx).

Lenis is wired to GSAP in [src/pages/Site.jsx](../src/pages/Site.jsx): `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((t)=>lenis.raf(t*1000))` + `lagSmoothing(0)` so pin/scrub share one clock. (Framer Motion still used elsewhere for reveals.)

The mp4 was re-encoded with ffmpeg (winget Gyan.FFmpeg, not on PATH — at `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-*\bin`): first 1s trimmed, downscaled 1080p, **all-intra (`-g 1`)** for frame-accurate scrubbing (~14.6 MB, 9s). Original preserved as `src/assets/robot.orig.mp4`.

**Why:** User explicitly wants an Apple-website premium feel and rejected the busy gradient/WebGL decoration.

**How to apply:** Keep decoration minimal — no gradients-as-brand, no 3D card tilts/spotlights/glows, one accent used sparingly. Design tokens live in [src/index.css](../src/index.css) (`ink`, `ink-soft`, `card`, `line`, `haze`, `accent`; `.btn-violet` = solid accent pill, `.btn-light` = white pill). `Hyperspeed.jsx`, `RippleGrid.jsx`, `Mascot.jsx` are now orphaned (kept, not deleted).
