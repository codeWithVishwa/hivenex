import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowUpRight } from "react-icons/hi2";
import { fetchPost, trackPageview } from "../lib/store";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    trackPageview(`/blog/${id}`);
    setStatus("loading");
    fetchPost(id)
      .then((p) => {
        if (!alive) return;
        setPost(p);
        setStatus("ok");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="relative min-h-screen bg-ink text-white">
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-line bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
            <span className="font-display text-lg font-semibold">
              <span className="text-gradient">Hivenex.</span>
            </span>
          </Link>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm text-haze transition-colors hover:text-white"
          >
            <HiArrowLeft /> All posts
          </Link>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(214,63,157,0.18),transparent_70%)]" />

      <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        {status === "loading" && (
          <p className="text-haze">Loading…</p>
        )}

        {status === "error" && (
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold">Post not found</h1>
            <p className="mt-3 text-haze">
              This article may have been moved or deleted.
            </p>
            <Link
              to="/#blog"
              className="btn-violet mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              Back to blog <HiArrowUpRight />
            </Link>
          </div>
        )}

        {status === "ok" && post && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-haze">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-haze" />
              <span>{post.read}</span>
            </div>

            <h1 className="fluid-h2 font-display font-semibold">{post.title}</h1>

            {post.excerpt && (
              <p className="mt-6 text-lg leading-relaxed text-white/80">
                {post.excerpt}
              </p>
            )}

            {post.image && (
              <img
                src={post.image}
                alt=""
                className="mt-8 w-full rounded-3xl border border-line"
              />
            )}

            <div className="my-10 h-px w-full bg-line" />

            <div className="space-y-5 text-[1.05rem] leading-relaxed text-haze">
              {(post.content || post.excerpt || "")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-white/75">
                    {para}
                  </p>
                ))}
              {!post.content && (
                <p className="italic text-haze">
                  Full article coming soon.
                </p>
              )}
            </div>

            <div className="mt-14 rounded-3xl border border-line bg-ink-soft p-8 text-center">
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
          </motion.article>
        )}
      </main>
    </div>
  );
}
