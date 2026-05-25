import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "../hooks/useReveal";
import { QTraderMockup } from "./cloud/mockups/QTraderMockup";
import { CRMOmegaMockup } from "./cloud/mockups/CRMOmegaMockup";
import { GSMFixMockup } from "./cloud/mockups/GSMFixMockup";

const COLS = 4;
const ROWS = 3;
const CELL_W = 260;
const CELL_H = 220;
const CELL_GAP = 24;

const HERO_INDICES = new Set([0, 1]);
const HERO_SCALE = 1.0;
const PERIMETER_SCALE = 0.85;
const FOCUS_RADIUS = 220;

const Glyph = ({ type, accent }) => {
  const c = accent || "#00E5A0";
  if (type === "fintech") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        <rect x="10" y="28" width="6" height="18" rx="1" fill={c} opacity="0.45" />
        <rect x="22" y="18" width="6" height="28" rx="1" fill={c} opacity="0.7" />
        <rect x="34" y="22" width="6" height="24" rx="1" fill={c} opacity="0.55" />
        <rect x="46" y="12" width="6" height="34" rx="1" fill={c} />
      </svg>
    );
  }
  if (type === "ai") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path d="M28 8 L31 22 L45 25 L31 28 L28 42 L25 28 L11 25 L25 22 Z" fill={c} />
        <circle cx="42" cy="14" r="2.5" fill={c} opacity="0.7" />
        <circle cx="14" cy="42" r="2" fill={c} opacity="0.5" />
      </svg>
    );
  }
  if (type === "crm") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        {[14, 28, 42].map((y) =>
          [14, 28, 42].map((x) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.8" fill={c} opacity={(x + y) / 90} />
          ))
        )}
      </svg>
    );
  }
  if (type === "legal") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M28 8 L44 14 L44 28 C44 38 36 46 28 48 C20 46 12 38 12 28 L12 14 Z"
          stroke={c}
          strokeWidth="2"
          fill={`${c}14`}
        />
        <rect x="23" y="24" width="10" height="11" rx="1" stroke={c} strokeWidth="1.5" fill="none" />
        <path
          d="M25 24 L25 20 C25 18 26 17 28 17 C30 17 31 18 31 20 L31 24"
          stroke={c}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    );
  }
  if (type === "ecom") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M10 14 L14 14 L18 36 L42 36 L46 20 L18 20"
          stroke={c}
          strokeWidth="2"
          fill="none"
        />
        <circle cx="22" cy="42" r="3" fill={c} />
        <circle cx="38" cy="42" r="3" fill={c} />
      </svg>
    );
  }
  if (type === "logistics") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        {[
          [10, 10], [16, 10], [22, 10], [10, 16], [22, 16],
          [10, 22], [16, 22], [22, 22],
          [34, 10], [40, 10], [46, 10], [34, 16], [46, 16],
          [34, 22], [40, 22], [46, 22],
          [10, 34], [16, 34], [22, 34], [10, 40], [22, 40],
          [10, 46], [16, 46], [22, 46],
          [34, 34], [40, 34], [34, 40], [40, 40], [46, 40],
          [34, 46], [40, 46], [46, 46],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3.4" height="3.4" fill={c} opacity={(i % 5) / 5 + 0.4} />
        ))}
      </svg>
    );
  }
  if (type === "cloud") {
    return (
      <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M14 36 C9 36 6 32 8 28 C5 22 11 16 18 18 C20 12 28 10 33 14 C40 12 47 18 45 26 C50 28 49 36 42 36 Z"
          stroke={c}
          strokeWidth="2"
          fill={`${c}10`}
        />
        <circle cx="20" cy="44" r="1.6" fill={c} opacity="0.6" />
        <circle cx="28" cy="46" r="1.6" fill={c} opacity="0.8" />
        <circle cx="36" cy="44" r="1.6" fill={c} opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="8" fill={c} opacity="0.9" />
      <circle cx="28" cy="28" r="14" stroke={c} strokeWidth="1" opacity="0.5" fill="none" />
      <circle cx="28" cy="28" r="20" stroke={c} strokeWidth="0.5" opacity="0.3" fill="none" />
      <circle cx="14" cy="28" r="1.6" fill={c} />
      <circle cx="42" cy="28" r="1.6" fill={c} />
      <circle cx="28" cy="14" r="1.6" fill={c} />
      <circle cx="28" cy="42" r="1.6" fill={c} />
    </svg>
  );
};

const TILES = [
  { id: "ai-terminal", glyph: "ai", accent: "#00E5A0", title: "AI Terminal", tag: "[ SELF-SERVICE // LLM ]", metric: "Prompt → live deploy", desc: "Edytuj produkt rozmawiając z panelem. Zmiana koloru, dodanie pola, nowy widok — bez agencji, bez tickets, bez czekania." },
  { id: "qtrader", glyph: "fintech", accent: "#00E5FF", title: "QTrader", tag: "[ FINTECH // WS ]", metric: "1247 ticks/s · 0.4ms", desc: "Real-time order book + AI signals na WebSocket. React 19 z frame budget <10ms na każdym ticku rynkowym.", mockup: "qtrader" },
  { id: "crm-omega", glyph: "crm", accent: "#FF8A4C", title: "CRM Omega", tag: "[ LEGAL // RLS ]", metric: "47k records · audit", desc: "Kancelaria z 47k rekordami klientów. Row-level security na każdym wierszu, audit trail PII, secured Postgres.", mockup: "crm-omega" },
  { id: "gsm-fix", glyph: "logistics", accent: "#7C5CFF", title: "GSM-FIX", tag: "[ LOGISTICS // SAAS ]", metric: "QR → SMS w 47ms", desc: "Skanowanie QR serwisu → SMS do klienta w 47ms. Postgres realtime channels, multi-tenant SaaS dla 60+ punktów.", mockup: "gsm-fix" },
  { id: "supabase", glyph: "cloud", accent: "#00E5FF", title: "Supabase Migration", tag: "[ CLOUD // INFRA ]", metric: "Zero downtime", desc: "Migracja produkcyjnej bazy bez okna serwisowego. RLS policies apply on-the-fly, edge replication." },
  { id: "lovable", glyph: "ai", accent: "#00E5A0", title: "Lovable Bootstrap", tag: "[ AI // PROTOTYPE ]", metric: "72h klikalny prototyp", desc: "Działający, klikalny prototyp w 72 godziny. Nie statyczne makiety po trzech miesiącach — żywy produkt." },
  { id: "edge", glyph: "edge", accent: "#00E5FF", title: "Edge Functions", tag: "[ VERCEL // EDGE ]", metric: "<100ms global", desc: "Vercel Edge Runtime — sub-100ms latency w 18 regionach. Bez zimnego startu, geografia bez kompromisów." },
  { id: "dashboard", glyph: "fintech", accent: "#00E5A0", title: "Real-time Dashboard", tag: "[ B2B // DASHBOARD ]", metric: "WS · 60fps · 12k pts", desc: "Live B2B dashboard z WebSocket. 12k data points w viewporcie, 60fps render lock, canvas + d3 hybrid." },
  { id: "agents", glyph: "ai", accent: "#7C5CFF", title: "AI Agent Pipeline", tag: "[ LLM // AGENTS ]", metric: "Multi-step reasoning", desc: "Autonomous agent z Vercel AI SDK + Claude streaming. Multi-step pipeline z tool use, end-to-end w 8s." },
  { id: "nda", glyph: "legal", accent: "#FF5A7C", title: "NDA Generator", tag: "[ LEGAL // NDA ]", metric: "3s · multilang", desc: "AI generator umów NDA. Multilang (PL/EN/DE), wbudowane RODO clauses, gotowe do podpisu w 3 sekundy." },
  { id: "ecom", glyph: "ecom", accent: "#D4A574", title: "E-com Storefront", tag: "[ E-COM // STRIPE ]", metric: "2.1s LCP · PWA", desc: "Next.js storefront z Stripe Checkout. PWA mobile-first, LCP 2.1s, offline cart sync, real-time stock." },
  { id: "bank", glyph: "fintech", accent: "#00E5FF", title: "Bank Aggregator", tag: "[ FINTECH // OPEN BANKING ]", metric: "18 banków · PSD2", desc: "Agregator rachunków przez PSD2. 18 banków polskich, real-time sync, transaction categorization AI." },
];

const MOCKUP_MAP = {
  "qtrader": QTraderMockup,
  "crm-omega": CRMOmegaMockup,
  "gsm-fix": GSMFixMockup,
};

// Layout: 4 cols × 3 rows. Hero tiles at center cells (r1c1, r1c2).
// Hero indices in TILES: 0 (AI Terminal) and 1 (QTrader).
// Remap so hero tiles land on center cells, perimeter tiles fill rest.
const CELL_MAP = [
  // Row 0
  { col: 0, row: 0, tileIndex: 2 },   // CRM Omega
  { col: 1, row: 0, tileIndex: 3 },   // GSM-FIX
  { col: 2, row: 0, tileIndex: 4 },   // Supabase
  { col: 3, row: 0, tileIndex: 5 },   // Lovable
  // Row 1 (center row — heroes in middle)
  { col: 0, row: 1, tileIndex: 6 },   // Edge
  { col: 1, row: 1, tileIndex: 1 },   // QTrader HERO
  { col: 2, row: 1, tileIndex: 0 },   // AI Terminal HERO
  { col: 3, row: 1, tileIndex: 7 },   // Dashboard
  // Row 2
  { col: 0, row: 2, tileIndex: 8 },   // Agents
  { col: 1, row: 2, tileIndex: 9 },   // NDA
  { col: 2, row: 2, tileIndex: 10 },  // E-com
  { col: 3, row: 2, tileIndex: 11 },  // Bank
];

function GazeTile({ tile, displayIndex, isHero, x, y, w, h, isPrimary, anyPrimary, cursor, onClick }) {
  // Compute focus factor (smooth fall-off for perimeter when not primary)
  const cx = x + w / 2;
  const cy = y + h / 2;
  let proximity = 0;
  if (cursor.active) {
    const dx = cursor.x - cx;
    const dy = cursor.y - cy;
    const dist = Math.hypot(dx, dy);
    proximity = Math.max(0, 1 - dist / FOCUS_RADIUS);
  }

  // Active Focus Priority rules
  let scale, opacity, blur, borderAlpha, zIndex;
  if (isPrimary) {
    if (isHero) {
      scale = HERO_SCALE + 0.05; // 1.05
      opacity = 1.0;
      blur = 0;
      borderAlpha = 0.20;
      zIndex = 40;
    } else {
      scale = PERIMETER_SCALE + 0.20; // 1.05
      opacity = 1.0;
      blur = 0;
      borderAlpha = 0.20;
      zIndex = 35;
    }
  } else if (anyPrimary && isHero) {
    // Another tile took priority — hero defers (oddaje pole)
    scale = HERO_SCALE - 0.03; // 0.97
    opacity = 0.65;
    blur = 0;
    borderAlpha = 0.10;
    zIndex = 20;
  } else {
    // Baseline (no cursor focus or this tile not affected)
    if (isHero) {
      scale = HERO_SCALE; // 1.0
      opacity = 1.0;
      blur = 0;
      borderAlpha = 0.14;
      zIndex = 20;
    } else {
      // Perimeter — soft proximity boost even without primary
      scale = PERIMETER_SCALE + proximity * 0.08;
      opacity = 0.4 + proximity * 0.25;
      blur = Math.max(0, 1 - proximity);
      borderAlpha = 0.06 + proximity * 0.06;
      zIndex = 10 + Math.round(proximity * 4);
    }
  }

  const numLabel = String(displayIndex + 1).padStart(2, "0");

  return (
    <button
      type="button"
      className={`gaze-tile${isHero ? " gaze-tile--hero" : ""}${isPrimary ? " is-primary" : ""}`}
      onClick={onClick}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `scale(${scale})`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        zIndex,
        borderColor: `rgba(255,255,255,${borderAlpha.toFixed(3)})`,
        ["--tile-accent"]: tile.accent,
      }}
      aria-label={`${tile.title} — ${tile.tag}`}
    >
      <span className="gaze-tile-num">{numLabel}</span>
      <div className="gaze-tile-glyph">
        <Glyph type={tile.glyph} accent={tile.accent} />
      </div>
      <div className="gaze-tile-meta">
        <span className="gaze-tile-badge">{tile.tag}</span>
        <h3 className="gaze-tile-title">{tile.title}</h3>
        <p className="gaze-tile-metric">{tile.metric}</p>
      </div>
    </button>
  );
}

function FallbackGrid({ onSelect }) {
  return (
    <div className="cloud-fallback-grid">
      {TILES.map((tile, i) => (
        <button
          key={tile.id}
          type="button"
          className="cloud-fallback-tile"
          onClick={() => onSelect(tile.id)}
          style={{ ["--tile-accent"]: tile.accent }}
        >
          <span className="gaze-tile-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="cloud-fallback-glyph">
            <Glyph type={tile.glyph} accent={tile.accent} />
          </div>
          <span className="gaze-tile-badge">{tile.tag}</span>
          <h3 className="gaze-tile-title">{tile.title}</h3>
          <p className="gaze-tile-metric">{tile.metric}</p>
        </button>
      ))}
    </div>
  );
}

export default function InfiniteCloud() {
  const stageRef = useRef(null);
  const rafRef = useRef(0);
  const [selectedId, setSelectedId] = useState(null);
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const update = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        setStage({ w: rect.width, h: rect.height });
      }
      setIsMobile(window.innerWidth < 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onMove = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setCursor({ x: px, y: py, active: true });
    });
  }, []);

  const onLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCursor((c) => ({ ...c, active: false }));
  }, []);

  const selected = selectedId !== null ? TILES.find((t) => t.id === selectedId) : null;

  // Compute grid metrics inside stage. Cells use CELL_W/CELL_H/CELL_GAP base.
  // If stage smaller, scale-fit (but assume >=1280 width for desktop branch).
  const gridW = COLS * CELL_W + (COLS - 1) * CELL_GAP;
  const gridH = ROWS * CELL_H + (ROWS - 1) * CELL_GAP;
  const offsetX = Math.max(0, (stage.w - gridW) / 2);
  const offsetY = Math.max(0, (stage.h - gridH) / 2);

  // Active Focus Priority — pick closest tile within FOCUS_RADIUS.
  const primaryFocusId = useMemo(() => {
    if (!cursor.active) return null;
    let minDist = FOCUS_RADIUS;
    let best = null;
    for (const cell of CELL_MAP) {
      const tcx = offsetX + cell.col * (CELL_W + CELL_GAP) + CELL_W / 2;
      const tcy = offsetY + cell.row * (CELL_H + CELL_GAP) + CELL_H / 2;
      const d = Math.hypot(cursor.x - tcx, cursor.y - tcy);
      if (d < minDist) {
        minDist = d;
        best = TILES[cell.tileIndex].id;
      }
    }
    return best;
  }, [cursor, offsetX, offsetY]);
  const anyPrimary = primaryFocusId !== null;

  return (
    <section
      id="cloud"
      className="cloud-section h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden"
      aria-labelledby="cloud-heading"
    >
      {/* Volumetric smoke: heavy backdrop blur layer over particles */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-black/40 pointer-events-none z-0" aria-hidden />

      <div className="cloud-pulpit-wrap w-full max-w-[1400px] h-full flex flex-col relative z-10 p-6 md:p-10">
        <div ref={headerRef} className="cloud-header shrink-0 pb-3 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
          <div>
            <div className={`pipeline-reveal ${headerVisible ? "is-visible" : ""}`}>
              <span className="proof-eyebrow">[ ARSENAŁ // WDROŻENIA ]</span>
            </div>
            <h2
              id="cloud-heading"
              className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} m-0 mt-1 text-white`}
              style={{
                fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                "--pipeline-reveal-delay": "120ms",
              }}
            >
              Dwanaście systemów.{" "}
              <span style={{ color: "#A1A1AA" }}>Jeden warsztat.</span>
            </h2>
          </div>
          <p
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} m-0 max-w-[420px] shrink-0`}
            style={{
              fontSize: "13px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.55)",
              "--pipeline-reveal-delay": "240ms",
            }}
          >
            Środek to soczewka. QTrader i AI Terminal trzymają centrum.
            Reszta wraca do ostrości pod kursorem.
          </p>
        </div>

        <div
          className="cloud-stage flex-1 min-h-0 relative"
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {isMobile ? (
            <FallbackGrid onSelect={setSelectedId} />
          ) : (
            <div className="cloud-canvas">
              {CELL_MAP.map((cell) => {
                const tile = TILES[cell.tileIndex];
                const x = offsetX + cell.col * (CELL_W + CELL_GAP);
                const y = offsetY + cell.row * (CELL_H + CELL_GAP);
                return (
                  <GazeTile
                    key={tile.id}
                    tile={tile}
                    displayIndex={cell.tileIndex}
                    isHero={HERO_INDICES.has(cell.tileIndex)}
                    x={x}
                    y={y}
                    w={CELL_W}
                    h={CELL_H}
                    isPrimary={tile.id === primaryFocusId}
                    anyPrimary={anyPrimary}
                    cursor={cursor}
                    onClick={() => setSelectedId(tile.id)}
                  />
                );
              })}
            </div>
          )}
          <div className="cloud-vignette" aria-hidden="true" />
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="cloud-focus-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cloud-focus-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className={`cloud-focus-card ${selected.mockup ? "cloud-focus-card--mockup" : ""}`}
              style={{ ["--tile-accent"]: selected.accent }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="cloud-focus-close-x"
                onClick={() => setSelectedId(null)}
                aria-label="Zamknij szczegóły projektu"
              >
                ×
              </button>
              {selected.mockup && MOCKUP_MAP[selected.mockup] ? (
                (() => {
                  const Mockup = MOCKUP_MAP[selected.mockup];
                  return <Mockup />;
                })()
              ) : (
                <>
                  <div className="cloud-focus-stage">
                    <Glyph type={selected.glyph} accent={selected.accent} />
                  </div>
                  <div className="cloud-focus-body">
                    <span className="cloud-focus-tag">{selected.tag}</span>
                    <h3 id="cloud-focus-title" className="cloud-focus-title">
                      {selected.title}
                    </h3>
                    <p className="cloud-focus-metric">{selected.metric}</p>
                    <p className="cloud-focus-desc">{selected.desc}</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
