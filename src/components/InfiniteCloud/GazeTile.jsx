import { memo, useCallback } from "react";
import Glyph from "./Glyph";
import { computeProximity, computeTileTransform } from "./geometry";

function GazeTile({ tile, displayIndex, isHero, x, y, w, h, isPrimary, anyPrimary, cursor, onSelect }) {
  const handleClick = useCallback(() => onSelect(tile.id), [onSelect, tile.id]);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const proximity = computeProximity(cursor, cx, cy);
  const { scale, opacity, blur, borderAlpha, zIndex } = computeTileTransform({
    isHero,
    isPrimary,
    anyPrimary,
    proximity,
  });

  // Hex+alpha (8-digit) — "59" = 0x59 ≈ 35% alpha, "33" ≈ 20% alpha.
  const accentGlow = `drop-shadow(0 0 18px ${tile.accent}59) drop-shadow(0 0 32px ${tile.accent}33)`;
  const filter = blur > 0 ? `blur(${blur}px)` : isPrimary ? accentGlow : "none";
  const numLabel = String(displayIndex + 1).padStart(2, "0");

  return (
    <button
      type="button"
      className={`gaze-tile${isHero ? " gaze-tile--hero" : ""}${isPrimary ? " is-primary" : ""}`}
      onClick={handleClick}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `scale(${scale})`,
        opacity,
        filter,
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

// Memo equality: re-render only when geometry inputs actually change.
// Cursor x/y rounded to integer px — sub-pixel jitter never changes the visual.
function areEqual(prev, next) {
  return (
    prev.tile === next.tile &&
    prev.displayIndex === next.displayIndex &&
    prev.isHero === next.isHero &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.w === next.w &&
    prev.h === next.h &&
    prev.isPrimary === next.isPrimary &&
    prev.anyPrimary === next.anyPrimary &&
    prev.cursor.active === next.cursor.active &&
    Math.round(prev.cursor.x) === Math.round(next.cursor.x) &&
    Math.round(prev.cursor.y) === Math.round(next.cursor.y) &&
    prev.onSelect === next.onSelect
  );
}

export default memo(GazeTile, areEqual);
