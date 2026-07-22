import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowUpRight } from "react-icons/hi2";
import { fetchProject, trackPageview } from "../lib/store";

// A narrative section — only renders when the field has content, so sparse
// projects degrade to just the hero rather than showing empty headings.
function Section({ label, body, accent }) {
  if (!body) return null;
  return (
    <section className="border-t border-line pt-10">
      <span
        className="text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ color: accent }}
      >
        {label}
      </span>
      <div className="mt-5 space-y-5 text-[1.05rem] leading-relaxed text-white/75">
        {body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>{para}</p>
          ))}
      </div>
    </section>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    trackPageview(`/work/${id}`);
    setStatus("loading");
    fetchProject(id)
      .then((p) => {
        if (!alive) return;
        setProject(p);
        setStatus("ok");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [id]);

  const accent = project?.accent || "#d63f9d";
  const hasLive = project?.url && project.url !== "#";

  return (
    <div className="relative min-h-screen bg-ink text-white">
      {/* header — mirrors the blog detail page */}
      <header className="sticky top-0 z-50 border-b border-line bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
            <span className="font-display text-lg font-semibold">
              <span className="text-gradient">Hivenex.</span>
            </span>
          </Link>
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm text-haze transition-colors hover:text-white"
          >
            <HiArrowLeft /> All work
          </Link>
        </div>
      </header>

      {status === "loading" && (
        <main className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-haze">Loading…</p>
        </main>
      )}

      {status === "error" && (
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">
            Project not found
          </h1>
          <p className="mt-3 text-haze">
            This case study may have been moved or deleted.
          </p>
          <Link
            to="/#work"
            className="btn-violet mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            Back to work <HiArrowUpRight />
          </Link>
        </main>
      )}

      {status === "ok" && project && (
        <>
          {/* hero — accent-tinted wash keyed to the project's own colour */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-96"
            style={{
              background: `radial-gradient(60% 100% at 50% 0%, ${accent}2e, transparent 70%)`,
            }}
          />

          <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* meta row */}
              <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-haze">
                {project.category && (
                  <span
                    className="rounded-full px-3 py-1"
                    style={{
                      color: accent,
                      background: `${accent}1a`,
                      border: `1px solid ${accent}4d`,
                    }}
                  >
                    {project.category}
                  </span>
                )}
                {project.year && <span>{project.year}</span>}
              </div>

              <h1 className="fluid-h2 font-display font-semibold">
                {project.name}
              </h1>

              {project.tagline && (
                <p className="mt-6 text-lg leading-relaxed text-white/80">
                  {project.tagline}
                </p>
              )}

              {hasLive && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
                  style={{ background: accent }}
                >
                  Visit live site <HiArrowUpRight />
                </a>
              )}

              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="mt-10 w-full rounded-3xl border border-line"
                />
              )}

              {/* overview */}
              {project.overview && (
                <div className="mt-12 space-y-5 text-[1.05rem] leading-relaxed text-white/75">
                  {project.overview
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>
              )}

              {/* narrative sections */}
              <div className="mt-12 space-y-10">
                <Section label="The challenge" body={project.challenge} accent={accent} />
                <Section label="What we did" body={project.solution} accent={accent} />
                <Section label="The outcome" body={project.results} accent={accent} />
              </div>

              {/* fallback when a project has no written case study yet */}
              {!project.overview &&
                !project.challenge &&
                !project.solution &&
                !project.results && (
                  <p className="mt-12 italic text-haze">
                    Full case study coming soon.
                  </p>
                )}

              {/* CTA */}
              <div className="mt-16 rounded-3xl border border-line bg-ink-soft p-8 text-center">
                <h3 className="font-display text-xl font-medium">
                  Want us to build something like this?
                </h3>
                <Link
                  to="/#register"
                  className="btn-violet mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                >
                  Start a project <HiArrowUpRight />
                </Link>
              </div>
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
}
