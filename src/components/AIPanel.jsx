import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReveal } from "../hooks/useReveal";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEMOS = [
  {
    prompt: "Zmień nagłówek na \"Startujemy.\" i powiększ przycisk.",
    log: [
      "Analizuję strukturę DOM",
      "Lokalizuję element <h1>",
      "Aktualizuję tekst nagłówka",
      "Skaluję .cta-primary do 1.15x",
      "Render commit ✓",
    ],
    apply: {
      heading: "Startujemy.",
      subhead: "Twój produkt jest live.",
      button: "Aktywuj wersję pro",
      buttonScale: 1.15,
      brand: "#FFFFFF",
    },
  },
  {
    prompt: "Zmień brand color na zielony mint.",
    log: [
      "Czytam zmienne CSS",
      "Mapuję rgba(255,255,255,*) → #00E5A0",
      "Aktualizuję .cta-primary background",
      "Aktualizuję accent border",
      "Render commit ✓",
    ],
    apply: {
      heading: "Premium karta debetowa.",
      subhead: "Już czeka.",
      button: "Aktywuj kartę",
      buttonScale: 1,
      brand: "#00E5A0",
    },
  },
  {
    prompt: "Dodaj badge \"Nowość\" obok nagłówka.",
    log: [
      "Analizuję slot heading-prefix",
      "Generuję komponent <Badge>",
      "Wstawiam: badge=\"NOWOŚĆ\"",
      "Animuję wejście (slide-in 240ms)",
      "Render commit ✓",
    ],
    apply: {
      heading: "Premium karta debetowa.",
      subhead: "Już czeka.",
      button: "Aktywuj kartę",
      buttonScale: 1,
      brand: "#FFFFFF",
      badge: "NOWOŚĆ",
    },
  },
];

const INITIAL_STATE = {
  heading: "Premium karta debetowa.",
  subhead: "Już czeka.",
  button: "Aktywuj kartę",
  buttonScale: 1,
  brand: "#FFFFFF",
  badge: null,
};

export default function AIPanel() {
  const sectionRef = useRef(null);
  const mockHeadingRef = useRef(null);
  const mockButtonRef = useRef(null);
  const mockBadgeRef = useRef(null);

  const [headerRef, headerVisible] = useReveal({ threshold: 0.35 });
  const [demoRef, demoVisible] = useReveal({ threshold: 0.4 });

  const [demoIdx, setDemoIdx] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | typing | analyzing | streaming | applied
  const [typedPrompt, setTypedPrompt] = useState("");
  const [streamLines, setStreamLines] = useState([]);
  const [mockState, setMockState] = useState(INITIAL_STATE);

  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!demoVisible || reduced) {
      if (reduced) {
        setMockState(DEMOS[0].apply);
        setStreamLines(DEMOS[0].log);
        setTypedPrompt(DEMOS[0].prompt);
        setPhase("applied");
      }
      return;
    }

    let timers = [];
    const sched = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const runDemo = (idx) => {
      const demo = DEMOS[idx];
      setStreamLines([]);
      setTypedPrompt("");
      setMockState(INITIAL_STATE);
      setPhase("typing");

      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx += 1;
        setTypedPrompt(demo.prompt.slice(0, charIdx));
        if (charIdx >= demo.prompt.length) {
          clearInterval(typeInterval);
          sched(() => {
            setPhase("analyzing");
            sched(() => {
              setPhase("streaming");
              demo.log.forEach((line, i) => {
                sched(() => {
                  setStreamLines((prev) => [...prev, line]);
                  if (i === Math.floor(demo.log.length / 2) - 1) {
                    setMockState(demo.apply);
                  }
                }, i * 240);
              });
              sched(() => {
                setPhase("applied");
                sched(() => {
                  const nextIdx = (idx + 1) % DEMOS.length;
                  setDemoIdx(nextIdx);
                  runDemo(nextIdx);
                }, 4200);
              }, demo.log.length * 240 + 400);
            }, 900);
          }, 600);
        }
      }, 28);
      timers.push(typeInterval);
    };

    sched(() => runDemo(0), 1400);

    return () => {
      timers.forEach((id) => clearTimeout(id));
      timers.forEach((id) => clearInterval(id));
    };
  }, [demoVisible, reduced]);

  useLayoutEffect(() => {
    if (!mockButtonRef.current) return;
    if (reduced) {
      gsap.set(mockButtonRef.current, { scale: mockState.buttonScale });
      return;
    }
    gsap.to(mockButtonRef.current, {
      scale: mockState.buttonScale,
      duration: 0.7,
      ease: "back.out(1.7)",
    });
  }, [mockState.buttonScale, reduced]);

  return (
    <section
      ref={sectionRef}
      id="panel"
      aria-labelledby="panel-heading"
      className="relative isolate overflow-hidden h-screen w-screen flex items-center snap-start"
      style={{ background: "#000000" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 pb-12 sm:px-8 md:pt-28 md:pb-16 lg:px-12">
        <div ref={headerRef} className="max-w-3xl">
          <div
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""}`}
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.55)",
              "--pipeline-reveal-delay": "0ms",
            }}
          >
            [ GWIAZDA PROGRAMU // SELF_SERVICE_AI ]
          </div>

          <h2
            id="panel-heading"
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} m-0 mt-6 text-white`}
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
            Niezależność{" "}
            <span style={{ color: "#A1A1AA" }}>to standard.</span>
          </h2>

          <p
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} mt-6 max-w-[640px]`}
            style={{
              fontSize: "18px",
              lineHeight: 1.55,
              color: "#D4D4D8",
              "--pipeline-reveal-delay": "260ms",
            }}
          >
            Zarządzaj swoim produktem za pomocą języka naturalnego. Bez
            proszenia developerów o pomoc — wpisz co chcesz zmienić, system
            przepisuje UI w czasie rzeczywistym.
          </p>
        </div>

        <div
          ref={demoRef}
          className={`pipeline-reveal ${demoVisible ? "is-visible" : ""} mt-16 lg:mt-24`}
          style={{ "--pipeline-reveal-delay": "0ms" }}
        >
          <div className="aipanel-stage">
            <MockBrowser
              state={mockState}
              headingRef={mockHeadingRef}
              buttonRef={mockButtonRef}
              badgeRef={mockBadgeRef}
            />
            <PromptPanel
              demo={DEMOS[demoIdx]}
              typedPrompt={typedPrompt}
              streamLines={streamLines}
              phase={phase}
            />
          </div>

          <p
            className="mt-10 text-center"
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            DEMO — symulator pokazuje typowy flow. W produkcji: Claude Sonnet
            4.6 + Vercel AI SDK streamuje real-time.
          </p>
        </div>
      </div>
    </section>
  );
}

function MockBrowser({ state, headingRef, buttonRef, badgeRef }) {
  return (
    <div className="aipanel-browser">
      <div className="aipanel-browser-chrome">
        <div className="aipanel-browser-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FEBC2E" }} />
          <span style={{ background: "#28C840" }} />
        </div>
        <div className="aipanel-browser-url">vernex.app</div>
        <div style={{ width: "48px" }} />
      </div>

      <div className="aipanel-browser-canvas">
        <div className="aipanel-mock-content">
          <div className="aipanel-mock-eyebrow">
            {state.badge && (
              <span ref={badgeRef} className="aipanel-mock-badge">
                {state.badge}
              </span>
            )}
            <span>[ VERNEX BLACK ]</span>
          </div>

          <h3
            ref={headingRef}
            className="aipanel-mock-heading"
            style={{ color: state.brand === "#FFFFFF" ? "#06070B" : state.brand }}
          >
            {state.heading}
            <span style={{ color: "#A1A1AA", display: "block" }}>
              {state.subhead}
            </span>
          </h3>

          <button
            ref={buttonRef}
            type="button"
            className="aipanel-mock-cta"
            style={{
              background: state.brand,
              color: state.brand === "#00E5A0" ? "#06070B" : "#FFFFFF",
            }}
            onClick={(e) => e.preventDefault()}
          >
            {state.button} →
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptPanel({ demo, typedPrompt, streamLines, phase }) {
  return (
    <div className="aipanel-prompt-panel" role="region" aria-label="Self-Service AI prompt panel">
      <div className="aipanel-prompt-header">
        <span className="aipanel-prompt-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1.5L8.6 5.4L12.5 7L8.6 8.6L7 12.5L5.4 8.6L1.5 7L5.4 5.4L7 1.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>Powiedz co zmienić</span>
        <span className="aipanel-prompt-status" data-phase={phase}>
          {phase === "analyzing" && (
            <>
              <span className="live-dot" aria-hidden="true" />
              <span>analizuję</span>
            </>
          )}
          {phase === "streaming" && (
            <>
              <span className="live-dot" aria-hidden="true" />
              <span>streamuję</span>
            </>
          )}
          {phase === "applied" && <span style={{ color: "#00E5A0" }}>✓ commit</span>}
        </span>
      </div>

      <div className="aipanel-prompt-input">
        <span>&gt;</span>
        <span className="aipanel-prompt-text">
          {typedPrompt}
          {phase === "typing" && <span className="aipanel-cursor">|</span>}
        </span>
      </div>

      {streamLines.length > 0 && (
        <div className="aipanel-prompt-log" aria-live="polite">
          {streamLines.map((line, i) => (
            <div key={i} className="aipanel-log-line">
              <span style={{ color: "#00E5A0", marginRight: "10px" }}>✓</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}

      <div className="aipanel-prompt-suggestions">
        <span className="aipanel-prompt-suggestion-label">Sugestie</span>
        {DEMOS.map((d, i) => (
          <span
            key={i}
            className={`aipanel-chip ${d.prompt === demo.prompt ? "is-active" : ""}`}
          >
            {d.prompt.length > 36 ? d.prompt.slice(0, 36) + "…" : d.prompt}
          </span>
        ))}
      </div>
    </div>
  );
}
