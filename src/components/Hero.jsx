import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTilt3D } from "../hooks/useTilt3D";
import HeroShaderBackground from "./HeroShaderBackground";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero() {
  const [trustRef, trustVisible] = useReveal({ threshold: 0.4 });
  const promoCount = useCountUp(2481, { duration: 1800, when: trustVisible });
  const sectionRef = useRef(null);
  const spotlightRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const headlineRef = useRef(null);
  const mockupWrapRef = useRef(null);
  const mockupTiltRef = useRef(null);
  const [spotlightActive, setSpotlightActive] = useState(false);

  // Suppress CSS hero-rise / char-rise when GSAP will drive entrance.
  // Decided synchronously on first render so there's no flash of CSS animation.
  const [gsapActive] = useState(() => !prefersReducedMotion());

  useMagnetic(primaryCtaRef, { strength: 0.25, radius: 120, max: 6 });
  useTilt3D(mockupTiltRef, { triggerRef: mockupWrapRef, maxDeg: 5, lerp: 0.07 });

  // GSAP entrance timeline — replaces CSS hero-rise/char-rise delays.
  useLayoutEffect(() => {
    if (!gsapActive || !sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".hero-rise[data-rise='pill']", { y: 18, opacity: 0, duration: 0.7 }, 0)
        .from(
          ".char-rise",
          { y: 28, opacity: 0, filter: "blur(8px)", duration: 0.7, stagger: 0.022 },
          0.15
        )
        .from(
          ".hero-rise[data-rise='subhead']",
          { y: 16, opacity: 0, duration: 0.7 },
          "-=0.35"
        )
        .from(
          ".hero-rise[data-rise='ctas']",
          { y: 16, opacity: 0, duration: 0.7 },
          "-=0.45"
        )
        .from(
          ".hero-rise[data-rise='trust']",
          { y: 14, opacity: 0, duration: 0.7 },
          "-=0.45"
        )
        .from(
          ".hero-rise[data-rise='mockup']",
          { y: 28, opacity: 0, scale: 0.97, duration: 0.9, ease: "power2.out" },
          "-=0.85"
        );

      // Headline compress on scroll — Vercel-style
      gsap.to(headlineRef.current, {
        scale: 0.94,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.4,
        },
      });

      // Mockup parallax drift on scroll
      gsap.to(mockupWrapRef.current, {
        y: -48,
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

  // Refresh ScrollTrigger after fonts/layout settle
  useEffect(() => {
    if (!gsapActive) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, [gsapActive]);

  const handleMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Single source of truth — CSS vars on section. Spotlight & shader both read these.
    sectionRef.current.style.setProperty("--mx", `${x}%`);
    sectionRef.current.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      data-gsap-active={gsapActive ? "true" : "false"}
      className="bg-sky-hero bg-grain relative isolate overflow-hidden"
      onMouseMove={handleMove}
      onMouseEnter={() => setSpotlightActive(true)}
      onMouseLeave={() => setSpotlightActive(false)}
    >
      {/* WebGL shader gradient — animated brand-tinted mesh (BG layer) */}
      <HeroShaderBackground sectionRef={sectionRef} />

      {/* Aurora orbs — animated, NAD shaderem (multiply blend) */}
      <div className="bg-aurora" aria-hidden="true" />

      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className={spotlightActive ? "cursor-spotlight is-active" : "cursor-spotlight"}
        aria-hidden="true"
      />

      {/* Linear-signature subtle grid */}
      <div className="bg-grid-fine pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-32 lg:pt-24">
        {/* ── Left column: text + CTA + trust ────────────────── */}
        <div className="text-center lg:text-left">
          {/* Pill badge */}
          <a
            href="#promocje"
            data-rise="pill"
            className="hero-rise group inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-border)] bg-white/85 py-1.5 pl-2 pr-4 text-[13px] font-medium text-[var(--color-text)] shadow-[0_1px_2px_rgba(10,14,26,0.04)] backdrop-blur-md transition-all duration-200 hover:bg-white hover:shadow-[0_4px_12px_rgba(31,91,255,0.12)]"
            style={{ "--rise-delay": "0ms" }}
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-tint)]">
              <span className="absolute inline-flex h-2 w-2 animate-pulse-dot rounded-full bg-[var(--color-brand)]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
            </span>
            <span>
              <span className="text-[var(--color-muted)]">Nowość · </span>
              <span className="font-semibold text-[var(--color-ink)]">47 świeżych promocji</span>
              <span className="text-[var(--color-muted)]"> w tym tygodniu</span>
            </span>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="text-[var(--color-faint)] transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 6h6m-2-2l2 2-2 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Headline — 2-tier hierarchy z word-by-word letter reveal (Linear-grade) */}
          <h1
            ref={headlineRef}
            id="hero-heading"
            className="font-display mt-7 text-[44px] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--color-ink)] sm:text-[68px] lg:text-[88px] xl:text-[96px]"
            style={{ transformOrigin: "left center", willChange: "transform" }}
          >
            <HeroLine text="Bonus bankowy?" baseDelay={100} />
            <HeroLine text="Już go mamy." baseDelay={480} muted />
          </h1>

          {/* Subhead — krótki, decyzyjny */}
          <p
            data-rise="subhead"
            className="hero-rise mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-[var(--color-muted)] sm:text-[19px] lg:mx-0"
            style={{ "--rise-delay": "900ms" }}
          >
            Codziennie sprawdzamy 24 banki. Pokazujemy oferty z prawdziwymi warunkami i deadline'em.
          </p>

          {/* CTAs — primary pill (krótszy) + microtext + ghost text link */}
          <div
            data-rise="ctas"
            className="hero-rise mt-9 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6 lg:justify-start"
            style={{ "--rise-delay": "1000ms" }}
          >
            <div className="flex flex-col items-center gap-1.5 lg:items-start">
              <a
                ref={primaryCtaRef}
                href="#promocje"
                className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand)] px-7 text-[15px] font-semibold text-white shadow-[var(--shadow-glow)] transition-[background,box-shadow] duration-200 ease-out hover:bg-[var(--color-brand-hover)] hover:shadow-[0_0_0_1px_rgba(31,91,255,0.25),0_12px_32px_rgba(31,91,255,0.36),0_2px_6px_rgba(31,91,255,0.20)]"
              >
                <span aria-hidden="true" className="absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                Zobacz aktualne oferty
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <span className="text-[11.5px] text-[var(--color-faint)]">
                <span className="numeric font-medium text-[var(--color-muted)]">47 świeżych</span> w tym tygodniu
              </span>
            </div>

            <a
              href="#how"
              className="group inline-flex h-12 items-start gap-1.5 pt-3 text-[15px] font-medium text-[var(--color-ink)] transition-colors duration-200 hover:text-[var(--color-brand)]"
            >
              <span className="border-b border-transparent transition-colors duration-200 group-hover:border-current">
                Jak to działa
              </span>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Trust — JEDEN strong signal: live counter + press wordmarks */}
          <div
            ref={trustRef}
            data-rise="trust"
            className="hero-rise mt-10 space-y-3"
            style={{ "--rise-delay": "1100ms" }}
          >
            <div className="flex items-center gap-2 text-[14px] text-[var(--color-muted)] sm:gap-3 justify-center lg:justify-start">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              <span>
                Sprawdziliśmy{" "}
                <span className="numeric font-semibold text-[var(--color-ink)]">
                  {promoCount.toLocaleString("pl-PL").replace(/,/g, " ")}
                </span>{" "}
                promocji w 2026
              </span>
            </div>
            <ul role="list" className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-[var(--color-muted)] justify-center lg:justify-start">
              {["Bez rejestracji", "Bez logowania", "100% za darmo"].map((label, i, arr) => (
                <li key={label} className="flex items-center gap-1.5">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" className="text-[var(--color-brand)]">
                    <path d="M2.5 7.5l2.5 2.5 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{label}</span>
                  {i < arr.length - 1 && (
                    <span aria-hidden="true" className="ml-2 h-1 w-1 rounded-full bg-[var(--color-hairline-2)]" />
                  )}
                </li>
              ))}
            </ul>

            {/* Live signal — kto teraz przegląda (zastąpiło fake press wordmarks) */}
            <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)] justify-center lg:justify-start">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-brand)]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
              </span>
              <span><span className="numeric font-semibold text-[var(--color-ink)]">247</span> osób przegląda teraz</span>
            </div>
          </div>
        </div>

        {/* ── Right column: animated mockup IN-VIEW ────────────── */}
        <div
          ref={mockupWrapRef}
          data-rise="mockup"
          className="hero-rise relative mx-auto w-full max-w-md lg:max-w-none"
          style={{
            "--rise-delay": "500ms",
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Tilt host — 3D rotation applied here, float animation inside (composes cleanly) */}
          <div ref={mockupTiltRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            <HeroMockup />
          </div>
        </div>
      </div>

      {/* Soft fade to white at bottom (handoff) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}

/* ── Headline line — word-level whitespace-nowrap chronię słowa przed łamaniem
   wewnątrz; spacja jest siblingiem między słowami, więc łamanie może się
   wydarzyć tylko między nimi. ── */
function HeroLine({ text, baseDelay, muted = false }) {
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <span
      className={`block ${muted ? "text-[var(--color-muted)]" : ""}`}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const wordNode = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((c, ci) => {
              const delay = baseDelay + charIdx * 22;
              charIdx += 1;
              return (
                <span
                  key={ci}
                  className="char-rise inline-block"
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
            {wordNode}
            {" "}
          </span>
        );
      })}
    </span>
  );
}

/* ── Animated mockup — bazuje na obecnej karcie, dodaje float + toast ── */
function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow halo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-12 h-3/4 rounded-[40px] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(31,91,255,0.22), rgba(31,91,255,0))" }}
      />

      {/* Peer cards (decorative depth) */}
      <div
        aria-hidden="true"
        className="absolute -left-8 top-10 hidden h-44 w-56 rotate-[-5deg] rounded-3xl border border-[var(--color-hairline)] bg-white/70 backdrop-blur-sm lg:block"
        style={{ boxShadow: "var(--shadow-card)", opacity: 0.55 }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-8 top-16 hidden h-44 w-56 rotate-[5deg] rounded-3xl border border-[var(--color-hairline)] bg-white/70 backdrop-blur-sm lg:block"
        style={{ boxShadow: "var(--shadow-card)", opacity: 0.55 }}
      />

      {/* Floating toast — "Nowy bonus +500 zł" */}
      <div
        className="toast-pop absolute -top-6 right-2 z-20 flex items-center gap-2.5 rounded-2xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 text-[12.5px] text-[var(--color-text)] sm:right-0 lg:-right-4"
        style={{ boxShadow: "var(--shadow-lift)" }}
        role="status"
        aria-live="polite"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-tint)] text-[var(--color-brand)]" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <div className="leading-tight">
          <div className="font-medium text-[var(--color-ink)]">Nowy bonus <span className="numeric font-semibold text-[var(--color-brand)]">+500 zł</span></div>
          <div className="text-[11px] text-[var(--color-muted)]">mBank · przed chwilą</div>
        </div>
      </div>

      {/* Main mockup card — z float animation + multi-layer ambient occlusion */}
      <article
        className="hero-card-float relative overflow-hidden rounded-[28px] bg-white text-left"
        style={{ boxShadow: "var(--shadow-hero-mockup)" }}
        aria-label="Przykładowa promocja — mBank Konto Intensive"
      >
        {/* Top strip */}
        <header className="flex items-center justify-between border-b border-[var(--color-hairline)]/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg,#e11d48,#be123c)" }}
            >
              <span className="font-display text-[14px] font-semibold tracking-tight">mB</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">mBank</div>
              <div className="text-[12px] text-[var(--color-muted)]">Konto Intensive · Nowi klienci</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-success-tint)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-success)]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
            Aktualne
          </div>
        </header>

        {/* Body */}
        <div className="px-6 py-7">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
            Bonus powitalny
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display numeric text-[56px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)]">
              500
            </span>
            <span className="font-display text-[24px] font-medium tracking-[-0.02em] text-[var(--color-muted)]">zł</span>
            <span className="ml-1 rounded-full bg-[var(--color-brand-tint)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-brand)]">
              + zwrot 1%
            </span>
          </div>

          <ul className="mt-5 space-y-2 text-[13.5px] text-[var(--color-text)]">
            <li className="flex items-start gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0 text-[var(--color-brand)]">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Wpływ <span className="numeric font-semibold">≥ 1 500 zł</span> przez 3 miesiące
            </li>
            <li className="flex items-start gap-2">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0 text-[var(--color-brand)]">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="numeric font-semibold">5</span> transakcji kartą miesięcznie
            </li>
          </ul>

          {/* Deadline + CTA */}
          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-faint)]">Do końca</div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="font-display numeric text-[20px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">14</span>
                <span className="text-[13px] text-[var(--color-muted)]">dni</span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[var(--shadow-glow)] transition-all duration-200 hover:bg-[var(--color-brand-hover)]"
            >
              Sprawdź ofertę
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Footer meta */}
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-hairline)]/70 bg-[var(--color-canvas)]/60 px-6 py-3 text-[11.5px] text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="text-[var(--color-success)]">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              <path d="M4 6.2l1.4 1.4L8.2 4.8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Zweryfikowane <span className="numeric">02.05.2026</span>
          </span>
          <span className="flex items-center gap-1">
            <span>Wypłata:</span>
            <span className="numeric font-medium text-[var(--color-ink)]">do 45 dni</span>
          </span>
        </footer>
      </article>
    </div>
  );
}
