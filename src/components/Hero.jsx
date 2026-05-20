import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "../hooks/useMagnetic";
import { useReveal } from "../hooks/useReveal";
import { ParticleCloud } from "./decorative/ParticleCloud";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero() {
  const sectionRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const headlineRef = useRef(null);
  const slabRef = useRef(null);

  const [gsapActive] = useState(() => !prefersReducedMotion());

  useMagnetic(primaryCtaRef, { strength: 0.18, radius: 110, max: 5 });

  useLayoutEffect(() => {
    if (!gsapActive || !sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-rise[data-rise='pill']", { y: 18, opacity: 0, duration: 0.7 }, 0)
        .from(
          ".char-rise",
          { y: 28, opacity: 0, duration: 0.7, stagger: 0.022 },
          0.15
        )
        .from(
          ".hero-rise[data-rise='headline-2']",
          { y: 28, opacity: 0, duration: 0.8, ease: "power2.out" },
          0.65
        )
        .from(
          ".hero-rise[data-rise='subhead']",
          { y: 18, opacity: 0, duration: 0.7 },
          "-=0.30"
        )
        .from(
          ".hero-rise[data-rise='ctas']",
          { y: 16, opacity: 0, duration: 0.6 },
          "-=0.45"
        );

      gsap.to(headlineRef.current, {
        scale: 0.97,
        y: -10,
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-content-card",
          start: "top top+=80",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });

      if (slabRef.current) {
        gsap.to(slabRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: slabRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [gsapActive]);

  useEffect(() => {
    if (!gsapActive) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => clearTimeout(id);
  }, [gsapActive]);

  useEffect(() => {
    const el = slabRef.current;
    if (!el) return;
    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const flush = () => {
      el.style.setProperty("--mouse-x", `${nextX}px`);
      el.style.setProperty("--mouse-y", `${nextY}px`);
      frame = 0;
    };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      nextX = e.clientX - rect.left;
      nextY = e.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      data-gsap-active={gsapActive ? "true" : "false"}
      className="relative isolate overflow-hidden"
      style={{ background: "#00030a" }}
    >
      {/* Full-bleed particle cloud — shared between Layer 1 + Layer 2 (single WebGL instance) */}
      <ParticleCloud className="z-0" />

      {/* Layer 1 — Hero (Vernex pitch) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full items-center justify-center px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="hero-content-card">
          {/* Tag — Geist Mono brackets */}
          <div
            data-rise="pill"
            className="hero-rise"
            style={{
              fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            [ VERNEX ENGINEERING // GPU_ACCELERATED ]
          </div>

          {/* Headline — Geist 800 brutalist grotesk, hierarchia bieli */}
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="m-0 mt-8 text-white"
            style={{
              fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 4.75rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              transformOrigin: "left center",
              willChange: "transform",
            }}
          >
            <HeroLine text="Surowa Moc." baseDelay={120} />
            <span
              data-rise="headline-2"
              className="hero-rise block"
              style={{ "--rise-delay": "650ms", color: "#A1A1AA" }}
            >
              Inteligentny Interfejs.
            </span>
          </h1>

          {/* Subhead — Vernex pitch */}
          <p
            data-rise="subhead"
            className="hero-rise mt-6 max-w-[600px] text-[17px] leading-[1.55] sm:text-[18px]"
            style={{ "--rise-delay": "900ms", color: "#D4D4D8" }}
          >
            Przekraczamy granice standardowego frontendu. Budujemy wysoko wydajne
            architektury napędzane akceleracją sprzętową (WebGL) oraz agenty AI
            oparte na najnowszym stacku (Vercel, AI SDK, Supabase). Bezkompromisowy
            design dla bezkompromisowej technologii.
          </p>

          {/* Single CTA — scroll do Layer 2 */}
          <div
            data-rise="ctas"
            className="hero-rise mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5"
            style={{ "--rise-delay": "1100ms" }}
          >
            <a
              ref={primaryCtaRef}
              href="#nexus"
              className="cta-primary cta-primary--light"
            >
              Zobacz naszą inżynierię
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
        </div>
      </div>

      {/* Layer 2 — Project NEXUS case study slab */}
      <div
        id="nexus"
        className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-24 sm:px-8 md:pb-32 lg:px-12 lg:pb-40"
      >
        <div ref={slabRef} className="project-nexus-slab">
          <NexusTag />
          <NexusHeadline />
          <NexusOneliner />
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}

/* ── Layer 2 sub-components ───────────────────────────────────── */

function NexusTag() {
  const [ref, visible] = useReveal({ threshold: 0.35 });
  return (
    <div
      ref={ref}
      className={`nexus-reveal ${visible ? "is-visible" : ""}`}
      style={{
        fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.55)",
        "--nexus-delay": "0ms",
      }}
    >
      [ CASE_STUDY // PROOF_OF_CONCEPT ]
    </div>
  );
}

function NexusHeadline() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <h2
      ref={ref}
      className="m-0 text-white"
      style={{
        fontFamily:
          "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.04em",
      }}
    >
      <span
        className={`nexus-reveal ${visible ? "is-visible" : ""} block`}
        style={{ "--nexus-delay": "120ms" }}
      >
        Project <span style={{ letterSpacing: "0.25em" }}>N E X U S</span>
        {":"}
      </span>
      <span
        className={`nexus-reveal ${visible ? "is-visible" : ""} block`}
        style={{ "--nexus-delay": "240ms", color: "#A1A1AA" }}
      >
        Wizualizacja AI w czasie rzeczywistym.
      </span>
    </h2>
  );
}

function NexusOneliner() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <p
      ref={ref}
      className={`nexus-reveal ${visible ? "is-visible" : ""}`}
      style={{
        fontFamily:
          "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        fontSize: "19px",
        fontWeight: 400,
        lineHeight: 1.55,
        color: "#A1A1AA",
        maxWidth: "640px",
        margin: 0,
        "--nexus-delay": "380ms",
      }}
    >
      Zbudowaliśmy reaktor WebGL renderujący 75 000 cząsteczek na GPU.
      Odwracamy zasady interfejsów dla LLM.
    </p>
  );
}

/* ── Headline line — char-by-char reveal ─────────────────────── */
function HeroLine({ text, baseDelay, italic = false, color = "#FFFFFF" }) {
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <span
      className="block"
      aria-label={text}
      style={{ fontStyle: italic ? "italic" : "normal", color }}
    >
      {words.map((word, wi) => {
        const wordNode = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((c, ci) => {
              const delay = baseDelay + charIdx * 24;
              charIdx += 1;
              return (
                <span
                  key={ci}
                  className="char-rise"
                  style={{ "--char-delay": `${delay}ms` }}
                  aria-hidden="true"
                >
                  {c}
                </span>
              );
            })}
          </span>
        );
        if (wi === words.length - 1) return wordNode;
        charIdx += 1;
        return (
          <span key={wi} className="inline">
            {wordNode}{" "}
          </span>
        );
      })}
    </span>
  );
}
