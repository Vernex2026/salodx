import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = [
  {
    number: "01",
    title: "Skanujemy",
    desc: "Co 4 godziny sprawdzamy 24 banki. Nowe oferty, zmienione warunki, wycofane promocje — wszystko w jednym miejscu.",
  },
  {
    number: "02",
    title: "Tłumaczymy",
    desc: "AI czyta regulaminy za Ciebie. Zostają tylko konkrety: kwota, warunki, deadline. Bez gwiazdek, bez drobnego druku.",
  },
  {
    number: "03",
    title: "Powiadamiamy",
    desc: "Jeden mail w tygodniu z ofertami dopasowanymi do Twojego profilu. Zero spamu. Wypisanie się jednym kliknięciem.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  // Scroll-driven active step. On desktop with motion enabled, active
  // state is tied to scroll progress through the section (0-33%=step 0,
  // 33-66%=1, 66-100%=2). On reduced-motion / mobile, fallback interval.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion() || window.matchMedia("(max-width: 768px)").matches) {
      const id = window.setInterval(() => {
        setActive((v) => (v + 1) % STEPS.length);
      }, 4200);
      return () => window.clearInterval(id);
    }
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          const next = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          setActive((cur) => (cur === next ? cur : next));
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      aria-labelledby="how-heading"
      className="section-light relative isolate overflow-hidden"
    >

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <Header />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Visual */}
          <StepVisual active={active} />

          {/* Step list */}
          <ol role="list" className="space-y-4 lg:space-y-2">
            {STEPS.map((step, i) => (
              <li
                key={step.number}
                data-active={i === active}
                className="step-row group flex items-start gap-5 rounded-2xl border p-5 lg:p-6"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{
                  borderColor: i === active ? "var(--color-hairline)" : "transparent",
                  background: i === active ? "rgba(6,7,11,0.04)" : "transparent",
                  transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out), opacity 320ms var(--ease-out)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="step-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-2)] bg-transparent text-[14px] font-semibold text-[var(--color-ink)]"
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-display text-[var(--color-ink)]"
                    style={{
                      fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                      letterSpacing: "-0.045em",
                      lineHeight: "1.02",
                      fontWeight: 700,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[var(--color-muted)] sm:text-[16px]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Anchor stats — small */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-[var(--color-hairline)] pt-10 text-center sm:gap-12 lg:mt-24">
          {[
            { v: "co 4h", l: "Aktualizacja" },
            { v: "0 zł", l: "Koszt dla Ciebie" },
            { v: "1×/tydz.", l: "Mail z ofertami" },
            { v: "0 spamu", l: "Reklam, pop-upów" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center">
              <span
                className="font-display text-[var(--color-ink)]"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.035em", fontWeight: 400 }}
              >
                {s.v}
              </span>
              <span className="mt-0.5 eyebrow text-[var(--color-faint)]">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} max-w-3xl`}>
      <div className="eyebrow text-[var(--color-faint)]">Proces</div>
      <h2
        id="how-heading"
        className="font-display mt-4 text-[var(--color-ink)]"
        style={{
          fontSize: "clamp(3rem, 8vw, 6rem)",
          lineHeight: "0.94",
          letterSpacing: "-0.06em",
          fontWeight: 700,
        }}
      >
        <span>3 kroki.</span>{" "}
        <span>Bez kont, bez prowizji.</span>
      </h2>
      <p className="mt-6 max-w-xl text-[16px] leading-[1.55] text-[var(--color-muted)] sm:text-[17px]">
        Nie sprzedajemy. Nie pobieramy prowizji od banków. Żyjemy z premium subskrypcji
        — dlatego pokazujemy tylko oferty, które naprawdę się opłacają.
      </p>
    </div>
  );
}

/* ── Step visual — cross-fading scenes ── */
function StepVisual({ active }) {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} relative mx-auto w-full max-w-[480px]`}
    >
      <div className="phone-glass-frame relative aspect-[4/5] overflow-hidden">
        <SceneScan visible={active === 0} />
        <SceneTranslate visible={active === 1} />
        <SceneNotify visible={active === 2} />
      </div>

      {/* Step pill below visual — solid black on light section */}
      <div className="mt-5 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-3.5 py-1.5 text-[12px] text-white">
          <span className="numeric font-semibold">
            0{active + 1}
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">03</span>
          <span className="ml-2 font-semibold">
            {STEPS[active].title}
          </span>
        </div>
      </div>
    </div>
  );
}

const sceneCls = (visible) =>
  `absolute inset-0 flex items-center justify-center p-8 transition-all duration-[520ms] ${
    visible
      ? "opacity-100 scale-100 blur-0"
      : "pointer-events-none scale-[0.97] opacity-0 blur-sm"
  }`;

function SceneScan({ visible }) {
  const BANKS = [
    "m", "S", "I", "P", "P", "A",
    "M", "B", "C", "C", "N", "T",
    "V", "P", "I", "B", "V", "A",
    "R", "N", "B", "W", "V", "P",
  ];
  return (
    <div className={sceneCls(visible)}>
      <div className="relative w-full">
        <div className="grid grid-cols-6 gap-2.5">
          {BANKS.map((b, i) => (
            <div
              key={i}
              className="flex h-12 items-center justify-center rounded-lg border border-[rgba(6,7,11,0.08)] bg-white"
              style={{
                animation: visible
                  ? `pulse-dot 2.2s ease-in-out infinite ${(i % 6) * 120}ms`
                  : "none",
              }}
            >
              <span className="font-display text-[14px] font-bold text-[rgba(6,7,11,0.55)]" style={{letterSpacing:"-0.02em"}}>
                {b}
              </span>
            </div>
          ))}
        </div>
        {/* Scan line — solid black on white, no glow */}
        {visible && (
          <div
            aria-hidden="true"
            className="scan-line pointer-events-none absolute -inset-y-2 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,7,11,0.85), transparent)",
            }}
          />
        )}
      </div>
    </div>
  );
}

function SceneTranslate({ visible }) {
  return (
    <div className={sceneCls(visible)}>
      <div className="w-full">
        <div className="relative rounded-xl border border-[rgba(6,7,11,0.08)] bg-white p-4 text-[10.5px] leading-[1.55] text-[rgba(6,7,11,0.45)]">
          <div className="text-[8.5px] uppercase tracking-[0.14em] text-[rgba(6,7,11,0.45)]">
            §1. Regulamin
          </div>
          <p className="mt-2">
            <span className="line-through">
              Bank zastrzega sobie prawo do zmiany warunków oferty, w szczególności wysokości premii powitalnej oraz wymagań aktywności konta...
            </span>{" "}
            <span className="bg-[rgba(6,7,11,0.06)] px-1 font-semibold text-[var(--color-black)]">
              wpływ ≥ 1 500 zł / m-c
            </span>{" "}
            <span className="line-through">
              przez okres co najmniej 3 (trzech) kolejnych miesięcy kalendarzowych...
            </span>{" "}
            <span className="bg-[rgba(6,7,11,0.06)] px-1 font-semibold text-[var(--color-black)]">
              5 transakcji kartą / m-c
            </span>
            <span className="line-through">
              , przy czym do limitu wlicza się wyłącznie transakcje bezgotówkowe...
            </span>
          </p>
        </div>

        <div className="my-3 flex items-center justify-center text-[var(--color-black)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M5 11l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="rounded-xl border border-[rgba(6,7,11,0.08)] bg-white p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-black)]">
            Co musisz wiedzieć
          </div>
          <ul className="mt-2 space-y-1.5 text-[12.5px] text-[var(--color-black)]">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-live)]" />
              <span><span className="numeric font-semibold">500 zł</span> bonusu powitalnego</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-live)]" />
              <span>
                Wpływ <span className="numeric font-semibold">≥ 1 500 zł</span> / m-c × 3 m-ce
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-live)]" />
              <span>
                <span className="numeric font-semibold">5</span> transakcji kartą / m-c
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SceneNotify({ visible }) {
  return (
    <div className={sceneCls(visible)}>
      <div
        className="relative w-full max-w-[260px]"
        style={{ transform: "scale(1.06)" }}
      >
        <div
          className="relative overflow-hidden rounded-[40px] bg-[#0A0C14]"
          style={{
            aspectRatio: "9 / 18",
            border: "12px solid #06070B",
            boxShadow:
              "0 36px 64px -16px rgba(6,7,11,0.55), 0 12px 24px -8px rgba(6,7,11,0.35), inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0.5px 0 rgba(255,255,255,0.10)",
          }}
        >
          {/* Notch */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[#06070B]"
          />
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-medium text-[var(--color-ink)]">
            <span>09:24</span>
            <span className="opacity-50">•••</span>
          </div>

          <div className="px-3 py-4">
            <div
              className="rounded-2xl border border-white/12 bg-white/[0.08] p-3.5"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.30)",
                animation: visible
                  ? "toast-pop 700ms 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both"
                  : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                  <span className="font-display text-[12px] font-bold text-black" style={{letterSpacing:"-0.02em"}}>S</span>
                </div>
                <div className="leading-tight">
                  <div className="text-[10.5px] font-semibold text-white">Saldox</div>
                  <div className="text-[8.5px] text-white/55">teraz</div>
                </div>
              </div>
              <div className="mt-2.5 text-[11.5px] font-medium text-white">
                3 nowe oferty dla Ciebie
              </div>
              <div className="mt-1 text-[9.5px] leading-[1.4] text-white/55">
                mBank +500 zł, ING +450 zł, Santander +300 zł. Dopasowane do Twojego profilu.
              </div>
            </div>

            <div className="mt-2.5 rounded-2xl border border-white/8 bg-white/[0.02] p-3 opacity-50">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-white/[0.06]" />
                <div className="text-[9px] font-medium text-white/55">
                  Zeszły tydzień
                </div>
              </div>
              <div className="mt-2 text-[10.5px] text-white/45">
                2 oferty z deadline'em w tym tygodniu
              </div>
            </div>
          </div>
        </div>

        {/* Side label — solid black on light section, no glow */}
        <div className="absolute -right-1 top-12 translate-x-full">
          <div
            className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: "var(--color-black)", color: "var(--color-white)" }}
          >
            1× / tydz.
          </div>
          <div className="mt-1 whitespace-nowrap text-[10px] text-[rgba(6,7,11,0.45)]">
            zero spamu
          </div>
        </div>
      </div>
    </div>
  );
}
