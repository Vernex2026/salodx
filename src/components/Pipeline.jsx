import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = [
  {
    n: "01",
    badge: "[ STACK // PROTOTYPE ]",
    title: "Prototyp",
    tool: "Lovable",
    gain: "72 godziny.",
    body: "Działający, klikalny prototyp w 72h — nie statyczne makiety po trzech miesiącach. Widzisz produkt na żywo zanim agencja przyśle pierwszy invoice.",
  },
  {
    n: "02",
    badge: "[ STACK // PRODUCTION_CODE ]",
    title: "Kod",
    tool: "Claude Code",
    gain: "Własność.",
    body: "Czysty, skalowalny kod prosto do Twojego repo GitHub. Bez uwiązania w No-Code, które zniknie za rok. Twoje IP, nie nasze.",
  },
  {
    n: "03",
    badge: "[ STACK // BACKEND ]",
    title: "Backend",
    tool: "Supabase",
    gain: "Zero chaosu.",
    body: "Relacyjny Postgres z Row-Level Security na każdym wierszu. Audit trail, edge replication, migracje przez MCP. Bazy, które nie zawiodą gdy biznes rośnie.",
  },
  {
    n: "04",
    badge: "[ STACK // HOSTING ]",
    title: "Hosting",
    tool: "Vercel Edge",
    gain: "Globalna wydajność.",
    body: "Sub-100ms latency w 18 regionach. Zero cold start, automatyczny deploy z każdego pusha. Architektura gotowa na ruch od dnia pierwszego.",
  },
];

export default function Pipeline() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [gsapActive] = useState(() => !prefersReducedMotion());

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      if (gsapActive) {
        gsap.to(section, {
          "--pipeline-blur": "24px",
          "--pipeline-darken": "1",
          ease: "none",
          scrollTrigger: {
            trigger: section,
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
          [ STOS // WARSZTAT ]
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
        Twój stos.{" "}
        <span style={{ color: "#A1A1AA" }}>Jeden warsztat.</span>
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
        Cztery narzędzia. Jedna ręka. Bez agencji, bez podwykonawców, bez
        tickets. Stack, który skaluje od prototypu do produkcji w 72 godziny.
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
          <span style={{ color: "#52525B" }}>
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
    </li>
  );
}
