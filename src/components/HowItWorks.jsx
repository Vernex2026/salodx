import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

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

  // Auto-advance light touch
  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % STEPS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      aria-labelledby="how-heading"
      className="relative isolate overflow-hidden bg-[var(--color-cream)]"
    >
      {/* Subtle aurora wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, #FFE8DC 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, #C9E4FF 0%, transparent 60%)",
        }}
      />

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
                  background: i === active ? "rgba(255,255,255,0.5)" : "transparent",
                  transition: "background 320ms var(--ease-out), border-color 320ms var(--ease-out), opacity 320ms var(--ease-out)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="step-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-2)] bg-white text-[14px] font-medium text-[var(--color-ink)]"
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-display text-[var(--color-ink)]"
                    style={{
                      fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
                      letterSpacing: "-0.025em",
                      lineHeight: "1.05",
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
                className="font-display italic text-[var(--color-ink)]"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}
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
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          lineHeight: "1.02",
          letterSpacing: "-0.025em",
        }}
      >
        <span className="italic">3 kroki.</span>{" "}
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
      <div
        className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--color-hairline)]"
        style={{
          boxShadow:
            "0 24px 64px -16px rgba(11,20,38,0.12), 0 8px 24px -8px rgba(11,20,38,0.06), inset 0 0.5px 0 rgba(255,255,255,0.6)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAF7 100%)",
        }}
      >
        <SceneScan visible={active === 0} />
        <SceneTranslate visible={active === 1} />
        <SceneNotify visible={active === 2} />
      </div>

      {/* Step pill below visual */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-white/70 px-3 py-1.5 text-[12px] text-[var(--color-muted)] backdrop-blur-md">
          <span className="numeric font-medium text-[var(--color-ink)]">
            0{active + 1}
          </span>
          <span className="text-[var(--color-hairline-2)]">/</span>
          <span className="text-[var(--color-faint)]">03</span>
          <span className="ml-2 font-medium text-[var(--color-coral)]">
            {STEPS[active].title}
          </span>
        </div>
      </div>
    </div>
  );
}

const sceneCls = (visible) =>
  `absolute inset-0 flex items-center justify-center p-8 transition-all duration-700 ${
    visible
      ? "opacity-100 scale-100 blur-0"
      : "pointer-events-none scale-[0.98] opacity-0 blur-md"
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
              className="flex h-12 items-center justify-center rounded-lg border border-[var(--color-hairline)] bg-white"
              style={{
                animation: visible
                  ? `pulse-dot 2.2s ease-in-out infinite ${(i % 6) * 120}ms`
                  : "none",
              }}
            >
              <span className="font-display italic text-[14px] text-[var(--color-muted)]">
                {b}
              </span>
            </div>
          ))}
        </div>
        {/* Scan line */}
        {visible && (
          <div
            aria-hidden="true"
            className="scan-line pointer-events-none absolute -inset-y-2 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,107,90,0.7), transparent)",
              boxShadow: "0 0 16px rgba(255,107,90,0.4)",
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
        <div className="relative rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-4 text-[10.5px] leading-[1.55] text-[var(--color-faint)]">
          <div className="text-[8.5px] uppercase tracking-[0.14em] text-[var(--color-faint)]">
            §1. Regulamin
          </div>
          <p className="mt-2">
            <span className="line-through">
              Bank zastrzega sobie prawo do zmiany warunków oferty, w szczególności wysokości premii powitalnej oraz wymagań aktywności konta...
            </span>{" "}
            <span className="bg-[var(--color-brand-tint)] px-1 font-medium text-[var(--color-ink)]">
              wpływ ≥ 1 500 zł / m-c
            </span>{" "}
            <span className="line-through">
              przez okres co najmniej 3 (trzech) kolejnych miesięcy kalendarzowych...
            </span>{" "}
            <span className="bg-[var(--color-brand-tint)] px-1 font-medium text-[var(--color-ink)]">
              5 transakcji kartą / m-c
            </span>
            <span className="line-through">
              , przy czym do limitu wlicza się wyłącznie transakcje bezgotówkowe...
            </span>
          </p>
        </div>

        <div className="my-3 flex items-center justify-center text-[var(--color-coral)]">
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

        <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-coral)]">
            Co musisz wiedzieć
          </div>
          <ul className="mt-2 space-y-1.5 text-[12.5px] text-[var(--color-ink)]">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-coral)]" />
              <span><span className="numeric font-semibold">500 zł</span> bonusu powitalnego</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-coral)]" />
              <span>
                Wpływ <span className="numeric font-semibold">≥ 1 500 zł</span> / m-c × 3 m-ce
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-coral)]" />
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
      <div className="relative w-full max-w-[260px]">
        <div
          className="relative overflow-hidden rounded-[36px] border-[10px] border-[var(--color-ink)] bg-[var(--color-cream)]"
          style={{
            aspectRatio: "9 / 18",
            boxShadow:
              "0 24px 56px -16px rgba(11,20,38,0.35), 0 8px 16px -8px rgba(11,20,38,0.2)",
          }}
        >
          {/* Notch */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[var(--color-ink)]"
          />
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-medium text-[var(--color-ink)]">
            <span>09:24</span>
            <span className="opacity-50">•••</span>
          </div>

          <div className="px-3 py-4">
            <div
              className="rounded-2xl border border-[var(--color-hairline)] bg-white p-3.5"
              style={{
                boxShadow: "0 4px 12px rgba(11,20,38,0.06)",
                animation: visible
                  ? "toast-pop 700ms 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both"
                  : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-tint)]">
                  <span className="font-display italic text-[12px] text-[var(--color-coral)]">S</span>
                </div>
                <div className="leading-tight">
                  <div className="text-[10.5px] font-semibold text-[var(--color-ink)]">Saldox</div>
                  <div className="text-[8.5px] text-[var(--color-faint)]">teraz</div>
                </div>
              </div>
              <div className="mt-2.5 text-[11.5px] font-medium text-[var(--color-ink)]">
                3 nowe oferty dla Ciebie
              </div>
              <div className="mt-1 text-[9.5px] leading-[1.4] text-[var(--color-muted)]">
                mBank +500 zł, ING +450 zł, Santander +300 zł. Dopasowane do Twojego profilu.
              </div>
            </div>

            <div className="mt-2.5 rounded-2xl border border-[var(--color-hairline)] bg-white p-3 opacity-50">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-[var(--color-surface-2)]" />
                <div className="text-[9px] font-medium text-[var(--color-muted)]">
                  Zeszły tydzień
                </div>
              </div>
              <div className="mt-2 text-[10.5px] text-[var(--color-faint)]">
                2 oferty z deadline'em w tym tygodniu
              </div>
            </div>
          </div>
        </div>

        {/* Side label */}
        <div className="absolute -right-1 top-12 translate-x-full">
          <div className="whitespace-nowrap rounded-full bg-[var(--color-emerald)] px-2.5 py-1 text-[10px] font-medium text-white">
            1× / tydz.
          </div>
          <div className="mt-1 whitespace-nowrap text-[10px] text-[var(--color-faint)]">
            zero spamu
          </div>
        </div>
      </div>
    </div>
  );
}
