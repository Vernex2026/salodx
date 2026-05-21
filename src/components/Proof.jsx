import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReveal } from "../hooks/useReveal";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
};

const CRM_BADGES = ["Supabase", "V12 Migration", "Custom Dashboard"];
const SAAS_BADGES = [
  "QR Automation",
  "Supabase",
  "Inventory API",
  "Real-time DB",
  "Hardware Integration",
];
const QTRADER_BADGES = ["Real-Time Data", "WebSockets", "AI Analysis"];

export default function Proof() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pinWrapRef = useRef(null);
  const [gsapActive] = useState(() => !prefersReducedMotion());
  const isDesktop = useDesktop();

  useLayoutEffect(() => {
    if (!gsapActive || !isDesktop || !trackRef.current || !pinWrapRef.current)
      return;
    const track = trackRef.current;
    const pinWrap = pinWrapRef.current;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          pin: true,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => tween.scrollTrigger?.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapActive, isDesktop]);

  return (
    <section
      ref={sectionRef}
      id="proof"
      aria-labelledby="proof-heading"
      className="proof-section relative isolate"
    >
      <Header />

      <div ref={pinWrapRef} className="proof-pin-wrap">
        <div ref={trackRef} className="proof-track">
          <CRMPanel />
          <SaaSPanel />
          <QTraderPanel />
        </div>
      </div>
    </section>
  );
}

function Header() {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  return (
    <div
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-32 sm:px-8 md:pt-40 lg:px-12 lg:pt-48"
    >
      <div className="max-w-3xl">
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
          [ THE_PROOF // BATTLE_TESTED ]
        </div>

        <h2
          id="proof-heading"
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
          Zbudowane do{" "}
          <span style={{ color: "#A1A1AA" }}>pracy w stresie.</span>
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
          Odrzucamy zlecenia na wizytówki. Projektujemy architekturę, która
          zarządza realnym kapitałem i potężnymi zbiorami danych.
        </p>

        <p
          className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-8`}
          style={{
            fontFamily:
              "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "12px",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            "--pipeline-reveal-delay": "400ms",
          }}
        >
          ↓ przewiń / hover na karty → X-Ray architektury
        </p>
      </div>
    </div>
  );
}

function ProofPanel({
  caseNo,
  industry,
  title,
  badges,
  gain,
  children,
  xRayContent,
}) {
  const [xRay, setXRay] = useState(false);
  const panelRef = useRef(null);

  return (
    <article
      ref={panelRef}
      className="proof-panel"
      data-xray={xRay ? "true" : "false"}
      onMouseEnter={() => setXRay(true)}
      onMouseLeave={() => setXRay(false)}
      onClick={() => setXRay((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setXRay((v) => !v);
        }
      }}
      aria-label={`${title} — kliknij aby zobaczyć architekturę`}
    >
      <header className="proof-panel-head">
        <div className="proof-panel-tag">
          [ {caseNo} // {industry} ]
        </div>
        <h3 className="proof-panel-title">{title}</h3>
        <div className="proof-panel-badges">
          {badges.map((b) => (
            <span key={b} className="case-badge">
              {b}
            </span>
          ))}
        </div>
        <p className="proof-panel-gain">{gain}</p>
      </header>

      <div className="proof-panel-stage">
        <div className="proof-xray-fg">{children}</div>
        <div className="proof-xray-bg">{xRayContent}</div>
        <div className="proof-xray-caption">
          <span className="live-dot" aria-hidden="true" />
          <span>X-RAY · ARCHITEKTURA</span>
        </div>
      </div>
    </article>
  );
}

function QTraderPanel() {
  return (
    <ProofPanel
      caseNo="CASE_03"
      industry="FINTECH"
      title="QTrader — platforma tradingowa"
      badges={QTRADER_BADGES}
      gain="Niskie opóźnienia i natychmiastowy dostęp do wykresów na żywo. System udźwignie strumień danych rynkowych bez zająknięcia interfejsu."
      xRayContent={<QTraderXRay />}
    >
      <QTraderMock />
    </ProofPanel>
  );
}

function QTraderMock() {
  return (
    <div className="qtrader-mock">
      <div className="qtrader-mock-header">
        <div>
          <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "15px" }}>
            BTC/USDT
          </span>
          <span style={{ color: "#00E5A0", marginLeft: "12px", fontFamily: "'Geist Mono', monospace" }}>
            42,318.50
          </span>
          <span style={{ color: "#00E5A0", marginLeft: "8px", fontSize: "12px" }}>
            +2.34%
          </span>
        </div>
        <div className="qtrader-mock-live">
          <span className="live-dot" aria-hidden="true" />
          <span>MAINNET · LIVE</span>
        </div>
      </div>

      <div className="qtrader-mock-body">
        <div className="qtrader-mock-book">
          <div className="qtrader-mock-book-head">
            <span>BID</span>
            <span>SIZE</span>
            <span>ASK</span>
            <span>SIZE</span>
          </div>
          {[
            [42318.5, 0.234, 42320.1, 0.89],
            [42317.2, 0.567, 42321.4, 1.234],
            [42315.8, 0.089, 42322.7, 0.456],
            [42314.3, 1.234, 42324.0, 0.678],
            [42312.5, 0.345, 42325.2, 0.234],
            [42310.8, 0.789, 42326.5, 1.456],
          ].map((row, i) => (
            <div key={i} className="qtrader-mock-book-row">
              <span style={{ color: "#00E5A0" }}>{row[0].toFixed(2)}</span>
              <span style={{ color: "#A1A1AA" }}>{row[1].toFixed(3)}</span>
              <span style={{ color: "#FF5A7C" }}>{row[2].toFixed(2)}</span>
              <span style={{ color: "#A1A1AA" }}>{row[3].toFixed(3)}</span>
            </div>
          ))}
        </div>

        <div className="qtrader-mock-chart">
          <svg viewBox="0 0 240 160" preserveAspectRatio="none">
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="0"
                y1={p * 160}
                x2="240"
                y2={p * 160}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = i * 13 + 4;
              const base = 80 + Math.sin(i * 0.6) * 30 + Math.cos(i * 0.3) * 15;
              const open = base + (Math.random() - 0.5) * 10;
              const close = base + (Math.random() - 0.5) * 14;
              const high = Math.min(open, close) - 5 - Math.random() * 8;
              const low = Math.max(open, close) + 5 + Math.random() * 8;
              const up = close < open;
              const color = up ? "#00E5A0" : "#FF5A7C";
              return (
                <g key={i}>
                  <line
                    x1={x + 5}
                    y1={high}
                    x2={x + 5}
                    y2={low}
                    stroke={color}
                    strokeWidth="0.8"
                  />
                  <rect
                    x={x + 1}
                    y={Math.min(open, close)}
                    width="8"
                    height={Math.abs(open - close)}
                    fill={color}
                  />
                </g>
              );
            })}
          </svg>
          <div className="qtrader-mock-chart-meta">
            <span style={{ color: "#A1A1AA", fontSize: "11px", fontFamily: "'Geist Mono', monospace" }}>
              1H · KANDELABRY
            </span>
            <span style={{ color: "#00E5A0", fontSize: "11px", fontFamily: "'Geist Mono', monospace" }}>
              60fps @ 1247 tick/s
            </span>
          </div>
        </div>
      </div>

      <div className="qtrader-mock-footer">
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>POZYCJA</span>
          <div style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>
            LONG 0.234 BTC
          </div>
        </div>
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>PnL</span>
          <div style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>
            +1,247.83 USDT
          </div>
        </div>
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>BALANCE</span>
          <div style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>
            48,392.16
          </div>
        </div>
      </div>
    </div>
  );
}

function QTraderXRay() {
  return (
    <div className="proof-xray-log">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>websocket://stream.qtrader.io/v3/orderbook</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>
          eu-west-1
        </span>
      </div>
      {[
        '< SUBSCRIBE { "channel": "orderbook", "pair": "BTCUSDT", "depth": 25 }',
        '> ACK channel=orderbook subscribed=true',
        '> TICK 42318.50 size=0.234 side=bid ts=1746821938.214',
        '> TICK 42320.10 size=0.890 side=ask ts=1746821938.218',
        '> TICK 42317.20 size=0.567 side=bid ts=1746821938.221',
        '> BATCH normalized 142 events in 0.8ms',
        '> FRAME rendered in 16.4ms — 60fps stable',
        '> AGGREGATE 1247 tick/s · drop_rate=0.000%',
        '> AI_SIGNAL momentum=bullish confidence=0.78',
        '> CIRCUIT_BREAKER armed · max_latency=10ms',
      ].map((line, i) => (
        <div
          key={i}
          className="proof-xray-log-line"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.30)",
              marginRight: "10px",
              width: "32px",
              display: "inline-block",
              fontSize: "10px",
            }}
          >
            {String(i + 1).padStart(3, "0")}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}

function CRMPanel() {
  return (
    <ProofPanel
      caseNo="CASE_01"
      industry="ENTERPRISE_CRM"
      title="System CRM (Kancelaria Prawna)"
      badges={CRM_BADGES}
      gain="Skalowalne bezpieczeństwo. Płynna migracja tysięcy krytycznych rekordów do nowoczesnej, relacyjnej bazy danych. Koniec z chaosem starych systemów."
      xRayContent={<CRMXRay />}
    >
      <CRMMock />
    </ProofPanel>
  );
}

function CRMMock() {
  return (
    <div className="crm-app-mock">
      <aside className="crm-app-mock-sidebar">
        <div className="crm-app-mock-brand">
          <div className="crm-app-mock-brand-mark">K</div>
          <div>
            <div style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 700 }}>
              Kancelaria
            </div>
            <div style={{ color: "#71717A", fontSize: "10px" }}>v.12.4</div>
          </div>
        </div>
        <nav className="crm-app-mock-nav">
          {[
            { label: "Pulpit", active: false },
            { label: "Sprawy", active: true, count: 127 },
            { label: "Klienci", active: false, count: 47 },
            { label: "Dokumenty", active: false, count: 1247 },
            { label: "Audyt", active: false },
            { label: "Ustawienia", active: false },
          ].map((it) => (
            <div
              key={it.label}
              className="crm-app-mock-nav-item"
              data-active={it.active ? "true" : "false"}
            >
              <span>{it.label}</span>
              {it.count && (
                <span style={{ color: "#52525B", fontSize: "10px" }}>
                  {it.count}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <div className="crm-app-mock-main">
        <div className="crm-app-mock-stats">
          {[
            { label: "Aktywne sprawy", value: "127", trend: "+8" },
            { label: "Klienci", value: "47", trend: "+3" },
            { label: "Dokumenty", value: "1,247", trend: "+82" },
          ].map((s) => (
            <div key={s.label} className="crm-app-mock-stat">
              <div style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.1em" }}>
                {s.label.toUpperCase()}
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginTop: "6px",
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "#00E5A0", fontSize: "10px", fontFamily: "'Geist Mono', monospace", marginTop: "2px" }}>
                {s.trend} ten tydzień
              </div>
            </div>
          ))}
        </div>

        <div className="crm-app-mock-table">
          <div className="crm-app-mock-table-head">
            <span>ID</span>
            <span>KLIENT</span>
            <span>SPRAWA</span>
            <span>STATUS</span>
            <span>AUDIT</span>
          </div>
          {[
            ["#K-1432", "Acme Sp. z o.o.", "Umowa NDA", "active", "RLS ✓"],
            ["#K-1433", "Kowalski J.", "Spór najmu", "pending", "RLS ✓"],
            ["#K-1434", "Vernex Sp. z o.o.", "Audit IT", "active", "RLS ✓"],
            ["#K-1435", "Lewandowski K.", "Egzekucja", "active", "RLS ✓"],
            ["#K-1436", "Nowak Trading", "Postępowanie", "closed", "RLS ✓"],
          ].map((row, i) => (
            <div key={i} className="crm-app-mock-table-row">
              <span style={{ color: "#71717A" }}>{row[0]}</span>
              <span style={{ color: "#FFFFFF" }}>{row[1]}</span>
              <span style={{ color: "#D4D4D8" }}>{row[2]}</span>
              <span
                style={{
                  color:
                    row[3] === "active"
                      ? "#00E5A0"
                      : row[3] === "pending"
                      ? "#D4A574"
                      : "#A1A1AA",
                }}
              >
                {row[3]}
              </span>
              <span style={{ color: "#00E5A0" }}>{row[4]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CRMXRay() {
  return (
    <div className="proof-xray-schema">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>schema · public.* · Supabase Postgres</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>
          v12 migration
        </span>
      </div>

      <svg
        viewBox="0 0 700 360"
        preserveAspectRatio="xMidYMid meet"
        className="proof-xray-schema-svg"
      >
        {/* Connecting lines */}
        <line
          x1="180"
          y1="100"
          x2="280"
          y2="180"
          stroke="#00E5A0"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="proof-schema-line"
        />
        <line
          x1="420"
          y1="180"
          x2="520"
          y2="100"
          stroke="#00E5A0"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="proof-schema-line"
          style={{ animationDelay: "200ms" }}
        />
        <line
          x1="350"
          y1="240"
          x2="350"
          y2="290"
          stroke="#00E5A0"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="proof-schema-line"
          style={{ animationDelay: "400ms" }}
        />

        {/* FK labels */}
        <text x="220" y="135" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">
          1:N (klient_id)
        </text>
        <text x="460" y="135" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">
          1:N (sprawa_id)
        </text>
        <text x="358" y="270" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">
          RLS policy
        </text>

        {/* Klienci box */}
        <g transform="translate(40, 50)">
          <rect width="140" height="100" rx="10" fill="rgba(10,10,15,0.85)" stroke="#FFFFFF" strokeWidth="1" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#FFFFFF">
            klienci
          </text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text>
          <text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">nazwa</text>
          <text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">nip</text>
          <text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">audit_log</text>
          <text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">jsonb</text>
        </g>

        {/* Sprawy box (center) */}
        <g transform="translate(280, 130)">
          <rect width="140" height="110" rx="10" fill="rgba(10,10,15,0.85)" stroke="#00E5A0" strokeWidth="1.4" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#00E5A0">
            sprawy
          </text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(0,229,160,0.30)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text>
          <text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">klient_id</text>
          <text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">FK</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">status</text>
          <text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">enum</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">created_at</text>
          <text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">tstz</text>
          <text x="14" y="104" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">deadline</text>
          <text x="100" y="104" fontFamily="Geist Mono" fontSize="9" fill="#71717A">date</text>
        </g>

        {/* Dokumenty box */}
        <g transform="translate(520, 50)">
          <rect width="140" height="100" rx="10" fill="rgba(10,10,15,0.85)" stroke="#FFFFFF" strokeWidth="1" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#FFFFFF">
            dokumenty
          </text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text>
          <text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">sprawa_id</text>
          <text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">FK</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">plik_url</text>
          <text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">hash</text>
          <text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
        </g>

        {/* RLS policy badge */}
        <g transform="translate(260, 290)">
          <rect width="180" height="48" rx="8" fill="rgba(0,229,160,0.08)" stroke="#00E5A0" strokeWidth="1" />
          <text x="14" y="20" fontFamily="Geist Mono" fontSize="10" fontWeight="700" fill="#00E5A0">
            POLICY · own_firm_only
          </text>
          <text x="14" y="36" fontFamily="Geist Mono" fontSize="9" fill="rgba(255,255,255,0.65)">
            firm_id = auth.jwt() → firm_id
          </text>
        </g>
      </svg>

      <div className="proof-xray-schema-meta">
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>MIGRACJA</span>
          <span style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>
            47,238 rekordów · 12.4s
          </span>
        </div>
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>POLICIES</span>
          <span style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>
            14 active · 0 disabled
          </span>
        </div>
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>AUDIT</span>
          <span style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>
            all_writes · 100% coverage
          </span>
        </div>
      </div>
    </div>
  );
}

function SaaSPanel() {
  return (
    <ProofPanel
      caseNo="CASE_02"
      industry="LOGISTICS_SAAS"
      title="System zarządzania dla serwisów"
      badges={SAAS_BADGES}
      gain="Wydanie sprzętu w ułamku sekundy. Skalowalny SaaS logistyczny — od małych punktów GSM po duże magazyny. Natywna integracja ze skanerami QR pozwala na błyskawiczną identyfikację, zmianę statusu naprawy i wydanie sprzętu klientowi. Kod, który optymalizuje fizyczną pracę."
      xRayContent={<SaaSXRay />}
    >
      <SaaSMock />
    </ProofPanel>
  );
}

function SaaSMock() {
  const items = [
    {
      serial: "GSM-2024-001432",
      model: "iPhone 13 Pro 128GB Graphite",
      status: "ready_for_pickup",
      time: "15:42:18",
    },
    {
      serial: "GSM-2024-001431",
      model: "Samsung S23 Ultra 256GB",
      status: "in_repair",
      time: "15:40:12",
    },
    {
      serial: "GSM-2024-001430",
      model: "iPhone 14 128GB Midnight",
      status: "repair_pending",
      time: "15:38:55",
    },
    {
      serial: "GSM-2024-001428",
      model: "Xiaomi Mi 11 256GB",
      status: "released",
      time: "15:41:55",
    },
    {
      serial: "GSM-2024-001427",
      model: "Pixel 7 Pro 128GB",
      status: "in_repair",
      time: "15:35:02",
    },
  ];

  const statusColor = (s) =>
    s === "ready_for_pickup"
      ? "#00E5A0"
      : s === "released"
      ? "#71717A"
      : s === "repair_pending"
      ? "#D4A574"
      : "#5C7CFA";

  return (
    <div className="saas-mock">
      <header className="saas-mock-header">
        <div>
          <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "13px" }}>
            MAGAZYN · GSM-FIX
          </span>
          <span style={{ color: "#A1A1AA", marginLeft: "12px", fontFamily: "'Geist Mono', monospace", fontSize: "11px" }}>
            47 urządzeń aktywnych
          </span>
        </div>
        <div className="saas-mock-live">
          <span className="live-dot" aria-hidden="true" />
          <span>KIOSK_03 · ONLINE</span>
        </div>
      </header>

      <div className="saas-mock-body">
        <div className="saas-mock-inventory">
          <div className="saas-mock-inventory-head">
            <span>SERIAL</span>
            <span>MODEL</span>
            <span>STATUS</span>
            <span>TIME</span>
          </div>
          {items.map((it, i) => (
            <div key={it.serial} className="saas-mock-inventory-row">
              <span style={{ color: "#FFFFFF" }}>{it.serial}</span>
              <span style={{ color: "#A1A1AA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {it.model}
              </span>
              <span style={{ color: statusColor(it.status) }}>{it.status}</span>
              <span style={{ color: "#71717A" }}>{it.time}</span>
            </div>
          ))}
        </div>

        <div className="saas-mock-scanner">
          <div className="saas-mock-scanner-head">
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "12px" }}>
              SKANER QR
            </span>
            <span className="saas-mock-live">
              <span className="live-dot" aria-hidden="true" />
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="saas-mock-scanner-frame" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="saas-mock-qr">
              {/* QR placeholder grid */}
              {Array.from({ length: 21 }).map((_, ry) =>
                Array.from({ length: 21 }).map((__, rx) => {
                  const isCorner =
                    (rx < 7 && ry < 7) ||
                    (rx > 13 && ry < 7) ||
                    (rx < 7 && ry > 13);
                  const seed = (rx * 31 + ry * 17) % 7;
                  const filled = isCorner
                    ? (rx === 0 || rx === 6 || ry === 0 || ry === 6 ||
                       (rx >= 2 && rx <= 4 && ry >= 2 && ry <= 4))
                    : seed < 3;
                  if (!filled) return null;
                  return (
                    <rect
                      key={`${rx}-${ry}`}
                      x={rx * 4.5 + 2}
                      y={ry * 4.5 + 2}
                      width="4"
                      height="4"
                      fill="#FFFFFF"
                    />
                  );
                })
              )}
            </svg>
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--tl" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--tr" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--bl" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--br" />
            <div className="saas-mock-scanner-line" />
          </div>

          <div className="saas-mock-scanner-recent">
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", letterSpacing: "0.12em" }}>
              OSTATNIE
            </div>
            {[
              { time: "15:42:18", serial: "001432", action: "ready_for_pickup" },
              { time: "15:41:55", serial: "001428", action: "released" },
              { time: "15:40:12", serial: "001431", action: "in_repair" },
            ].map((r) => (
              <div key={r.time} className="saas-mock-scanner-recent-row">
                <span style={{ color: "#71717A" }}>{r.time}</span>
                <span style={{ color: "#FFFFFF" }}>{r.serial}</span>
                <span style={{ color: statusColor(r.action) }}>{r.action}</span>
                <span style={{ color: "#00E5A0" }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaaSXRay() {
  const lines = [
    '< INSERT inventory_items { serial: "GSM-2024-001432", model: "iPhone 13 Pro" }',
    "> UPDATE inventory_items SET status='ready_for_pickup' WHERE serial=$1",
    "> AUDIT log:write { actor: scanner_kiosk_03, qr_decoded: 47ms }",
    "> WEBHOOK notify customer (sms) → +48 600 *** 432",
    "> JOIN customers ON repair_tickets.customer_id ⇒ Nowak J.",
    "> RLS check: firm_id match auth.jwt() ✓",
    "> COMMIT transaction in 12ms",
    "> REALTIME broadcast inventory_change → 4 subscribers",
    "> SCAN_FRAME consumed @ 60fps · qr_engine=zxing-cpp v1.4.0",
    "> THROUGHPUT 247 scans/h · err_rate=0.001%",
  ];
  return (
    <div className="proof-xray-log">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>postgres://supabase · inventory_items · realtime</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>
          eu-central-1
        </span>
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          className="proof-xray-log-line"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.30)",
              marginRight: "10px",
              width: "32px",
              display: "inline-block",
              fontSize: "10px",
            }}
          >
            {String(i + 1).padStart(3, "0")}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}
