// Cupertino Gaze Control — geometric constants for the InfiniteCloud grid.
// Owner-tuned through v23-v26 iterations; behavior is "1:1" with prior commits.

export const TILE_GEOMETRY = {
  COLS: 4,
  ROWS: 3,
  CELL_W: 260,
  CELL_H: 220,
  CELL_GAP: 24,

  FOCUS_RADIUS: 220,

  HERO_SCALE: 1.0,
  PERIMETER_SCALE: 0.85,

  // Active Focus Priority — primary tile bloom
  PRIMARY_HERO_SCALE_BOOST: 0.10,        // hero focused → 1.10
  PRIMARY_PERIMETER_SCALE_BOOST: 0.25,   // perimeter focused → 1.10
  PRIMARY_OPACITY: 1.0,
  PRIMARY_BORDER_ALPHA: 0.22,
  PRIMARY_HERO_Z: 40,
  PRIMARY_PERIMETER_Z: 35,

  // Deferred hero — another tile took priority
  DEFERRED_HERO_SCALE_DROP: 0.06,        // 1.0 - 0.06 = 0.94
  DEFERRED_OPACITY: 0.55,
  DEFERRED_BORDER_ALPHA: 0.08,
  DEFERRED_Z: 20,

  // Baseline hero (no cursor focus)
  BASELINE_HERO_OPACITY: 1.0,
  BASELINE_HERO_BORDER_ALPHA: 0.14,
  BASELINE_HERO_Z: 20,

  // Baseline perimeter with soft proximity boost
  BASELINE_PERIMETER_OPACITY: 0.4,
  BASELINE_PERIMETER_BORDER_ALPHA: 0.06,
  PROXIMITY_SCALE_GAIN: 0.08,
  PROXIMITY_OPACITY_GAIN: 0.25,
  PROXIMITY_BORDER_GAIN: 0.06,
  BASELINE_PERIMETER_Z: 10,
  PROXIMITY_Z_GAIN: 4,
};

export function computeProximity(cursor, cx, cy) {
  if (!cursor.active) return 0;
  const dist = Math.hypot(cursor.x - cx, cursor.y - cy);
  return Math.max(0, 1 - dist / TILE_GEOMETRY.FOCUS_RADIUS);
}

export function computeTileTransform({ isHero, isPrimary, anyPrimary, proximity }) {
  const G = TILE_GEOMETRY;

  if (isPrimary) {
    const baseScale = isHero ? G.HERO_SCALE : G.PERIMETER_SCALE;
    const boost = isHero ? G.PRIMARY_HERO_SCALE_BOOST : G.PRIMARY_PERIMETER_SCALE_BOOST;
    return {
      scale: baseScale + boost,
      opacity: G.PRIMARY_OPACITY,
      blur: 0,
      borderAlpha: G.PRIMARY_BORDER_ALPHA,
      zIndex: isHero ? G.PRIMARY_HERO_Z : G.PRIMARY_PERIMETER_Z,
    };
  }

  if (anyPrimary && isHero) {
    return {
      scale: G.HERO_SCALE - G.DEFERRED_HERO_SCALE_DROP,
      opacity: G.DEFERRED_OPACITY,
      blur: 0,
      borderAlpha: G.DEFERRED_BORDER_ALPHA,
      zIndex: G.DEFERRED_Z,
    };
  }

  if (isHero) {
    return {
      scale: G.HERO_SCALE,
      opacity: G.BASELINE_HERO_OPACITY,
      blur: 0,
      borderAlpha: G.BASELINE_HERO_BORDER_ALPHA,
      zIndex: G.BASELINE_HERO_Z,
    };
  }

  // Perimeter baseline with proximity falloff
  return {
    scale: G.PERIMETER_SCALE + proximity * G.PROXIMITY_SCALE_GAIN,
    opacity: G.BASELINE_PERIMETER_OPACITY + proximity * G.PROXIMITY_OPACITY_GAIN,
    blur: Math.max(0, 1 - proximity),
    borderAlpha: G.BASELINE_PERIMETER_BORDER_ALPHA + proximity * G.PROXIMITY_BORDER_GAIN,
    zIndex: G.BASELINE_PERIMETER_Z + Math.round(proximity * G.PROXIMITY_Z_GAIN),
  };
}
