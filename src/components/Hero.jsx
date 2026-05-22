import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "../hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero() {
  const sectionRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const headlineRef = useRef(null);

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
    }, section);

    return () => ctx.revert();
  }, [gsapActive]);

  useEffect(() => {
    if (!gsapActive) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => clearTimeout(id);
  }, [gsapActive]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      data-gsap-active={gsapActive ? "true" : "false"}
      className="relative isolate overflow-hidden"
    >
      {/* v15 — ParticleCloud lives global w App.jsx (Big Bang
          scroll-aware). Eclipse mask stays scoped do Hero section. */}
      <div className="hero-eclipse-mask" aria-hidden="true" />

      {/* Layer 1 — Hero (left-aligned per Zdj 3) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col items-start justify-center px-6 py-24 sm:px-10 md:px-16 md:py-32 lg:px-20 lg:py-40">
        <div className="hero-content-card">
          <div
            data-rise="pill"
            className="hero-rise"
            style={{
              fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#F18D48",
              textTransform: "uppercase",
            }}
          >
            [ INŻYNIERIA OPROGRAMOWANIA // VERNEX ]
          </div>

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
            <HeroLine text="Produkcyjne oprogramowanie." baseDelay={120} />
            <span
              data-rise="headline-2"
              className="hero-rise block"
              style={{ "--rise-delay": "850ms", color: "#A1A1AA" }}
            >
              W tempie startupu.
            </span>
          </h1>

          <p
            data-rise="subhead"
            className="hero-rise mt-6 max-w-[600px] text-[17px] leading-[1.55] sm:text-[18px]"
            style={{ "--rise-delay": "1050ms", color: "#D4D4D8" }}
          >
            Odrzucamy wielomiesięczne terminy i zablokowany kod. Budujemy
            skalowalne aplikacje i dedykowane systemy szybciej, dając Ci na
            końcu pełną kontrolę nad własnością i treścią.
          </p>

          <div
            data-rise="ctas"
            className="hero-rise mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5"
            style={{ "--rise-delay": "1250ms" }}
          >
            <a
              ref={primaryCtaRef}
              href="#pipeline"
              className="cta-primary cta-primary--light"
            >
              Zobacz nasz proces
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}

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
