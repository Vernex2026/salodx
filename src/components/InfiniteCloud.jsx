import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const COLS = 4;
const ROWS = 3;
const CELL_W = 260;
const CELL_H = 220;
const CELL_GAP = 24;

const HERO_INDICES = new Set([0, 3]);
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
  {
    id: "claude",
    glyph: "ai",
    accent: "#D97757",
    title: "Anthropic Claude API",
    tag: "[ MULTI-AGENT // ORCHESTRATION ]",
    metric: "550k wyroków · tool use + RAG",
    desc: "Autonomiczne agenty z tool use, pamięcią kontekstu i RAG pipeline. Agent prawny analizuje sprawy, przeszukuje 550k wyroków sądowych, generuje pisma i uczy się z każdej sprawy. Nie chatbot — działający system decyzyjny.",
  },
  {
    id: "elevenlabs",
    glyph: "radial",
    accent: "#E2255D",
    title: "ElevenLabs",
    tag: "[ SYNTHETIC // VOICE ]",
    metric: "DE/FR/IT · Reels z lektorem",
    desc: "Agent Content Creator generuje opisy w DE/FR/IT i produkuje Reels z lektorem syntetycznym. Jeden trigger — pełne ogłoszenie na wszystkich portalach z narracją głosową. Zero człowieka w pętli.",
  },
  {
    id: "supabase",
    glyph: "cloud",
    accent: "#3ECF8E",
    title: "Supabase",
    tag: "[ PGVECTOR // REALTIME // RLS ]",
    metric: "10k ofert · 4k pts @ 60fps",
    desc: "Semantic search po 10 000 ofertach pojazdów z embeddings. Row Level Security na poziomie każdego rekordu. Realtime subscriptions dla dashboardów live — 4k punktów danych, 60fps, zero pollingu.",
  },
  {
    id: "mt5",
    glyph: "fintech",
    accent: "#2196F3",
    title: "MetaTrader 5",
    tag: "[ LIVE // TRADING FEED ]",
    metric: "1247 ticks/s · 0.4ms",
    desc: "Tick-by-tick streaming cen przez WebSocket, 1247 ticks/s przy latency 0.4ms. Integracja sygnałów algo do panelu tradera z backtesting engine i P&L tracking w czasie rzeczywistym.",
  },
  {
    id: "base",
    glyph: "edge",
    accent: "#0052FF",
    title: "Base / Ethereum",
    tag: "[ ON-CHAIN // DATA LAYER ]",
    metric: "ETH · BSC · Base · L2",
    desc: "Odczyt danych kontraktów smart przez ethers.js, cross-chain monitoring (ETH, BSC, Base). Agent inwestycyjny analizuje on-chain przepływy i generuje scenariusze tradingowe.",
  },
  {
    id: "stripe",
    glyph: "ecom",
    accent: "#635BFF",
    title: "Stripe Connect",
    tag: "[ MARKETPLACE // SPLIT ]",
    metric: "7-day trial → subscription",
    desc: "Pełny model marketplace: split payments do vendorów, automatyczne wypłaty, prowizje per transakcja, 7-day trial z automatycznym przejściem na subskrypcję. Webhook handler dla każdego zdarzenia.",
  },
  {
    id: "whatsapp",
    glyph: "crm",
    accent: "#25D366",
    title: "WhatsApp Business API",
    tag: "[ LEAD // PIPELINE ]",
    metric: "15% poniżej rynku → 60s",
    desc: "Agent komisu DACH: wykrywa ofertę 15% poniżej rynku → wysyła WhatsApp z gotowym draftem wiadomości do sprzedawcy w 60 sekund od pojawienia się ogłoszenia. Zero ręcznej interwencji.",
  },
  {
    id: "ksef",
    glyph: "legal",
    accent: "#DC2626",
    title: "KSeF API",
    tag: "[ MF // E-FAKTURA ]",
    metric: "FA(2) · UPO · session token",
    desc: "Automatyczne wystawianie faktur ustrukturyzowanych zgodnych ze schematem FA(2) bezpośrednio do Krajowego Systemu e-Faktur. Session token management, parsowanie UPO, archiwizacja w Supabase. System generuje i wysyła fakturę w sekundy od zamknięcia transakcji — zero ręcznego księgowania.",
  },
  {
    id: "resend",
    glyph: "edge",
    accent: "#FFFFFF",
    title: "Resend",
    tag: "[ TRANSACTIONAL // EMAIL ]",
    metric: "Event-driven · webhook tracking",
    desc: "Sekwencje email wyzwalane zdarzeniami (nowy lead, zmiana statusu, wygasający kontrakt). Automatyczne przypomnienia 24h przed wizytą serwisową i 12 miesięcy po instalacji urządzenia. HTML templates, webhook tracking.",
  },
  {
    id: "baselinker",
    glyph: "logistics",
    accent: "#FF6500",
    title: "Baselinker API",
    tag: "[ MULTI-MARKETPLACE // ORCH ]",
    metric: "Allegro · Amazon DE · eBay",
    desc: "Agent monitoruje jakość ofert na Allegro, Amazon DE, eBay jednocześnie. Silnik cenowy z regułami marż, auto-przeliczanie PLN/EUR/GBP, change detection z human-in-the-loop zatwierdzaniem zmian.",
  },
  {
    id: "voice",
    glyph: "radial",
    accent: "#10A37F",
    title: "Web Speech + Whisper",
    tag: "[ VOICE // LAYER ]",
    metric: "iOS fallback · live STT",
    desc: "Obsługa głosowa w widgecie czatu z fallbackiem do Whisper dla iOS/Safari. Klient mówi zapytanie o pojazd — agent transkrybuje, analizuje, zwraca dopasowane oferty z linkami URL. Przetestowane na fizycznym iPhone.",
  },
  {
    id: "playwright",
    glyph: "ai",
    accent: "#45BA4B",
    title: "Playwright + Claude Vision",
    tag: "[ AUTONOMOUS // WEB AGENT ]",
    metric: "mobile.de · AutoScout · 60s alert",
    desc: "Headless scraping mobile.de, AutoScout24, tutti.ch, Ricardo.ch z wykrywaniem zmian cen i parametrów. Claude Vision analizuje zdjęcia pojazdów i historię serwisową. Alert do właściciela komisu w 60 sekund od znalezienia okazji.",
  },
];

// Layout: 4 cols × 3 rows. Hero tiles at center cells (r1c1, r1c2).
// Hero indices in TILES: 0 (Anthropic Claude) and 3 (MetaTrader 5).
const CELL_MAP = [
  // Row 0
  { col: 0, row: 0, tileIndex: 1 },   // ElevenLabs
  { col: 1, row: 0, tileIndex: 2 },   // Supabase
  { col: 2, row: 0, tileIndex: 4 },   // Base / Ethereum
  { col: 3, row: 0, tileIndex: 5 },   // Stripe Connect
  // Row 1 (center row — heroes in middle)
  { col: 0, row: 1, tileIndex: 6 },   // WhatsApp Business API
  { col: 1, row: 1, tileIndex: 3 },   // MetaTrader 5 HERO
  { col: 2, row: 1, tileIndex: 0 },   // Anthropic Claude HERO
  { col: 3, row: 1, tileIndex: 7 },   // KSeF API
  // Row 2
  { col: 0, row: 2, tileIndex: 8 },   // Resend
  { col: 1, row: 2, tileIndex: 9 },   // Baselinker
  { col: 2, row: 2, tileIndex: 10 },  // Web Speech + Whisper
  { col: 3, row: 2, tileIndex: 11 },  // Playwright + Claude Vision
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
      scale = HERO_SCALE + 0.10; // 1.10 — full bloom
      opacity = 1.0;
      blur = 0;
      borderAlpha = 0.22;
      zIndex = 40;
    } else {
      scale = PERIMETER_SCALE + 0.25; // 1.10 — perimeter bloom
      opacity = 1.0;
      blur = 0;
      borderAlpha = 0.22;
      zIndex = 35;
    }
  } else if (anyPrimary && isHero) {
    // Another tile took priority — hero defers (oddaje pole)
    scale = HERO_SCALE - 0.06; // 0.94 — clear defer
    opacity = 0.55;
    blur = 0;
    borderAlpha = 0.08;
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
  // Accent drop-shadow glow on primary focus — color from tile brand.
  // Hex+alpha (8-digit) format: #RRGGBBAA, "59" = 0x59 = 35% alpha.
  const accentGlow = `drop-shadow(0 0 18px ${tile.accent}59) drop-shadow(0 0 32px ${tile.accent}33)`;
  const filterStr = blur > 0
    ? `blur(${blur}px)`
    : isPrimary
      ? accentGlow
      : "none";

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
        filter: filterStr,
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
      className="cloud-section h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden snap-start"
      aria-labelledby="cloud-heading"
    >
      {/* Volumetric smoke: softer glass — particles bleed through edges */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/40 pointer-events-none z-0" aria-hidden />

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
              color: "#D4D4D8",
              "--pipeline-reveal-delay": "240ms",
            }}
          >
            Środek to soczewka. Claude API i MetaTrader 5 trzymają
            centrum. Reszta wraca do ostrości pod kursorem.
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
              className="cloud-focus-card"
              style={{ ["--tile-accent"]: selected.accent }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="cloud-focus-close-x"
                onClick={() => setSelectedId(null)}
                aria-label="Zamknij szczegóły integracji"
              >
                ×
              </button>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
