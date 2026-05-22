import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useReveal } from "../hooks/useReveal";

const ITEM_SIZE = 160;
const GAP = 24;
const COLUMNS = 10;
const CANVAS_SIZE = 3200;

const ROWS = Math.ceil(50 / COLUMNS);
const GRID_WIDTH = (COLUMNS - 1) * (ITEM_SIZE + GAP) + ITEM_SIZE + (ITEM_SIZE + GAP) / 2;
const GRID_HEIGHT = (ROWS - 1) * (ITEM_SIZE * 0.85 + GAP) + ITEM_SIZE;
const CENTER_X = CANVAS_SIZE / 2 - GRID_WIDTH / 2;
const CENTER_Y = CANVAS_SIZE / 2 - GRID_HEIGHT / 2;

// Category glyphs — inline SVG, mint accent
const Glyph = ({ type }) => {
  const c = "#00E5A0";
  if (type === "fintech") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        <rect x="10" y="28" width="6" height="18" rx="1" fill={c} opacity="0.45" />
        <rect x="22" y="18" width="6" height="28" rx="1" fill={c} opacity="0.7" />
        <rect x="34" y="22" width="6" height="24" rx="1" fill={c} opacity="0.55" />
        <rect x="46" y="12" width="6" height="34" rx="1" fill={c} />
      </svg>
    );
  }
  if (type === "ai") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M28 8 L31 22 L45 25 L31 28 L28 42 L25 28 L11 25 L25 22 Z"
          fill={c}
        />
        <circle cx="42" cy="14" r="2.5" fill={c} opacity="0.7" />
        <circle cx="14" cy="42" r="2" fill={c} opacity="0.5" />
      </svg>
    );
  }
  if (type === "crm") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        {[14, 28, 42].map((y) =>
          [14, 28, 42].map((x) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={c} opacity={(x + y) / 90} />
          ))
        )}
      </svg>
    );
  }
  if (type === "legal") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path
          d="M28 8 L44 14 L44 28 C44 38 36 46 28 48 C20 46 12 38 12 28 L12 14 Z"
          stroke="#FF5A7C"
          strokeWidth="2"
          fill="rgba(255,90,124,0.08)"
        />
        <rect x="23" y="24" width="10" height="11" rx="1" stroke="#FF5A7C" strokeWidth="1.5" fill="none" />
        <path d="M25 24 L25 20 C25 18 26 17 28 17 C30 17 31 18 31 20 L31 24" stroke="#FF5A7C" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  if (type === "ecom") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        <path d="M10 14 L14 14 L18 36 L42 36 L46 20 L18 20" stroke="#D4A574" strokeWidth="2" fill="none" />
        <circle cx="22" cy="42" r="3" fill="#D4A574" />
        <circle cx="38" cy="42" r="3" fill="#D4A574" />
      </svg>
    );
  }
  if (type === "logistics") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
        {[
          [10, 10], [16, 10], [22, 10], [10, 16], [22, 16], [10, 22], [16, 22], [22, 22],
          [34, 10], [40, 10], [46, 10], [34, 16], [46, 16], [34, 22], [40, 22], [46, 22],
          [10, 34], [16, 34], [22, 34], [10, 40], [22, 40], [10, 46], [16, 46], [22, 46],
          [34, 34], [40, 34], [34, 40], [40, 40], [46, 40], [34, 46], [40, 46], [46, 46],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3" height="3" fill={c} opacity={(i % 5) / 5 + 0.4} />
        ))}
      </svg>
    );
  }
  // webgl — orb + radial lines
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="10" fill={c} opacity="0.85" />
      <circle cx="28" cy="28" r="16" stroke={c} strokeWidth="1" opacity="0.45" fill="none" />
      <circle cx="28" cy="28" r="22" stroke={c} strokeWidth="0.5" opacity="0.25" fill="none" />
      <circle cx="14" cy="28" r="1.5" fill={c} />
      <circle cx="42" cy="28" r="1.5" fill={c} />
      <circle cx="28" cy="14" r="1.5" fill={c} />
      <circle cx="28" cy="42" r="1.5" fill={c} />
    </svg>
  );
};

// Featured tile mocks — compressed real content
const FeaturedMock = ({ kind }) => {
  if (kind === "qtrader") {
    return (
      <div className="cloud-mock cloud-mock--qtrader">
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="cloud-mock-chart">
          <path d="M0 45 L15 40 L30 42 L45 30 L60 28 L75 18 L100 12" stroke="#00E5A0" strokeWidth="1.5" fill="none" />
          <path d="M0 50 L15 47 L30 48 L45 38 L60 36 L75 28 L100 22" stroke="rgba(0,229,160,0.3)" strokeWidth="1" fill="none" />
        </svg>
        <div className="cloud-mock-pill">+12.4%</div>
      </div>
    );
  }
  if (kind === "ai") {
    return (
      <div className="cloud-mock cloud-mock--ai">
        <div className="cloud-mock-line">▸ analyze_query</div>
        <div className="cloud-mock-line cloud-mock-line--dim">▸ fetch_context</div>
        <div className="cloud-mock-line cloud-mock-line--dim">▸ generate</div>
        <div className="cloud-mock-cursor" />
      </div>
    );
  }
  if (kind === "crm") {
    return (
      <div className="cloud-mock cloud-mock--crm">
        <div className="cloud-mock-bar" style={{ width: "82%" }} />
        <div className="cloud-mock-bar" style={{ width: "64%" }} />
        <div className="cloud-mock-bar" style={{ width: "91%" }} />
        <div className="cloud-mock-bar" style={{ width: "48%" }} />
      </div>
    );
  }
  // legal
  return (
    <div className="cloud-mock cloud-mock--legal">
      <div className="cloud-mock-line cloud-mock-line--redacted" style={{ width: "78%" }} />
      <div className="cloud-mock-line cloud-mock-line--redacted" style={{ width: "62%" }} />
      <div className="cloud-mock-line cloud-mock-line--redacted" style={{ width: "84%" }} />
      <div className="cloud-mock-stamp">NDA</div>
    </div>
  );
};

const FEATURED = [
  {
    id: 0,
    type: "fintech",
    title: "QTrader",
    tag: "[ FINTECH // REAL-TIME ]",
    desc: "Real-time order book + AI signals · WebSocket → React 19. Frame budget <10ms na każdym tick.",
    mock: "qtrader",
    featured: true,
  },
  {
    id: 1,
    type: "ai",
    title: "Self-Service AI",
    tag: "[ LLM // AGENTS ]",
    desc: "Autonomous agent flow z Vercel AI SDK + Claude streaming. End-to-end pipeline w 8 sekund.",
    mock: "ai",
    featured: true,
  },
  {
    id: 2,
    type: "crm",
    title: "CRM Leasing",
    tag: "[ B2B // DASHBOARD ]",
    desc: "47 firm zarządza 124k PLN MRR via custom dashboard. Płatności + KPI + audit trail.",
    mock: "crm",
    featured: true,
  },
  {
    id: 3,
    type: "legal",
    title: "Kancelaria Prawna",
    tag: "[ LEGAL // NDA ]",
    desc: "Dane klientów objęte NDA. RLS policies + audit log + secured Postgres na każdym wierszu.",
    mock: "legal",
    featured: true,
  },
];

// Distribution dla 46 generated tiles
const DISTRIBUTION = [
  { type: "crm", count: 8, tag: "[ CRM ]" },
  { type: "fintech", count: 7, tag: "[ FINTECH ]" },
  { type: "ai", count: 8, tag: "[ AI AGENT ]" },
  { type: "legal", count: 5, tag: "[ LEGAL ]" },
  { type: "ecom", count: 7, tag: "[ E-COM ]" },
  { type: "logistics", count: 7, tag: "[ LOGISTICS ]" },
  { type: "webgl", count: 4, tag: "[ WEBGL ]" },
];

const GENERATED = (() => {
  const out = [];
  let id = 4;
  for (const { type, count, tag } of DISTRIBUTION) {
    for (let i = 0; i < count; i++) {
      const num = String(id + 1).padStart(2, "0");
      out.push({
        id: id++,
        type,
        title: `Project // ${num}`,
        tag,
        desc: "System klasy premium zbudowany w architekturze React / Supabase. Pełna wizualizacja procesów biznesowych.",
        featured: false,
      });
    }
  }
  return out;
})();

const PROJECTS = [...FEATURED, ...GENERATED];

function getPosition(index) {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  const x = CENTER_X + col * (ITEM_SIZE + GAP) + (row % 2 === 1 ? (ITEM_SIZE + GAP) / 2 : 0);
  const y = CENTER_Y + row * (ITEM_SIZE * 0.85 + GAP);
  return { x, y };
}

function Squircle({ project, index, dragX, dragY, viewportRef, onSelect }) {
  const { x: tileX, y: tileY } = getPosition(index);
  const tileCenterCanvasX = tileX + ITEM_SIZE / 2;
  const tileCenterCanvasY = tileY + ITEM_SIZE / 2;

  // Distance od viewport center w motion-value computation.
  // Canvas pozycjonowane via translate(-50%, -50%) — canvas center
  // pokrywa się z viewport center przy dragX=0, dragY=0.
  // Tile na canvas: offset (tileCenterCanvasX - CANVAS_SIZE/2,
  //                         tileCenterCanvasY - CANVAS_SIZE/2).
  // Po drag: tile viewport offset = canvas-offset + drag.
  const offsetX = tileCenterCanvasX - CANVAS_SIZE / 2;
  const offsetY = tileCenterCanvasY - CANVAS_SIZE / 2;

  const distance = useTransform([dragX, dragY], ([dx, dy]) => {
    const px = offsetX + dx;
    const py = offsetY + dy;
    return Math.sqrt(px * px + py * py);
  });

  // Apple Watch fisheye — owner spec zones:
  //   0-200px: scale 1.05, opacity 1 (focus)
  //   200-400px: scale 0.7, opacity 0.85
  //   400-600px: scale 0.45, opacity 0.55
  //   600+: scale 0.3, opacity 0.25 (krawędziowa)
  const scale = useTransform(
    distance,
    [0, 200, 400, 600, 900],
    [1.05, 1, 0.7, 0.45, 0.3]
  );
  const opacity = useTransform(
    distance,
    [0, 200, 400, 600, 900],
    [1, 1, 0.85, 0.55, 0.25]
  );

  return (
    <motion.div
      layoutId={`cloud-${project.id}`}
      onClick={() => onSelect(project.id)}
      className={`cloud-squircle ${
        project.featured
          ? "cloud-squircle--featured"
          : `cloud-squircle--${project.type}`
      }`}
      style={{ left: tileX, top: tileY, scale, opacity }}
      whileHover={{ zIndex: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="cloud-squircle-bg">
        {project.featured ? (
          <FeaturedMock kind={project.mock} />
        ) : (
          <div className="cloud-squircle-glyph">
            <Glyph type={project.type} />
          </div>
        )}
      </div>
      <div className="cloud-squircle-overlay">
        <span className="cloud-squircle-tag">{project.tag}</span>
      </div>
    </motion.div>
  );
}

export default function InfiniteCloud() {
  const constraintsRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const selected = selectedId !== null ? PROJECTS.find((p) => p.id === selectedId) : null;

  return (
    <section id="cloud" className="cloud-section" aria-labelledby="cloud-heading">
      <div ref={headerRef} className="cloud-header mx-auto max-w-6xl px-6 lg:px-10">
        <div className={`pipeline-reveal ${headerVisible ? "is-visible" : ""}`}>
          <span className="proof-eyebrow">[ ARSENAŁ // 50_WDROŻEŃ ]</span>
        </div>
        <h2
          id="cloud-heading"
          className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} cloud-section-title`}
          style={{ "--pipeline-reveal-delay": "120ms" }}
        >
          Pięćdziesiąt produkcji.{" "}
          <span className="cloud-section-title-mute">Jeden zespół.</span>
        </h2>
        <p
          className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} cloud-section-lead`}
          style={{ "--pipeline-reveal-delay": "240ms" }}
        >
          Każdy element poniżej to wdrożenie. Przeciągnij siatkę i kliknij ikonę,
          żeby zobaczyć szczegóły.
        </p>
      </div>

      <div className="cloud-viewport" ref={constraintsRef}>
        <motion.div
          className="cloud-canvas"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          whileTap={{ cursor: "grabbing" }}
          style={{ x: dragX, y: dragY }}
        >
          {PROJECTS.map((project, index) => (
            <Squircle
              key={project.id}
              project={project}
              index={index}
              dragX={dragX}
              dragY={dragY}
              viewportRef={constraintsRef}
              onSelect={setSelectedId}
            />
          ))}
        </motion.div>
        <div className="cloud-drag-hint" aria-hidden="true">
          <span className="cloud-drag-arrows">↕ ↔</span>
          <span>Przeciągnij · kliknij</span>
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
              layoutId={`cloud-${selected.id}`}
              className={`cloud-focus-card ${selected.featured ? "cloud-focus-card--featured" : `cloud-focus-card--${selected.type}`}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cloud-focus-stage">
                {selected.featured ? (
                  <FeaturedMock kind={selected.mock} />
                ) : (
                  <div className="cloud-focus-glyph">
                    <Glyph type={selected.type} />
                  </div>
                )}
              </div>
              <div className="cloud-focus-body">
                <span className="cloud-focus-tag">{selected.tag}</span>
                <h3 id="cloud-focus-title" className="cloud-focus-title">
                  {selected.title}
                </h3>
                <p className="cloud-focus-desc">{selected.desc}</p>
                <button
                  type="button"
                  className="cloud-focus-close"
                  onClick={() => setSelectedId(null)}
                  aria-label="Zamknij szczegóły projektu"
                >
                  Zamknij
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
