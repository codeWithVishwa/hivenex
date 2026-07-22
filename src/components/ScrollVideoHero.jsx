import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once at module scope (idempotent).
gsap.registerPlugin(ScrollTrigger);

/**
 * Full-screen hero whose background video is scrubbed by the scrollbar.
 *
 * The section pins on arrival and stays pinned for `scrubScreens` viewport
 * heights; over that distance scroll progress maps linearly onto the clip's
 * timeline (0% -> frame 0, 50% -> halfway, 100% -> last frame). Scrolling back
 * up rewinds it. Once the last frame lands the pin releases and the next
 * section scrolls in normally.
 *
 * @param {string}   video        - Video source URL (imported asset).
 * @param {string}   poster       - Poster shown until the first frame decodes.
 * @param {number}   scrubScreens - Viewport-heights of scroll to span the clip.
 *                                  Larger = slower, more deliberate playback.
 * @param {Function} onProgress   - Called with scrub progress (0 -> 1) on every
 *                                  update, for overlay animations.
 * @param {string}   id           - DOM id for anchor links.
 * @param {string}   className    - Extra classes on the section.
 * @param {ReactNode} children    - Overlay content, stacked above the video.
 */
export default function ScrollVideoHero({
  video,
  poster,
  scrubScreens = 3,
  onProgress,
  id,
  className = "",
  children,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  // Hold the latest callback in a ref so a new inline function on each render
  // doesn't tear down and rebuild the ScrollTrigger.
  const onProgressRef = useRef(onProgress);
  useLayoutEffect(() => {
    onProgressRef.current = onProgress;
  });

  // useLayoutEffect so the trigger is wired up before the browser paints,
  // which avoids a flash of the un-pinned layout.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const videoEl = videoRef.current;
    if (!section || !videoEl) return;

    // Reduced-motion users get a static first frame — no pin, no scroll hijack.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // gsap.context scopes every tween/trigger we create so a single revert()
    // tears them all down on unmount.
    const ctx = gsap.context(() => {
      // Only build the ScrollTrigger once the clip's duration is known, so the
      // scroll distance maps exactly onto real playable seconds.
      const buildScrollTrigger = () => {
        const duration = videoEl.duration;
        if (!duration || prefersReduced) return;

        // The playhead is moved by scroll alone — never play()/pause().
        // A paused, never-played <video> paints nothing until it decodes a
        // frame, so nudge the playhead to force the first frame to render.
        // (The matching poster keeps the hero visible until that lands.)
        videoEl.pause();
        videoEl.currentTime = 0.04;

        ScrollTrigger.create({
          trigger: section,
          start: "top top", // begin exactly when the hero reaches the top
          // Pin length is expressed in real pixels so it stays consistent
          // across viewport sizes; recomputed on refresh (see below).
          end: () => "+=" + window.innerHeight * scrubScreens,
          pin: true, // hold the hero fixed while the video scrubs
          scrub: true, // smooth, velocity-matched sync with the scrollbar
          anticipatePin: 1, // removes the 1-frame jump when pinning engages
          invalidateOnRefresh: true, // re-measure on resize → no layout shift
          onUpdate: (self) => {
            // Map scroll progress (0 → 1) straight onto the video timeline.
            // Scrolling up drives progress down, so currentTime rewinds too.
            const target = self.progress * duration;

            // Seek only when the target frame actually changed. Redundant seeks
            // are the usual cause of scrub flicker, so we guard against them.
            if (Math.abs(videoEl.currentTime - target) > 0.001) {
              videoEl.currentTime = target;
            }

            onProgressRef.current?.(self.progress);
          },
        });

        // Pinning injected spacer height into the document — recalc all
        // trigger positions so nothing is measured against the old layout.
        ScrollTrigger.refresh();
      };

      // Metadata (and thus duration) may already be available on fast loads.
      if (videoEl.readyState >= 1 /* HAVE_METADATA */) {
        buildScrollTrigger();
      } else {
        videoEl.addEventListener("loadedmetadata", buildScrollTrigger, {
          once: true,
        });
      }
    }, section);

    // Clean up every trigger/tween this component created.
    return () => ctx.revert();
  }, [video, scrubScreens]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative flex h-screen w-full items-center justify-center overflow-hidden bg-ink ${className}`}
    >
      {/* Background video. Never autoplays — the scrollbar is its transport.
          A fixed 100vh box + object-cover guarantees no layout shift, and the
          black section behind it means any decode gap reads as black, not white. */}
      <video
        ref={videoRef}
        src={video}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {children}
    </section>
  );
}
