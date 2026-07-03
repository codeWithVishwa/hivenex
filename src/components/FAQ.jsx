import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus } from "react-icons/hi2";
import { Reveal, TextReveal } from "./ui/Reveal";
import { useDB } from "../lib/store";

function Item({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-lg font-medium transition-colors group-hover:text-accent md:text-xl">
          {faq.question}
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
            <p className="max-w-xl pb-7 leading-relaxed text-haze">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { faqs } = useDB();
  const [open, setOpen] = useState(0);

  if (!faqs.length) return null;

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
                key={faq.id}
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
