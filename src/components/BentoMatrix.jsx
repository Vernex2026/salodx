import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BentoMatrix() {
  const sectionRef = useRef(null);
  const [gsapActive] = useState(() => !prefersReducedMotion());

  useLayoutEffect(() => {
    if (!gsapActive || !sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const fastTiles = gsap.utils.toArray(
        '[data-bento-parallax="fast"]',
        section
      );
      const slowTiles = gsap.utils.toArray(
        '[data-bento-parallax="slow"]',
        section
      );

      const trigger = {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      };

      if (fastTiles.length) {
        gsap.to(fastTiles, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: trigger,
        });
      }
      if (slowTiles.length) {
        gsap.to(slowTiles, {
          yPercent: 4,
          ease: "none",
          scrollTrigger: trigger,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapActive]);

  return (
    <section
      ref={sectionRef}
      id="bento"
      aria-labelledby="bento-heading"
      className="bento-section relative isolate"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 sm:px-8 md:py-40 lg:px-12 lg:py-48">
        <Header />

        <div className="bento-matrix-grid mt-16 lg:mt-24">
          <QTraderTile />
          <AIAgentsTile />
          <CRMLeasingTile />
          <KancelariaTile />
        </div>
      </div>
    </section>
  );
}

function Header() {
  const [ref, visible] = useReveal({ threshold: 0.35 });
  return (
    <div ref={ref} className="max-w-3xl">
      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""}`}
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
        [ MATRIX // PORTFOLIO_DEPTH ]
      </div>

      <h2
        id="bento-heading"
        className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 mt-6 text-white`}
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
        Cztery wymiary.{" "}
        <span style={{ color: "#A1A1AA" }}>Jeden stack.</span>
      </h2>

      <p
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-6 max-w-[640px]`}
        style={{
          fontSize: "18px",
          lineHeight: 1.55,
          color: "#D4D4D8",
          "--pipeline-reveal-delay": "260ms",
        }}
      >
        Od fintech real-time po legal-tech z NDA. Każdy z systemów
        poniżej powstał na tym samym fundamencie:{" "}
        <span style={{ color: "#FFFFFF" }}>
          Claude Code + Supabase + Vercel Edge
        </span>
        .
      </p>
    </div>
  );
}

function TileShell({ variant, parallax, tag, title, sub, live, children }) {
  return (
    <article
      className="bento-tile"
      data-tile-variant={variant}
      data-bento-parallax={parallax}
    >
      <div className="bento-tile-head">
        <span className="bento-tile-tag">{tag}</span>
        {live && (
          <span className="bento-tile-live">
            <span className="live-dot" aria-hidden="true" />
            <span>{live}</span>
          </span>
        )}
      </div>
      <h3 className="bento-tile-title">{title}</h3>
      <p className="bento-tile-sub">{sub}</p>
      <div className="bento-tile-stage">{children}</div>
    </article>
  );
}

function QTraderTile() {
  return (
    <TileShell
      variant="big"
      parallax="slow"
      tag="[ FINTECH // REAL-TIME DATA ]"
      title="QTrader"
      sub="Real-time order book + AI signals · WebSocket → React 19"
      live="MAINNET"
    >
      <div className="bento-qtrader">
        <div className="bento-qtrader-stats">
          <div className="bento-qtrader-stat">
            <span className="bento-qtrader-stat-label">PRICE</span>
            <span className="bento-qtrader-stat-value">42,318.50</span>
            <span style={{ color: "#00E5A0", fontSize: "10px" }}>+2.34%</span>
          </div>
          <div className="bento-qtrader-stat">
            <span className="bento-qtrader-stat-label">PnL</span>
            <span className="bento-qtrader-stat-value" style={{ color: "#00E5A0" }}>
              +1,247.83
            </span>
          </div>
          <div className="bento-qtrader-stat">
            <span className="bento-qtrader-stat-label">TICK/S</span>
            <span className="bento-qtrader-stat-value">1,247</span>
          </div>
        </div>

        <svg
          className="bento-qtrader-chart"
          viewBox="0 0 240 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const x = i * 10 + 3;
            const base = 45 + Math.sin(i * 0.7) * 18 + Math.cos(i * 0.4) * 10;
            const open = base + (Math.random() - 0.5) * 8;
            const close = base + (Math.random() - 0.5) * 12;
            const high = Math.min(open, close) - 3 - Math.random() * 5;
            const low = Math.max(open, close) + 3 + Math.random() * 5;
            const up = close < open;
            const color = up ? "#00E5A0" : "#FF5A7C";
            return (
              <g key={i}>
                <line
                  x1={x + 3}
                  y1={high}
                  x2={x + 3}
                  y2={low}
                  stroke={color}
                  strokeWidth="0.6"
                />
                <rect
                  x={x}
                  y={Math.min(open, close)}
                  width="6"
                  height={Math.abs(open - close)}
                  fill={color}
                />
              </g>
            );
          })}
        </svg>

        <div className="bento-qtrader-book">
          {[
            ["42,318.50", "0.234", "42,320.10", "0.890"],
            ["42,317.20", "0.567", "42,321.40", "1.234"],
            ["42,315.80", "0.089", "42,322.70", "0.456"],
          ].map((row, i) => (
            <div key={i} className="bento-qtrader-book-row">
              <span style={{ color: "#00E5A0" }}>{row[0]}</span>
              <span style={{ color: "#71717A" }}>{row[1]}</span>
              <span style={{ color: "#FF5A7C" }}>{row[2]}</span>
              <span style={{ color: "#71717A" }}>{row[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </TileShell>
  );
}

function AIAgentsTile() {
  const lines = [
    "▶ Analizuję metryki tygodniowe",
    "▶ MRR delta: +12.4% vs poprzedni tydzień",
    "▶ Generuję raport markdown",
    "▶ Wysyłam email → 3 odbiorców",
    "▶ Slack ping zespół → done",
    "✓ Agent completed task",
  ];

  return (
    <TileShell
      variant="vertical"
      parallax="fast"
      tag="[ LLM // AUTONOMOUS AGENTS ]"
      title="Self-Service AI"
      sub="Vercel AI SDK + Claude streaming"
      live="agent ready"
    >
      <div className="bento-ai-log">
        {lines.map((line, i) => (
          <div
            key={i}
            className="bento-ai-log-line"
            style={{ animationDelay: `${i * 280}ms` }}
          >
            <span
              style={{
                color: i === lines.length - 1 ? "#00E5A0" : "rgba(255,255,255,0.75)",
              }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>
    </TileShell>
  );
}

function CRMLeasingTile() {
  return (
    <TileShell
      variant="horizontal"
      parallax="slow"
      tag="[ B2B // AUTOMATION DASHBOARD ]"
      title="CRM Leasing"
      sub="Płatności + KPI + audit trail"
      live="124 firm online"
    >
      <div className="bento-crm">
        <div className="bento-crm-stats">
          <div className="bento-crm-stat">
            <span className="bento-crm-stat-label">MRR</span>
            <span className="bento-crm-stat-value">124k PLN</span>
            <span style={{ color: "#00E5A0", fontSize: "10px" }}>+12% MoM</span>
          </div>
          <div className="bento-crm-stat">
            <span className="bento-crm-stat-label">AKTYWNE</span>
            <span className="bento-crm-stat-value">47</span>
            <span style={{ color: "#A1A1AA", fontSize: "10px" }}>3 nowe</span>
          </div>
          <div className="bento-crm-stat">
            <span className="bento-crm-stat-label">ZALEGŁOŚCI</span>
            <span className="bento-crm-stat-value" style={{ color: "#D4A574" }}>
              3
            </span>
            <span style={{ color: "#A1A1AA", fontSize: "10px" }}>−2 w tym tyg.</span>
          </div>
        </div>

        <div className="bento-crm-bars">
          {[
            { label: "Pn", paid: 92, pending: 6, overdue: 2 },
            { label: "Wt", paid: 88, pending: 10, overdue: 2 },
            { label: "Śr", paid: 95, pending: 3, overdue: 2 },
            { label: "Cz", paid: 90, pending: 7, overdue: 3 },
            { label: "Pt", paid: 84, pending: 12, overdue: 4 },
            { label: "So", paid: 78, pending: 18, overdue: 4 },
            { label: "Nd", paid: 82, pending: 14, overdue: 4 },
          ].map((day) => (
            <div key={day.label} className="bento-crm-bar">
              <div className="bento-crm-bar-stack">
                <div
                  className="bento-crm-bar-seg"
                  style={{ height: `${day.overdue}%`, background: "#FF5A7C" }}
                />
                <div
                  className="bento-crm-bar-seg"
                  style={{ height: `${day.pending}%`, background: "#D4A574" }}
                />
                <div
                  className="bento-crm-bar-seg"
                  style={{ height: `${day.paid}%`, background: "#00E5A0" }}
                />
              </div>
              <span className="bento-crm-bar-label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </TileShell>
  );
}

function KancelariaTile() {
  return (
    <TileShell
      variant="star"
      parallax="fast"
      tag="[ LEGAL TECH // SECURE DB ]"
      title="Kancelaria Prawna"
      sub="Dane klientów objęte NDA"
      live="RLS active"
    >
      <div className="bento-kancelaria">
        <div className="bento-kancelaria-redacted" aria-hidden="true">
          {[
            ["#K-1432", "███████ ██ ████", "active", "PLN ████"],
            ["#K-1433", "████████ █████", "pending", "PLN ████"],
            ["#K-1434", "██████ ███ ████", "active", "PLN █████"],
            ["#K-1435", "█████████ █████", "active", "PLN ████"],
            ["#K-1436", "███████ ███████", "closed", "PLN ████"],
          ].map((row, i) => (
            <div key={i} className="bento-kancelaria-row">
              <span style={{ color: "rgba(255,255,255,0.45)" }}>{row[0]}</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{row[1]}</span>
              <span style={{ color: "rgba(255,255,255,0.40)" }}>{row[2]}</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{row[3]}</span>
            </div>
          ))}
        </div>

        <div className="bento-classified-stamp" aria-hidden="true">
          [ CLASSIFIED DATA // NDA ACTIVE ]
        </div>
      </div>
    </TileShell>
  );
}
