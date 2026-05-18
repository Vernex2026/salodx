import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTilt3D } from "../hooks/useTilt3D";
import { useOrbParallax } from "../hooks/useOrbParallax";
import BankLogo from "./BankLogo";
import HeroOrbFallback from "./HeroOrbFallback";

const HeroOrb = lazy(() => import("./HeroOrb"));

gsap.registerPlugin(ScrollTrigger);

/* Kill switch — flip to false to ship the static fallback only. */
const ORB_ENABLED = true;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero() {
  const sectionRef = useRef(null);
  const cardTiltRef = useRef(null);
  const cardWrapRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const headlineRef = useRef(null);
  const orbWrapRef = useRef(null);

  const [gsapActive] = useState(() => !prefersReducedMotion());

  // Shared parallax source — orb reads parallaxRef in useFrame,
  // card reads --orb-px CSS var via transform.
  const parallaxRef = useOrbParallax(sectionRef, { maxPx: 18, lerp: 0.12 });

  useMagnetic(primaryCtaRef, { strength: 0.22, radius: 110, max: 6 });
  useTilt3D(cardTiltRef, { triggerRef: cardWrapRef, maxDeg: 4, lerp: 0.08 });

  useLayoutEffect(() => {
    if (!gsapActive || !sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-rise[data-rise='pill']", { y: 18, opacity: 0, duration: 0.7 }, 0)
        .from(
          ".char-rise",
          { y: 32, opacity: 0, filter: "blur(6px)", duration: 0.7, stagger: 0.026 },
          0.18
        )
        .from(
          ".hero-rise[data-rise='headline-2']",
          { y: 28, opacity: 0, filter: "blur(8px)", duration: 0.8, ease: "power2.out" },
          0.65
        )
        .from(
          ".hero-rise[data-rise='subhead']",
          { y: 18, opacity: 0, duration: 0.7 },
          "-=0.30"
        )
        .from(
          ".hero-rise[data-rise='ctas']",
          { y: 16, opacity: 0, duration: 0.65 },
          "-=0.45"
        )
        .from(
          ".hero-rise[data-rise='trust']",
          { y: 14, opacity: 0, duration: 0.6 },
          "-=0.40"
        )
        .from(
          ".hero-rise[data-rise='orb']",
          { y: 24, opacity: 0, scale: 1.04, filter: "blur(10px)", duration: 1.2, ease: "power2.out" },
          0.4
        )
        .from(
          ".hero-rise[data-rise='card']",
          { y: 32, opacity: 0, scale: 0.92, filter: "blur(10px)", duration: 0.95, ease: "back.out(1.4)" },
          "-=0.80"
        );

      gsap.to(headlineRef.current, {
        scale: 0.96,
        y: -12,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });

      gsap.to(orbWrapRef.current, {
        y: -52,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
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
      className="bg-onyx-mesh-drift bg-grain relative isolate overflow-hidden"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-10 px-6 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-32 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pb-40 lg:pt-36">
        {/* ── LEFT COLUMN — Typography + CTA ─────────────────── */}
        <div className="lg:col-span-7 lg:pr-8 flex flex-col justify-center">
          {/* Pill — insider signal */}
          <a
            href="#promocje"
            data-rise="pill"
            className="hero-rise group mx-auto inline-flex items-center gap-2.5 self-center rounded-full border border-[var(--color-hairline)] bg-white/[0.04] py-1.5 pl-2 pr-4 text-[13px] font-medium text-[var(--color-ink)] backdrop-blur-md transition-colors hover:bg-white/[0.08] lg:mx-0 lg:self-start"
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-success-tint)]">
              <span className="absolute h-2 w-2 rounded-full bg-[var(--mint-live)] animate-pulse-dot" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--mint-live)]" />
            </span>
            <span className="text-[var(--color-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">47 ofert</span> dziś · skanujemy 24 banki
            </span>
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-[var(--color-faint)] transition-transform group-hover:translate-x-0.5"
            >
              <path d="M3 6h6m-2-2l2 2-2 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Hero headline — italic display, second line is electric gradient */}
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="font-display mt-8 text-center lg:text-left"
            style={{
              fontSize: "clamp(3rem, 8.6vw, 7rem)",
              lineHeight: "0.94",
              letterSpacing: "-0.03em",
              transformOrigin: "left center",
              willChange: "transform",
            }}
          >
            <HeroLine
              text="Twój bonus"
              baseDelay={120}
              className="italic text-[var(--color-ink)]"
            />
            <span
              data-rise="headline-2"
              className="hero-rise block"
              style={{ "--rise-delay": "650ms" }}
            >
              <span className="display-electric-gradient">
                <span className="halo" aria-hidden="true">już czeka.</span>
                już czeka.
              </span>
            </span>
          </h1>

          {/* Subhead */}
          <p
            data-rise="subhead"
            className="hero-rise mx-auto mt-7 max-w-[420px] text-center text-[17px] leading-[1.5] text-[var(--color-muted)] sm:text-[19px] lg:mx-0 lg:text-left"
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
            <a ref={primaryCtaRef} href="#promocje" className="cta-electric">
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
              <svg aria-hidden="true" className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13.5px] text-[var(--color-faint)] lg:justify-start"
            style={{ "--rise-delay": "1300ms" }}
          >
            <span className="flex items-center gap-2 text-[var(--color-muted)]">
              <span className="live-dot" aria-hidden="true" />
              <span>
                <span className="font-medium text-[var(--color-ink)]">47</span> ofert
                <span className="mx-1.5 text-[var(--color-hairline-2)]">·</span>
                <span className="font-medium text-[var(--color-ink)]">24</span> banki
              </span>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[var(--color-hairline-2)] sm:inline-block" />
            <span>ostatnia aktualizacja: 12 min temu</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN — 3D orb + floating glass card ────── */}
        <div className="relative lg:col-span-5">
          <div
            ref={orbWrapRef}
            data-rise="orb"
            className="hero-rise relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
            style={{ perspective: "1400px" }}
          >
            {/* Kill-switch and Suspense gating: when ORB_ENABLED is false the
                lazy import is never reached at runtime; mobile + reduced motion
                still go through the orb's internal gates. */}
            {ORB_ENABLED ? (
              <Suspense fallback={<HeroOrbFallback />}>
                <HeroOrb enabled={ORB_ENABLED} parallaxRef={parallaxRef} />
              </Suspense>
            ) : (
              <HeroOrbFallback />
            )}
          </div>

          {/* Floating glass card — overlaps orb bottom-right.
              Card translates opposite to mouse via --orb-px (set by useOrbParallax). */}
          <div
            ref={cardWrapRef}
            data-rise="card"
            className="hero-rise absolute z-20"
            style={{
              width: "min(320px, 86%)",
              right: "-2%",
              bottom: "4%",
              perspective: "1200px",
              transform: "translate(var(--orb-px, 0px), var(--orb-py, 0px))",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              ref={cardTiltRef}
              className="float-card"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              <GlassOfferCard />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex"
      >
        <div className="flex flex-col items-center gap-2 text-[var(--color-faint)]">
          <span className="text-[10px] uppercase tracking-[0.18em]">scroll</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="opacity-60">
            <path d="M7 2v14M3 12l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom fade-out — onyx hand-off */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-b from-transparent to-[var(--color-onyx-1)]"
      />
    </section>
  );
}

/* ── Headline line — char-by-char reveal preserved at word boundaries ── */
function HeroLine({ text, baseDelay, className = "" }) {
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <span className={`block ${className}`} aria-label={text}>
      {words.map((word, wi) => {
        const wordNode = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((c, ci) => {
              const delay = baseDelay + charIdx * 26;
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

/* ── Glass card — dark glass + orb-facing halo + electric accents ── */
function GlassOfferCard() {
  return (
    <article
      className="glass-card orb-halo relative overflow-hidden rounded-[24px] p-7"
      aria-label="mBank · bonus powitalny 500 zł"
    >
      <header className="relative flex items-center gap-3">
        <BankLogo bank="mBank" size={36} />
        <div className="flex-1 leading-tight">
          <h3 className="font-sans text-[14px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
            mBank
          </h3>
          <span className="text-[12px] text-[var(--color-muted)]">Konto Intensive</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success-tint)] px-2 py-1 text-[10.5px] font-medium text-[var(--mint-live)]">
          <span className="live-dot" aria-hidden="true" />
          12 min
        </span>
      </header>

      <div className="relative mt-5">
        <div className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-faint)]">
          Bonus powitalny
        </div>
        <p className="mt-1.5 flex items-baseline gap-1">
          <span
            className="font-display italic numeric text-[var(--color-ink)]"
            style={{ fontSize: "4.5rem", lineHeight: "1", letterSpacing: "-0.04em" }}
          >
            500
          </span>
          <span
            className="font-display italic text-[var(--color-muted)]"
            style={{ fontSize: "1.5rem" }}
          >
            zł
          </span>
        </p>
        <span className="mt-1 inline-block rounded-full bg-[var(--electric-violet-tint)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--electric-violet-2)]">
          + zwrot 1%
        </span>
      </div>

      <ul className="relative mt-5 space-y-1.5 text-[12.5px] text-[var(--color-text)]">
        <li className="flex items-start gap-2">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0 text-[var(--mint-live)]">
            <path d="M3 7.5l2.5 2.5 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Wpływ ≥ <span className="numeric font-semibold">1 500 zł</span> / m-c
        </li>
        <li className="flex items-start gap-2">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0 text-[var(--mint-live)]">
            <path d="M3 7.5l2.5 2.5 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="numeric font-semibold">5</span>&nbsp;transakcji kartą
        </li>
      </ul>

      <footer className="relative mt-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--color-faint)]">
            Do końca
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span
              className="font-display italic numeric text-[20px] text-[var(--color-ink)]"
              style={{ letterSpacing: "-0.02em" }}
            >
              14
            </span>
            <span className="text-[11.5px] text-[var(--color-muted)]">dni</span>
          </div>
        </div>
        <button
          type="button"
          className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-transform hover:scale-105"
          style={{ background: "#F4F6FB", color: "#06070B" }}
        >
          Sprawdź
          <svg
            aria-hidden="true"
            width="11"
            height="11"
            viewBox="0 0 12 12"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M2.5 6h7M6 2.5L9.5 6 6 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </footer>
    </article>
  );
}
