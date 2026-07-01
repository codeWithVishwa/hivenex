import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";

const faqs = [
  {
    q: "What services does Hivenex offer?",
    a: "We're a full-stack studio covering web & app development, custom software solutions, digital marketing, and content & product shoots — from the first sketch to the final deploy.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project is scoped individually. Small sites start in the low thousands, while full product builds are quoted after a discovery call. Tell us your budget and we'll shape the best possible solution around it.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused landing page can ship in 1–2 weeks. Brand systems and multi-page sites usually run 4–8 weeks, and full software products are phased over a few months with regular checkpoints.",
  },
  {
    q: "Do you work with clients remotely?",
    a: "Yes — we're remote-first and collaborate with teams worldwide. You'll get a shared workspace, clear timelines, and direct access to the makers, not an account-manager telephone game.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Absolutely. We stick around to measure, refine, and grow what we've built. Ongoing retainers and care plans are available for maintenance, iteration, and new features.",
  },
  {
    q: "How do we get started?",
    a: "Register your interest through the form above or email us directly. We'll set up a short discovery call, align on goals, and send over a tailored proposal.",
  },
];

function Item({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-lg font-medium transition-colors group-hover:text-accent md:text-xl">
          {faq.q}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 ${
            isOpen ? "rotate-45 border-accent bg-accent text-white" : "text-haze group-hover:border-accent/40"
          }`}
        >
          <HiPlus />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-7 leading-relaxed text-haze">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Left — heading */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-haze">
              <span className="h-px w-8 bg-accent" /> FAQ
            </span>
          </Reveal>
          <TextReveal
            text="Questions, answered"
            className="fluid-h2 font-display font-semibold"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-balance leading-relaxed text-haze">
              Everything you need to know before working with us. Still curious?
              <a href="#contact" className="text-white underline-offset-4 hover:underline">
                {" "}
                Drop us a line
              </a>
              .
            </p>
          </Reveal>
        </div>

        {/* Right — accordion */}
        <Reveal delay={0.1}>
          <div className="border-t border-line">
            {faqs.map((faq, i) => (
              <Item
                key={faq.q}
                faq={faq}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
