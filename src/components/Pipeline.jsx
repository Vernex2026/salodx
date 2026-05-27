import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";
import { useMagnetic } from "../hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = [
  {
    n: "01",
    badge: "[ STACK // AI_PROTOTYPING ]",
    title: "Prototypowanie",
    tool: "Lovable",
    gain: "Czas.",
    body: "Działający, klikalny prototyp w 72 godziny — nie statyczne makiety po trzech miesiącach. Widzisz produkt na żywo zanim agencja przyśle Ci pierwszy invoice.",
  },
  {
    n: "02",
    badge: "[ STACK // PRODUCTION_CODE ]",
    title: "Inżynieria",
    tool: "Claude Code",
    gain: "Własność.",
    body: "Generujemy czysty, skalowalny kod prosto do Twojego repo GitHub. Bez uwiązania w platformach No-Code, które znikną za rok. To Twój kapitał.",
  },
  {
    n: "03",
    badge: "[ STACK // INFRASTRUCTURE ]",
    title: "Infrastruktura",
    tool: "Supabase + Vercel",
    gain: "Skala i bezpieczeństwo.",
    body: "Edge runtime, cloud DB, RLS. Architektura gotowa na globalny ruch od dnia pierwszego. Bazy danych i backend, które nie zawiodą gdy biznes zacznie rosnąć.",
  },
  {
    n: "04",
    badge: "[ STACK // SELF_SERVICE_AI ]",
    title: "Przekazanie",
    tool: "Self-Service AI",
    gain: "Wolność.",
    body: "Koniec faktur za zmianę nagłówka. Zmieniasz produkt rozmawiając z wbudowanym panelem AI — jak z ChatGPT.",
    cta: { label: "Zobacz panel w akcji", href: "#panel" },
  },
];

export default function Pipeline() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [gsapActive] = useState(() => !prefersReducedMotion());

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;
    // v34: scroll dzieje się w <main> (snap-y od v29), nie w window.
    // ScrollTrigger musi wiedzieć którego scrollera słuchać.
    const scroller = document.querySelector("main") || undefined;

    const ctx = gsap.context(() => {
      if (gsapActive) {
        gsap.to(section, {
          "--pipeline-blur": "24px",
          "--pipeline-darken": "1",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top bottom",
            end: "top 25%",
            scrub: 1,
          },
        });
      } else {
        section.style.setProperty("--pipeline-blur", "12px");
        section.style.setProperty("--pipeline-darken", "0.55");
      }

      section.querySelectorAll(".pipeline-card").forEach((card, idx) => {
        ScrollTrigger.create({
          trigger: card,
          scroller,
          start: "top 65%",
          end: "bottom 35%",
          onToggle: (self) => {
            if (self.isActive) setActiveIdx(idx);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [gsapActive]);

  return (
    <section
      ref={sectionRef}
      id="pipeline"
      aria-labelledby="pipeline-heading"
      className="pipeline-section relative isolate"
    >
      <div className="pipeline-blur-overlay" aria-hidden="true" />

      <div className="pipeline-container">
        <div className="grid grid-cols-1 gap-[6vh] lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <PipelineSticky activeIdx={activeIdx} total={STEPS.length} />
          </div>

          <div className="lg:col-span-7">
            <ol role="list" className="flex flex-col gap-8 lg:gap-[6vh]">
              {STEPS.map((step) => (
                <PipelineCard key={step.n} step={step} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineSticky({ activeIdx, total }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div className="lg:sticky lg:top-[12vh]">
      <div
        ref={ref}
        className={`pipeline-reveal ${visible ? "is-visible" : ""}`}
        style={{ "--pipeline-reveal-delay": "0ms" }}
      >
        <div
          style={{
            fontFamily:
              "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          [ PIPELINE // FAKTY_NIE_OBIETNICE ]
        </div>
      </div>

      <h2
        id="pipeline-heading"
        className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 mt-6 text-white`}
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(2.75rem, 7vw, 5rem)",
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.045em",
          "--pipeline-reveal-delay": "120ms",
        }}
      >
        Jak niszczymy{" "}
        <span style={{ color: "#A1A1AA" }}>status quo.</span>
      </h2>

      <p
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-6 max-w-[440px]`}
        style={{
          fontSize: "17px",
          lineHeight: 1.55,
          color: "#D4D4D8",
          "--pipeline-reveal-delay": "260ms",
        }}
      >
        Cztery technologie. Cztery konkretne zyski. Bez magii — twarda
        inżynieria, którą widzisz na żywo.
      </p>

      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-10 flex items-center gap-4`}
        style={{ "--pipeline-reveal-delay": "380ms" }}
        aria-live="polite"
      >
        <div
          style={{
            fontFamily:
              "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            color: "#FFFFFF",
          }}
        >
          {String(activeIdx + 1).padStart(2, "0")} /{" "}
          <span style={{ color: "#A1A1AA" }}>
            {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="pipeline-progress" aria-hidden="true">
          <div
            className="pipeline-progress-fill"
            style={{ width: `${((activeIdx + 1) / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PipelineCard({ step }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  const ctaRef = useRef(null);
  useMagnetic(ctaRef, { strength: 0.18, radius: 110, max: 5 });

  return (
    <li className="pipeline-card" style={{ listStyle: "none" }}>
      <div
        ref={ref}
        className={`pipeline-reveal ${visible ? "is-visible" : ""}`}
        style={{
          fontFamily:
            "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.45)",
          "--pipeline-reveal-delay": "0ms",
        }}
      >
        <span style={{ color: "#FFFFFF", marginRight: "12px" }}>{step.n}</span>
        {step.badge}
      </div>

      <h3
        className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 mt-5 text-white`}
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(1.625rem, 2.6vw, 2.25rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.035em",
          "--pipeline-reveal-delay": "120ms",
        }}
      >
        {step.title}{" "}
        <span style={{ color: "#A1A1AA", fontWeight: 600 }}>
          / {step.tool}
        </span>
      </h3>

      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-5`}
        style={{ "--pipeline-reveal-delay": "240ms" }}
      >
        <span
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "21px",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          {step.gain}
        </span>
      </div>

      <p
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-3`}
        style={{
          fontSize: "17px",
          lineHeight: 1.6,
          color: "#D4D4D8",
          maxWidth: "560px",
          "--pipeline-reveal-delay": "360ms",
        }}
      >
        {step.body}
      </p>

      {step.cta && (
        <div
          className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-7`}
          style={{ "--pipeline-reveal-delay": "480ms" }}
        >
          <a
            ref={ctaRef}
            href={step.cta.href}
            className="cta-primary cta-primary--light"
          >
            {step.cta.label}
            <svg
              aria-hidden="true"
              className="arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}
    </li>
  );
}
