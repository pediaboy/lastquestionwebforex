"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import GlassCard from "./GlassCard";

type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <GlassCard key={item.question} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-white md:text-base">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-neon transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-white/55">
                  {item.answer}
                </p>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
