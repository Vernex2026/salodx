import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 24,      label: "monitorowanych banków",  suffix: "" },
  { value: 47,      label: "aktualnych ofert",        suffix: "" },
  { value: 2481,    label: "promocji sprawdzonych w 2026", suffix: "" },
  { value: 517000,  label: "złotych w bonusach",       suffix: "zł" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Counter({ value, suffix }) {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  const numRef = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.6,
      ease: "power2.out",
      snap: { v: 1 },
      onUpdate: () => setDisplay(obj.v),
    });

    // ScrollTrigger scrub micro-pulse — gdy scrollujesz przez sekcję
    // liczba "oddycha" w zakresie ±2% wartości (subtle, nie efekciarstwo)
    const st = ScrollTrigger.create({
      trigger: numRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        if (obj.v < value * 0.98) return; // dopiero po tween-up
        const drift = Math.sin(self.progress * Math.PI) * 0.012; // ±1.2%
        setDisplay(Math.round(value * (1 + drift)));
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [visible, value]);

  const formatted = display.toLocaleString("pl-PL").replace(/,/g, " ");

  return (
    <span
      ref={(node) => {
        ref.current = node;
        numRef.current = node;
      }}
      className="font-display numeric block whitespace-nowrap text-[40px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)] sm:text-[52px] lg:text-[56px] xl:text-[64px]"
    >
      {formatted}
      {suffix && <span className="ml-1.5 text-[var(--color-muted)]">{suffix}</span>}
    </span>
  );
}

export default function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="relative border-y border-[var(--color-hairline)] bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 id="stats-heading" className="sr-only">Saldox w liczbach</h2>

        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-faint)]">
          Saldox w liczbach
        </p>

        <ul role="list" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {STATS.map((s) => (
            <li key={s.label} className="text-center lg:text-left">
              <Counter value={s.value} suffix={s.suffix} />
              <span className="mt-4 block max-w-[220px] mx-auto lg:mx-0 text-[13px] leading-relaxed text-[var(--color-muted)]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
