import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB } from "../lib/store";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

// Distinct brand-tinted card styles, cycled per service
const cardStyles = [
  "bg-gradient-to-br from-[#2a1030] to-[#160a2e] border border-[#ff5e7a]/30",
  "bg-gradient-to-br from-[#2a1030] to-[#160a2e] border border-[#d63f9d]/30",
  "bg-gradient-to-br from-[#1e1245] to-[#160a2e] border border-[#8b5cf6]/30",
  "bg-gradient-to-br from-[#1e1245] to-[#160a2e] border border-[#7c3aed]/30",
];

export default function Services() {
  const { services } = useDB();

  return (
    <section id="services" className="relative px-6 pt-28 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
                <span className="h-px w-8 bg-accent" /> What we do
              </span>
            </Reveal>
            <TextReveal
              text="Capabilities engineered for impact"
              className="fluid-h2 font-display font-semibold"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-balance text-haze">
              A full-stack studio. One team, from the first sketch to the final
              deploy. Scroll to explore what we do.
            </p>
          </Reveal>
        </div>

        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemStackDistance={26}
          itemScale={0.035}
          baseScale={0.86}
          stackPosition="22%"
          scaleEndPosition="12%"
        >
          {services.map((s, i) => (
            <ScrollStackItem
              key={s.id}
              itemClassName={cardStyles[i % cardStyles.length]}
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-haze">
                    {s.desc}
                  </p>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
