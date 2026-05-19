import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "../hooks/useMagnetic";
import HeroCardCarousel from "./HeroCardCarousel";

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
          ".hero-rise[data-rise='subhead']",
          { y: 18, opacity: 0, duration: 0.7 },
          "-=0.30"
        )
        .from(
          ".hero-rise[data-rise='ctas']",
          { y: 16, opacity: 0, duration: 0.6 },
          "-=0.45"
        )
        .from(
          ".hero-rise[data-rise='trust']",
          { y: 14, opacity: 0, duration: 0.55 },
          "-=0.40"
        )
        .from(
          ".hero-rise[data-rise='stack']",
          { y: 24, opacity: 0, scale: 0.96, duration: 1.0, ease: "power2.out" },
          0.35
        );

      gsap.to(headlineRef.current, {
        scale: 0.97,
        y: -10,
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
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
      style={{ background: "var(--color-black)" }}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-10 px-6 pb-24 pt-28 sm:px-8 md:pb-32 md:pt-32 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pb-40 lg:pt-36">
        {/* ── LEFT COLUMN — Typography + CTA ─────────────────── */}
        <div className="lg:col-span-7 lg:pr-4 flex flex-col justify-center">
          {/* Pill — insider signal (minimal) */}
          <a
            href="#promocje"
            data-rise="pill"
            className="hero-rise group mx-auto inline-flex items-center gap-2.5 self-center rounded-full border border-white/14 bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-medium text-white transition-colors hover:border-white/24 hover:bg-white/[0.08] lg:mx-0 lg:self-start"
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06]">
              <span className="live-dot" aria-hidden="true" />
            </span>
            <span className="text-white/65">
              <span className="font-semibold text-white">47 ofert</span> dziś
              <span className="mx-1.5 text-white/25">·</span>
              24 banki
            </span>
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-white/40 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M3 6h6m-2-2l2 2-2 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Hero headline — solid white Geist Bold, no gradient, no halo */}
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="font-display mt-8 text-center text-white lg:text-left"
            style={{
              fontSize: "clamp(3rem, 9vw, 7.5rem)",
              lineHeight: "0.94",
              letterSpacing: "-0.055em",
              fontWeight: 700,
              transformOrigin: "left center",
              willChange: "transform",
            }}
          >
            <HeroLine text="Twój bonus" baseDelay={120} />
            <HeroLine text="już czeka." baseDelay={520} />
          </h1>

          {/* Subhead */}
          <p
            data-rise="subhead"
            className="hero-rise mx-auto mt-7 max-w-[460px] text-center text-[17px] leading-[1.5] text-white/60 sm:text-[19px] lg:mx-0 lg:text-left"
            style={{ "--rise-delay": "900ms" }}
          >
            Codziennie skanujemy 24 banki. Pokazujemy tylko oferty warte Twojego czasu.
          </p>

          {/* CTAs */}
          <div
            data-rise="ctas"
            className="hero-rise mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5 lg:justify-start"
            style={{ "--rise-delay": "1100ms" }}
          >
            <a
              ref={primaryCtaRef}
              href="#promocje"
              className="cta-primary cta-primary--light"
            >
              Zobacz dzisiejsze oferty
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

            <a href="#how" className="cta-ghost">
              Jak to działa?
              <svg
                aria-hidden="true"
                className="arrow"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Trust pill */}
          <div
            data-rise="trust"
            className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13.5px] text-white/40 lg:justify-start"
            style={{ "--rise-delay": "1300ms" }}
          >
            <span className="flex items-center gap-2 text-white/55">
              <span className="live-dot" aria-hidden="true" />
              <span>
                <span className="font-semibold text-white">47</span> ofert
                <span className="mx-1.5 text-white/20">·</span>
                <span className="font-semibold text-white">24</span> banki
              </span>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:inline-block" />
            <span>ostatnia aktualizacja: 12 min temu</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Card stack hero visual ───────────── */}
        <div className="relative lg:col-span-5">
          <div
            data-rise="stack"
            className="hero-rise relative mx-auto w-full max-w-md lg:max-w-[560px]"
          >
            <HeroCardCarousel />
          </div>
        </div>
      </div>

      {/* Bottom hairline — sharp section divider, Revolut style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}

/* ── Headline line — char-by-char reveal ─────────────────────── */
function HeroLine({ text, baseDelay }) {
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <span className="block" aria-label={text}>
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
