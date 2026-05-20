import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "../hooks/useMagnetic";
import HeroSpotlight from "./HeroSpotlight";
import BackgroundBeams from "./BackgroundBeams";
import FlowingLightBackground from "./decorative/FlowingLightBackground";
import HeroStarfield from "./decorative/HeroStarfield";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COSMIC_BG =
  "radial-gradient(ellipse 60% 50% at 25% 30%, rgba(77, 124, 255, 0.18) 0%, transparent 60%)," +
  "radial-gradient(ellipse 50% 40% at 75% 70%, rgba(123, 92, 255, 0.20) 0%, transparent 55%)," +
  "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0, 229, 255, 0.10) 0%, transparent 65%)," +
  "linear-gradient(180deg, #050811 0%, #0A0F1E 50%, #050811 100%)";

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
        )
        .from(
          ".hero-rise[data-rise='trust']",
          { y: 14, opacity: 0, duration: 0.55 },
          "-=0.40"
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
      className="relative isolate min-h-screen overflow-hidden"
      style={{ background: COSMIC_BG }}
    >
      {/* Layer order (back→front): video → starfield → beams → spotlight → content */}
      <FlowingLightBackground
        opacity={0.65}
        blendMode="screen"
        scale={1.6}
        speed={0.7}
        preload="auto"
      />
      <HeroStarfield count={150} />
      <BackgroundBeams />
      <HeroSpotlight sectionRef={sectionRef} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6 px-6 pb-24 pt-28 sm:px-8 md:pb-32 md:pt-32 lg:gap-8 lg:px-12 lg:pb-40 lg:pt-36">
        {/* LEFT COLUMN — col-span-7 content */}
        <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
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

          {/* Hero headline — Geist Bold, "Twój bonus" full white +
              "już czeka." white/55 per owner screenshot (1:1 match). */}
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="font-display mt-8 text-center text-white lg:text-left"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              lineHeight: "0.88",
              letterSpacing: "-0.06em",
              fontWeight: 700,
              transformOrigin: "left center",
              willChange: "transform",
            }}
          >
            <HeroLine text="Twój bonus" baseDelay={120} />
            <span
              data-rise="headline-2"
              className="hero-rise block text-white/55"
              style={{ "--rise-delay": "650ms" }}
            >
              już czeka.
            </span>
          </h1>

          {/* Subhead */}
          <p
            data-rise="subhead"
            className="hero-rise mx-auto mt-7 max-w-[460px] text-center text-[17px] leading-[1.5] text-white/65 sm:text-[19px] lg:mx-0 lg:text-left"
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
              className="cta-primary cta-primary--electric"
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

        {/* RIGHT COLUMN — intentionally empty per v13 spec (breathing room) */}
        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
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
