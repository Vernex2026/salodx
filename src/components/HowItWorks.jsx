import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = [
  {
    n: "01",
    title: "Skanujemy",
    body: "Co 4 godziny pobieramy zmiany z 24 banków w Polsce. Wykrywamy nowe promocje, zmiany warunków, zbliżające się deadline'y. Ty nic nie musisz robić.",
    meta: "Cykl: 6× / dobę · Następny scan za 14 min",
  },
  {
    n: "02",
    title: "Tłumaczymy",
    body: "AI czyta regulaminy (średnio 18 stron każdy) i wyciąga to co naprawdę ma znaczenie — bonus, warunki, deadline, BIK, ograniczenia. Bez prawniczego.",
    meta: "Średnio 2 min / regulamin",
  },
  {
    n: "03",
    title: "Powiadamiamy",
    body: "Nowa promocja w twoim banku? Lepsza oferta od konkurencji? Mailing co poniedziałek z 3 ofertami pod twój profil — lub natychmiast, gdy oferta jest pilna.",
    meta: "0 spamu · 1 mail / tydzień",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header reveal (mobile/tablet) + desktop sticky header
      gsap.from(".hiw-reveal", {
        y: 22,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      // Mobile sequential cards
      gsap.from(".hiw-mobile-step", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".hiw-mobile-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      aria-labelledby="how-heading"
      className="relative bg-[var(--color-canvas)] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-hairline)] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Mobile/tablet header (visible <lg) */}
        <header className="mx-auto max-w-3xl text-center lg:hidden">
          <p className="hiw-reveal text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Proces
          </p>
          <h2
            id="how-heading-mobile"
            className="hiw-reveal font-display mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--color-ink)] sm:text-5xl"
          >
            Jak Saldox działa.
          </h2>
          <p className="hiw-reveal mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--color-muted)] sm:text-[16px]">
            Trzy kroki. Bez kont, bez prowizji, bez czytania regulaminów po nocach.
          </p>
        </header>

        {/* Desktop sticky-scroll storytelling */}
        <StickyStorytelling />

        {/* Mobile sequential stack (visible <lg) */}
        <ol role="list" className="hiw-mobile-grid mt-12 grid gap-6 lg:hidden">
          {STEPS.map((step, i) => (
            <li key={step.n} className="hiw-mobile-step">
              <MobileStep step={step} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Desktop sticky storytelling — sticky-left title + step indicator,
   right column scroll-driven blocks. Każdy block ma min-h-screen synchronizujące
   pacing — sticky-left wisi przez cały scroll-life sekcji, na końcu odpina się
   równo z bottom right column = section.end. ── */
function StickyStorytelling() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Active-step observer — kraj viewport ~24% (rootMargin top/bottom -38%).
    const observers = [];
    blockRefs.current.forEach((node, i) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
      );
      observer.observe(node);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="hidden lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 xl:gap-12">
      {/* Sticky left: title + step indicator. Bez pb-[14vh] — content wycentrowany
          symetrycznie, kończy się równo z right column gdy sticky odpina się. */}
      <div className="relative">
        <div className="sticky top-[110px] flex min-h-[calc(100vh-110px)] flex-col justify-center">
          <p className="hiw-reveal text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Proces
          </p>
          <h2
            id="how-heading"
            className="hiw-reveal font-display mt-4 text-[56px] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--color-ink)] xl:text-[64px]"
          >
            Jak Saldox<br />działa.
          </h2>
          <p className="hiw-reveal mt-5 max-w-md text-[17px] leading-relaxed text-[var(--color-muted)]">
            Trzy kroki. Bez kont, bez prowizji, bez czytania regulaminów po nocach.
          </p>

          {/* Vertical step indicator */}
          <ol role="list" className="hiw-reveal mt-10 space-y-1" aria-label="Postęp kroków">
            {STEPS.map((step, i) => (
              <li key={step.n}>
                <button
                  type="button"
                  onClick={() => {
                    const target = blockRefs.current[i];
                    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors duration-300 hover:bg-white"
                  aria-current={active === i ? "step" : undefined}
                >
                  <span
                    className={
                      active === i
                        ? "numeric font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[13px] font-semibold text-white shadow-[var(--shadow-glow)] transition-all duration-300"
                        : "numeric font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-2)] bg-white text-[13px] font-semibold text-[var(--color-faint)] transition-all duration-300"
                    }
                  >
                    {step.n}
                  </span>
                  <span className="flex-1">
                    <span
                      className={
                        active === i
                          ? "font-display block text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)] transition-colors duration-300"
                          : "font-display block text-[18px] font-medium tracking-[-0.02em] text-[var(--color-muted)] transition-colors duration-300"
                      }
                    >
                      {step.title}
                    </span>
                    <span className={
                      active === i
                        ? "block text-[12.5px] text-[var(--color-muted)] transition-opacity duration-300"
                        : "block text-[12.5px] text-[var(--color-faint)] transition-opacity duration-300"
                    }>
                      {step.meta}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Right column: 3 step blocks. Każdy ma min-h-screen (1 viewport per block)
          → 3×100vh + spacing, sticky-left wisi przez ~200vh scrollu i odpina się
          dokładnie na końcu section. Lewa.bottom == prawa.bottom. */}
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const isActive = active === i;
          return (
            <div
              key={step.n}
              ref={(el) => (blockRefs.current[i] = el)}
              className="flex min-h-screen flex-col justify-center py-12"
            >
              <article
                className={
                  "overflow-hidden rounded-[28px] border bg-white p-8 transition-all duration-500 ease-out " +
                  (isActive
                    ? "scale-[1.01] border-[var(--color-brand-border)] shadow-[0_0_0_1px_rgba(31,91,255,0.10),0_32px_56px_-16px_rgba(31,91,255,0.22),0_12px_24px_-8px_rgba(10,14,26,0.10)]"
                    : "scale-100 border-[var(--color-hairline)] shadow-[var(--shadow-card)] opacity-60")
                }
              >
                <div className="mb-7">
                  {i === 0 && <ScanMockup key={`scan-${isActive}`} active={isActive} />}
                  {i === 1 && <TranslateMockup key={`trans-${isActive}`} active={isActive} />}
                  {i === 2 && <NotifyMockup key={`notif-${isActive}`} active={isActive} />}
                </div>
                <p className={
                  "text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 " +
                  (isActive ? "text-[var(--color-brand)]" : "text-[var(--color-faint)]")
                }>
                  Krok {step.n}
                </p>
                <h3 className={
                  "font-display mt-3 text-[32px] font-semibold tracking-[-0.03em] transition-colors duration-500 " +
                  (isActive ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]")
                }>
                  {step.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--color-muted)]">
                  {step.body}
                </p>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Mobile step (no sticky, sequential) ──────────────────── */
function MobileStep({ step, index }) {
  return (
    <article
      className="overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-white p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-6">
        {index === 0 && <ScanMockup />}
        {index === 1 && <TranslateMockup />}
        {index === 2 && <NotifyMockup />}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
        Krok {step.n} · {step.meta}
      </p>
      <h3 className="font-display mt-3 text-[24px] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">
        {step.title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-muted)]">
        {step.body}
      </p>
    </article>
  );
}

/* ── Mockup: Step 01 — Scanning dashboard ─────────────────── */
function ScanMockup({ active = true } = {}) {
  const visible = true;
  const banks = [
    { initials: "mB", status: "ok" }, { initials: "Sa", status: "ok" }, { initials: "I", status: "scan" },
    { initials: "Pe", status: "ok" }, { initials: "Mi", status: "scan" }, { initials: "Al", status: "ok" },
    { initials: "BN", status: "scan" }, { initials: "Ci", status: "ok" }, { initials: "Re", status: "ok" },
    { initials: "PK", status: "scan" }, { initials: "Cr", status: "pend" }, { initials: "Vw", status: "scan" },
    { initials: "Ne", status: "ok" }, { initials: "T-", status: "ok" }, { initials: "In", status: "scan" },
    { initials: "Po", status: "scan" }, { initials: "No", status: "ok" }, { initials: "Eu", status: "pend" },
    { initials: "Ge", status: "scan" }, { initials: "Sk", status: "scan" }, { initials: "VC", status: "ok" },
    { initials: "Wi", status: "scan" }, { initials: "Ra", status: "ok" }, { initials: "B+", status: "scan" },
  ];
  const colors = {
    ok:   { bg: "var(--color-success-tint)",   fg: "var(--color-success)",  dot: "var(--color-success)"  },
    scan: { bg: "var(--color-brand-tint)",     fg: "var(--color-brand)",    dot: "var(--color-brand)"    },
    pend: { bg: "var(--color-warning-tint)",   fg: "var(--color-warning)",  dot: "var(--color-warning)"  },
  };
  return (
    <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]/60 p-5">
      <div className="mb-4 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
          </span>
          <span className="font-medium text-[var(--color-text)]">Live scan</span>
        </div>
        <span className="numeric text-[var(--color-muted)]">24 / 24 banki</span>
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {banks.map((b, i) => {
          const c = colors[b.status];
          const tileStyle = {
            background: c.bg,
            color: c.fg,
            transitionDelay: visible ? `${i * 18}ms` : "0ms",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.85)",
          };
          return (
            <div
              key={i}
              className="relative flex aspect-square flex-col items-center justify-center rounded-lg text-[10px] font-semibold transition-all duration-500 ease-out"
              style={tileStyle}
              title={b.status}
            >
              <span>{b.initials}</span>
              <span
                aria-hidden="true"
                className={b.status === "scan" && active ? "absolute right-1 top-1 h-1 w-1 rounded-full animate-pulse-dot" : "absolute right-1 top-1 h-1 w-1 rounded-full"}
                style={{ background: c.dot }}
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex items-center gap-3 text-[11px] text-[var(--color-muted)]">
        <span className="numeric font-medium text-[var(--color-text)]">14 scanning</span>
        <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <div className="scan-bar h-1 rounded-full bg-[var(--color-brand)]" />
        </div>
        <span className="numeric">~14 min</span>
      </div>
    </div>
  );
}

/* ── Mockup: Step 02 — Abstract chaos → crystallized data ──── */
function TranslateMockup({ active = true } = {}) {
  const visible = true;
  // Abstract noise rows — symulują regulamin jako "mgłę" tekstu (nie udają PDF)
  const noiseRows = [
    { w: "100%", op: 0.22 },
    { w: "88%",  op: 0.30 },
    { w: "94%",  op: 0.18 },
    { w: "72%",  op: 0.26 },
    { w: "96%",  op: 0.20 },
    { w: "80%",  op: 0.28 },
    { w: "90%",  op: 0.22 },
    { w: "65%",  op: 0.16 },
    { w: "84%",  op: 0.24 },
    { w: "76%",  op: 0.20 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      {/* Surowa "mgła" tekstu — chaos przed AI */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,14,26,0.04) 0%, rgba(10,14,26,0.02) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(10,14,26,0.05)",
        }}
      >
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-faint)]">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-faint)]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-faint)]" />
          </span>
          Surowy regulamin
        </div>
        {/* Blurred chaos lines — niska saturation, suggesting "noise" */}
        <div className="space-y-2" style={{ filter: "blur(1.2px)" }}>
          {noiseRows.map((r, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-[var(--color-ink)] transition-all duration-500 ease-out"
              style={{
                width: r.w,
                opacity: visible ? r.op : 0,
                transform: visible ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: visible ? `${i * 50}ms` : "0ms",
              }}
            />
          ))}
        </div>
        <div className="mt-3 text-[10px] text-[var(--color-faint)]">
          <span className="numeric">18</span> stron · <span className="numeric">2 412</span> wyrazów · drobny druk
        </div>
      </div>

      {/* Arrow — AI crystallizing chaos */}
      <div className="flex items-center justify-center" aria-hidden="true">
        <div
          className="hidden h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-500 ease-out sm:flex"
          style={{
            background: "linear-gradient(135deg,#4f7dff 0%,#1f5bff 100%)",
            boxShadow:
              "0 0 0 1px rgba(31,91,255,0.2), 0 8px 24px rgba(31,91,255,0.28), 0 2px 6px rgba(31,91,255,0.18)",
            opacity: active ? 1 : 0.45,
            transform: active ? "scale(1)" : "scale(0.88)",
            transitionDelay: active ? "550ms" : "0ms",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 8h10M8.5 4L13 8l-4.5 4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Crystallized extract — czyste dane, glassmorphism spójny z hero */}
      <div
        className="relative overflow-hidden rounded-[20px] bg-white p-5 transition-all duration-700 ease-out"
        style={{
          boxShadow:
            "0 0 0 1px rgba(10,14,26,0.05), 0 4px 8px -2px rgba(10,14,26,0.06), 0 16px 32px -12px rgba(20,40,80,0.14), 0 1px 0 rgba(255,255,255,0.6) inset",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          transitionDelay: active ? "700ms" : "0ms",
        }}
      >
        {/* Top sheen — refraction overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 30%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-brand)]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
            </span>
            Czyste dane
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display numeric text-[32px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)]">500</span>
            <span className="font-display text-[15px] font-medium text-[var(--color-muted)]">zł</span>
          </div>
          <ul className="mt-3 space-y-1.5 text-[11.5px] text-[var(--color-text)]">
            <li className="flex items-start gap-1.5">
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" className="mt-0.5 shrink-0" style={{ color: "#5fb88a" }}><path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Wpływ <span className="numeric font-semibold">1 500 zł / m-c</span>
            </li>
            <li className="flex items-start gap-1.5">
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" className="mt-0.5 shrink-0" style={{ color: "#5fb88a" }}><path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="numeric font-semibold">5</span> transakcji
            </li>
            <li className="flex items-start gap-1.5">
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" className="mt-0.5 shrink-0 text-[var(--color-faint)]"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
              <span className="text-[var(--color-muted)]">Bez BIK</span>
            </li>
          </ul>
          <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]/80">
            Deadline <span className="numeric ml-1 normal-case tracking-normal font-medium text-[var(--color-muted)]">31.05.2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mockup: Step 03 — Notifications ──────────────────────── */
function NotifyMockup({ active = true } = {}) {
  const show = true;
  // active rezerwowane na hover/highlight inside notification (npr. live pulse szybszy gdy active)
  void active;
  return (
    <div className="space-y-3">
      {/* Push notification */}
      <div
        className="flex items-start gap-3 rounded-2xl border border-[var(--color-hairline)] bg-white p-4 transition-all duration-500 ease-out"
        style={{
          boxShadow: "var(--shadow-sm)",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(-12px)",
          transitionDelay: show ? "150ms" : "0ms",
        }}
      >
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#4f7dff,#1f5bff)" }}
        >
          <span className="font-display text-[12px] font-semibold tracking-tight">S</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12.5px] font-semibold text-[var(--color-ink)]">Saldox</span>
            <span className="flex items-center gap-1 text-[10.5px] text-[var(--color-muted)]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
              </span>
              przed chwilą
            </span>
          </div>
          <div className="mt-0.5 text-[13px] text-[var(--color-text)]">
            Nowy bonus <span className="numeric font-semibold text-[var(--color-brand)]">+500 zł</span> w mBank · oferta wygasa za 14 dni
          </div>
        </div>
      </div>

      {/* Email preview */}
      <div
        className="overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white transition-all duration-500 ease-out"
        style={{
          boxShadow: "var(--shadow-sm)",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          transitionDelay: show ? "450ms" : "0ms",
        }}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-4 py-2.5 text-[11px] text-[var(--color-muted)]">
          <span>Od: <span className="text-[var(--color-text)]">Saldox &lt;hi@saldox.pl&gt;</span></span>
          <span className="numeric">pon. 09:00</span>
        </div>
        <div className="p-4">
          <div className="text-[13.5px] font-semibold text-[var(--color-ink)]">3 nowe oferty pod twój profil</div>
          <div className="mt-1.5 text-[12px] text-[var(--color-muted)]">
            mBank 500 zł · Santander 300 zł · ING 400 zł — wszystkie z deadline w maju. Szybki przegląd zajmie ci 2 minuty.
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-tint)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-brand)]">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="2"/></svg>
              Spersonalizowane
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--color-hairline-2)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-muted)]">
              Bez spamu · 1 mail / tyg.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

