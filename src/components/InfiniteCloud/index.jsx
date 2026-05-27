import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import { INTEGRATIONS, CELL_MAP, HERO_INDICES } from "../../data/integrations";
import { TILE_GEOMETRY } from "./geometry";
import GazeTile from "./GazeTile";
import FallbackGrid from "./FallbackGrid";
import FocusModal from "./FocusModal";

const MOBILE_BREAKPOINT_PX = 1024;
const { COLS, ROWS, CELL_W, CELL_H, CELL_GAP, FOCUS_RADIUS } = TILE_GEOMETRY;
const GRID_W = COLS * CELL_W + (COLS - 1) * CELL_GAP;
const GRID_H = ROWS * CELL_H + (ROWS - 1) * CELL_GAP;

export default function InfiniteCloud() {
  const stageRef = useRef(null);
  const rafRef = useRef(0);
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const update = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        setStage({ w: rect.width, h: rect.height });
      }
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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

  const offsetX = Math.max(0, (stage.w - GRID_W) / 2);
  const offsetY = Math.max(0, (stage.h - GRID_H) / 2);

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
        best = INTEGRATIONS[cell.tileIndex].id;
      }
    }
    return best;
  }, [cursor, offsetX, offsetY]);

  const anyPrimary = primaryFocusId !== null;
  const selected = selectedId !== null
    ? INTEGRATIONS.find((t) => t.id === selectedId) ?? null
    : null;

  const handleSelectTile = useCallback((id) => setSelectedId(id), []);
  const handleCloseModal = useCallback(() => setSelectedId(null), []);

  return (
    <section
      id="cloud"
      className="cloud-section h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden snap-start"
      aria-labelledby="cloud-heading"
    >
      {/* Volumetric smoke — particles bleed through edges */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/40 pointer-events-none z-0" aria-hidden />

      <div className="cloud-pulpit-wrap w-full max-w-[1400px] h-full flex flex-col relative z-10 px-6 pt-24 pb-6 md:px-10 md:pt-28 md:pb-10">
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
          ref={stageRef}
          className="cloud-stage flex-1 min-h-0 relative"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {isMobile ? (
            <FallbackGrid onSelect={handleSelectTile} />
          ) : (
            <div className="cloud-canvas">
              {CELL_MAP.map((cell) => {
                const tile = INTEGRATIONS[cell.tileIndex];
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
                    onSelect={handleSelectTile}
                  />
                );
              })}
            </div>
          )}
          <div className="cloud-vignette" aria-hidden="true" />
        </div>
      </div>

      <FocusModal selected={selected} onClose={handleCloseModal} />
    </section>
  );
}
