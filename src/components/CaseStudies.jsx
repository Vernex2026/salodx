import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";

const TRADING_BADGES = [
  "React 19",
  "WebSocket",
  "Vercel Edge",
  "<10ms latency",
  "1200 tick/s",
];

const CRM_BADGES = [
  "Supabase",
  "Postgres",
  "Row-Level Security",
  "~47k rekordów",
  "Custom React frontend",
];

export default function CaseStudies() {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.4 });

  return (
    <section
      id="cases"
      aria-labelledby="cases-heading"
      className="relative isolate overflow-hidden"
      style={{ background: "#06070B" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 sm:px-8 md:py-40 lg:px-12 lg:py-48">
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
            [ DOWÓD // REALNE_MASZYNY ]
          </div>

          <h2
            id="cases-heading"
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
            Realne maszyny.{" "}
            <span style={{ color: "#A1A1AA" }}>Realne wdrożenia.</span>
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
            Bez fikcji. Konkretne systemy, które działają w produkcji u
            naszych klientów.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-16 lg:mt-28 lg:gap-24">
          <TradingCase />
          <CrmCase />
        </div>
      </div>
    </section>
  );
}

function TradingCase() {
  const [ref, visible] = useReveal({ threshold: 0.2 });

  return (
    <article
      ref={ref}
      className={`case-card pipeline-reveal ${visible ? "is-visible" : ""}`}
      style={{ "--pipeline-reveal-delay": "0ms" }}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "#00E5A0",
            }}
          >
            [ CASE_01 // FINTECH ]
          </div>

          <h3
            className="m-0 mt-5 text-white"
            style={{
              fontFamily:
                "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(1.875rem, 3vw, 2.625rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
            }}
          >
            Tradingowy stack real-time
          </h3>

          <p
            className="mt-6"
            style={{ fontSize: "16px", lineHeight: 1.6, color: "#D4D4D8" }}
          >
            <strong style={{ color: "#FFFFFF" }}>Problem.</strong>{" "}
            Klient potrzebował wizualizować rynek krypto + instrumenty FX
            w sub-10ms latency z synchronicznym order book matching. Stare
            architektury REST-polling padały przy 200+ tick/s.
          </p>

          <p
            className="mt-4"
            style={{ fontSize: "16px", lineHeight: 1.6, color: "#D4D4D8" }}
          >
            <strong style={{ color: "#FFFFFF" }}>Rozwiązanie.</strong>{" "}
            WebSocket → React 19 z normalizacją event streams + atomic
            update batching. Wykresy renderują 60fps przy 1200+ tick/s,
            order book aktualizuje się bez tearing.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {TRADING_BADGES.map((b) => (
              <span key={b} className="case-badge">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <TradingMock active={visible} />
        </div>
      </div>
    </article>
  );
}

function TradingMock({ active }) {
  const CANDLE_COUNT = 28;
  const [candles, setCandles] = useState(() =>
    Array.from({ length: CANDLE_COUNT }, (_, i) => makeCandle(i))
  );
  const [book, setBook] = useState(() => makeBook());
  const [flashRow, setFlashRow] = useState(-1);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const candleInt = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const next = makeCandle(prev.length, last.close);
        return [...prev.slice(1), next];
      });
    }, 1600);

    const bookInt = setInterval(() => {
      setBook(makeBook());
      const row = Math.floor(Math.random() * 8);
      setFlashRow(row);
      setTimeout(() => setFlashRow(-1), 500);
    }, 900);

    return () => {
      clearInterval(candleInt);
      clearInterval(bookInt);
    };
  }, [active]);

  const high = Math.max(...candles.map((c) => c.high));
  const low = Math.min(...candles.map((c) => c.low));
  const range = high - low || 1;
  const chartH = 180;
  const candleW = 100 / CANDLE_COUNT;

  return (
    <div className="trading-mock">
      <div className="trading-mock-header">
        <div className="trading-mock-symbol">
          <span style={{ color: "#FFFFFF", fontWeight: 700 }}>BTC/USDT</span>
          <span style={{ color: "#A1A1AA", marginLeft: "12px" }}>
            {candles[candles.length - 1].close.toFixed(2)}
          </span>
        </div>
        <div className="trading-mock-live">
          <span className="live-dot" aria-hidden="true" />
          <span>MAINNET · LIVE</span>
        </div>
      </div>

      <svg
        className="trading-chart"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1="0"
            y1={chartH * p + 10}
            x2="100"
            y2={chartH * p + 10}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.2"
          />
        ))}
        {candles.map((c, i) => {
          const x = i * candleW + candleW * 0.15;
          const w = candleW * 0.7;
          const isUp = c.close >= c.open;
          const color = isUp ? "#00E5A0" : "#FF5A7C";
          const yHigh = ((high - c.high) / range) * chartH + 10;
          const yLow = ((high - c.low) / range) * chartH + 10;
          const yOpen = ((high - c.open) / range) * chartH + 10;
          const yClose = ((high - c.close) / range) * chartH + 10;
          const bodyY = Math.min(yOpen, yClose);
          const bodyH = Math.max(0.8, Math.abs(yOpen - yClose));
          return (
            <g key={c.id} className="candle">
              <line
                x1={x + w / 2}
                y1={yHigh}
                x2={x + w / 2}
                y2={yLow}
                stroke={color}
                strokeWidth="0.3"
              />
              <rect x={x} y={bodyY} width={w} height={bodyH} fill={color} />
            </g>
          );
        })}
      </svg>

      <div className="trading-orderbook">
        <div className="trading-orderbook-head">
          <span>BID</span>
          <span>SIZE</span>
          <span>ASK</span>
          <span>SIZE</span>
        </div>
        {book.map((row, i) => (
          <div
            key={i}
            className={`trading-orderbook-row ${flashRow === i ? "is-flash" : ""}`}
          >
            <span style={{ color: "#00E5A0" }}>{row.bid.toFixed(2)}</span>
            <span style={{ color: "#A1A1AA" }}>{row.bidSize.toFixed(3)}</span>
            <span style={{ color: "#FF5A7C" }}>{row.ask.toFixed(2)}</span>
            <span style={{ color: "#A1A1AA" }}>{row.askSize.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrmCase() {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  const count = useCountUp(47238, { duration: 2400, when: visible });

  return (
    <article
      ref={ref}
      className={`case-card pipeline-reveal ${visible ? "is-visible" : ""}`}
      style={{ "--pipeline-reveal-delay": "0ms" }}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "#00E5A0",
            }}
          >
            [ CASE_02 // ENTERPRISE_CRM ]
          </div>

          <h3
            className="m-0 mt-5 text-white"
            style={{
              fontFamily:
                "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(1.875rem, 3vw, 2.625rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
            }}
          >
            Migracja ~47k rekordów do Supabase
          </h3>

          <p
            className="mt-6"
            style={{ fontSize: "16px", lineHeight: 1.6, color: "#D4D4D8" }}
          >
            <strong style={{ color: "#FFFFFF" }}>Problem.</strong>{" "}
            Stary CRM oparty na rozproszonych tablicach Trello — brak
            relacyjnych powiązań klient ↔ sprawa ↔ dokument, brak audit
            trail, manualny export do Excela co tydzień.
          </p>

          <p
            className="mt-4"
            style={{ fontSize: "16px", lineHeight: 1.6, color: "#D4D4D8" }}
          >
            <strong style={{ color: "#FFFFFF" }}>Rozwiązanie.</strong>{" "}
            Migracja 47 238 rekordów do Supabase Postgres ze schematem
            relacyjnym + custom React frontend z RBAC. Pełny audit log
            via row-level security policies.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {CRM_BADGES.map((b) => (
              <span key={b} className="case-badge">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <CrmMock active={visible} count={count} />
        </div>
      </div>
    </article>
  );
}

function CrmMock({ active, count }) {
  return (
    <div className="crm-mock">
      <div className="crm-mock-source">
        <div className="crm-mock-source-label">PRZED · Trello tablice</div>
        <div className="crm-mock-cards">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`crm-mock-card ${active ? "is-fly" : ""}`}
              style={{
                background: ["#FFF4B0", "#FFE3A0", "#FFD8C2"][i],
                "--r": `${[-3, 1, 4][i]}deg`,
                animationDelay: `${i * 240}ms`,
              }}
            >
              <div className="crm-mock-card-title">
                {["Klient #1432", "Sprawa #87", "Dokument FV-93"][i]}
              </div>
              <div className="crm-mock-card-meta">
                {["Brak audit log", "Status: ?", "Excel manual"][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="crm-mock-arrow" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M6 16h20M20 8l8 8-8 8"
            stroke="#00E5A0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="crm-mock-target">
        <div className="crm-mock-target-head">
          <div className="crm-mock-source-label">PO · Supabase Postgres</div>
          <div className="crm-mock-target-status">
            <span className="live-dot" aria-hidden="true" />
            <span>{count.toLocaleString("pl-PL")} / 47 238 rows · 100%</span>
          </div>
        </div>
        <div className="crm-mock-grid">
          <div className="crm-mock-grid-head">
            <span>id</span>
            <span>klient</span>
            <span>status</span>
            <span>audit</span>
          </div>
          {[
            ["#1432", "Acme Sp. z o.o.", "active", "RLS ✓"],
            ["#1433", "Kowalski J.", "pending", "RLS ✓"],
            ["#1434", "Vernex Sp. z o.o.", "active", "RLS ✓"],
            ["#1435", "Lewandowski K.", "active", "RLS ✓"],
            ["#1436", "Nowak Trading", "closed", "RLS ✓"],
          ].map((row, i) => (
            <div
              key={i}
              className="crm-mock-grid-row"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span style={{ color: "#71717A" }}>{row[0]}</span>
              <span style={{ color: "#FFFFFF" }}>{row[1]}</span>
              <span
                style={{
                  color:
                    row[2] === "active"
                      ? "#00E5A0"
                      : row[2] === "pending"
                      ? "#D4A574"
                      : "#A1A1AA",
                }}
              >
                {row[2]}
              </span>
              <span style={{ color: "#00E5A0" }}>{row[3]}</span>
            </div>
          ))}
        </div>
        <div className="crm-mock-progress">
          <div
            className="crm-mock-progress-fill"
            style={{ width: `${(count / 47238) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── data generators ──────────────────────────────────────── */
let candleIdCounter = 0;
function makeCandle(i, prevClose) {
  candleIdCounter += 1;
  const base = prevClose ?? 42000 + Math.random() * 800;
  const drift = (Math.random() - 0.5) * 120;
  const open = base;
  const close = base + drift;
  const high = Math.max(open, close) + Math.random() * 80;
  const low = Math.min(open, close) - Math.random() * 80;
  return { id: `c-${candleIdCounter}`, open, close, high, low };
}

function makeBook() {
  const mid = 42320 + (Math.random() - 0.5) * 80;
  return Array.from({ length: 8 }, (_, i) => ({
    bid: mid - 2 - i * 1.5 - Math.random() * 0.5,
    bidSize: 0.05 + Math.random() * 1.4,
    ask: mid + 2 + i * 1.5 + Math.random() * 0.5,
    askSize: 0.05 + Math.random() * 1.4,
  }));
}
