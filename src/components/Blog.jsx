import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB } from "../lib/store";

const MotionLink = motion.create(Link);

function Meta({ post }) {
  return (
    <div className="flex items-center gap-3 text-xs text-haze">
      <span className="rounded-full border border-line px-3 py-1 text-accent">
        {post.category}
      </span>
      <span>{post.date}</span>
      <span className="h-1 w-1 rounded-full bg-haze" />
      <span>{post.read}</span>
    </div>
  );
}

export default function Blog() {
  const { posts } = useDB();
  if (!posts.length) return null;

  // featured post first, otherwise fall back to the first post
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured.id);

  return (
    <section id="blog" className="relative bg-ink-soft px-6 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
                <span className="h-px w-8 bg-accent" /> Journal
              </span>
            </Reveal>
            <TextReveal
              text="Notes from the studio"
              className="fluid-h2 font-display font-semibold"
            />
          </div>
          <Reveal delay={0.1}>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-haze transition-colors hover:text-white"
            >
              All posts
              <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Featured post */}
          <MotionLink
            to={`/blog/${featured.id}`}
            initial={{ opacity: 0, x: -90 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line"
          >
            <div className="relative aspect-16/10 bg-gradient-to-br from-[#2a1030] via-[#160a2e] to-[#d63f9d]/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
              <span className="absolute left-6 top-6 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                Featured
              </span>
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-7">
              <Meta post={featured} />
              <h3 className="font-display text-2xl font-medium leading-snug tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                {featured.title}
              </h3>
              <p className="text-haze">{featured.excerpt}</p>
            </div>
          </MotionLink>

          {/* Post list */}
          <div className="flex flex-col">
            {rest.map((post, i) => (
              <MotionLink
                to={`/blog/${post.id}`}
                key={post.id}
                initial={{ opacity: 0, x: 90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start justify-between gap-6 border-b border-line py-7 first:pt-0 last:border-b-0"
              >
                <div className="flex flex-col gap-3">
                  <Meta post={post} />
                  <h3 className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                    {post.title}
                  </h3>
                  <p className="text-sm text-haze">{post.excerpt}</p>
                </div>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  <HiArrowUpRight className="transition-transform group-hover:rotate-45" />
                </span>
              </MotionLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
