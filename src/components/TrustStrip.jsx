import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// TrustStrip — stacked layout: eyebrow nad listą banków
const BANKS = [
  { name: "mBank",       initials: "mB", gradient: "linear-gradient(135deg,#e11d48,#be123c)" },
  { name: "Pekao",       initials: "Pe", gradient: "linear-gradient(135deg,#dc2626,#7f1d1d)" },
  { name: "Santander",   initials: "Sa", gradient: "linear-gradient(135deg,#dc2626,#991b1b)" },
  { name: "ING",         initials: "I",  gradient: "linear-gradient(135deg,#f97316,#ea580c)" },
  { name: "Millennium",  initials: "Mi", gradient: "linear-gradient(135deg,#7c3aed,#5b21b6)" },
  { name: "Alior",       initials: "Al", gradient: "linear-gradient(135deg,#16a34a,#15803d)" },
  { name: "BNP Paribas", initials: "BN", gradient: "linear-gradient(135deg,#16a34a,#166534)" },
  { name: "Citi",        initials: "Ci", gradient: "linear-gradient(135deg,#0ea5e9,#0369a1)" },
];

export default function TrustStrip() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".trust-reveal", {
        y: 16,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 88%", once: true },
      });
      gsap.from(".trust-bank", {
        y: 14,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Monitorujemy promocje w bankach"
      className="relative border-y border-[var(--color-hairline)] bg-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-9">
        {/* Eyebrow nad listą — Inter (font-sans), drobny, decyzyjny */}
        <p className="trust-reveal flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-faint)]">
          <span aria-hidden="true" className="h-px w-8 bg-[var(--color-hairline-2)]" />
          Monitorujemy promocje w
          <span aria-hidden="true" className="h-px w-8 bg-[var(--color-hairline-2)]" />
        </p>

        {/* Lista banków — centered row */}
        <ul
          role="list"
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {BANKS.map((bank) => (
            <li
              key={bank.name}
              className="trust-bank group flex items-center gap-2 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              title={bank.name}
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white shadow-[0_1px_2px_rgba(10,14,26,0.06)]"
                style={{ background: bank.gradient }}
              >
                <span className="font-display text-[9.5px] font-semibold leading-none tracking-[-0.02em]">
                  {bank.initials}
                </span>
              </span>
              <span className="font-display select-none text-[14.5px] font-medium tracking-[-0.025em] text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-ink)]">
                {bank.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
