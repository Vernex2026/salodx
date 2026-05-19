import LiquidGlass from "liquid-glass-react";

/**
 * SaldoxGlassCard — Apple iOS 26 / Vision Pro liquid-glass surface.
 *
 * Architecture: LiquidGlass renders an SVG feDisplacementMap that
 * refracts whatever's BEHIND it. The library was authored for floating
 * UI (buttons / single panels) with explicit dimensions, so dropping
 * its render output directly into a content-driven grid card pushes
 * the wrapper to ~3× the intended height (its internal helper divs
 * stack in normal flow).
 *
 * Instead we use it as a REFRACTION OVERLAY layer:
 *   • Real content sits in a normal block container that drives the
 *     card's natural size.
 *   • LiquidGlass sits absolutely positioned underneath the content
 *     (z-10) with an empty filler child. It refracts the atmospheric
 *     halos behind the section into the card.
 *   • Decorative accent bar + top shine line sit at the very top
 *     (z-20) so they read crisply over both.
 *
 * Result: text stays sharp + readable; background light is bent by
 * SVG displacement + chromatic aberration on the edges, exactly like
 * Vision Pro.
 */

const cn = (...args) => args.filter(Boolean).join(" ");

const PRESETS = {
  offer: {
    displacementScale: 24,
    aberrationIntensity: 0.4,
    blurAmount: 0.08,
    saturation: 130,
    elasticity: 0.18,
    cornerRadius: 24,
    borderOpacity: 0.18,
    mode: "standard",
    overLight: false,
  },
  hero: {
    displacementScale: 38,
    aberrationIntensity: 0.6,
    blurAmount: 0.12,
    saturation: 150,
    elasticity: 0.28,
    cornerRadius: 28,
    borderOpacity: 0.22,
    mode: "prominent",
    overLight: false,
  },
  menu: {
    displacementScale: 14,
    aberrationIntensity: 0.25,
    blurAmount: 0.18,
    saturation: 120,
    elasticity: 0.0,
    cornerRadius: 0,
    borderOpacity: 0.0,
    mode: "standard",
    overLight: false,
  },
  testimonial: {
    displacementScale: 20,
    aberrationIntensity: 0.35,
    blurAmount: 0.08,
    saturation: 125,
    elasticity: 0.12,
    cornerRadius: 20,
    borderOpacity: 0.16,
    mode: "standard",
    overLight: false,
  },
  ctaShell: {
    displacementScale: 30,
    aberrationIntensity: 0.5,
    blurAmount: 0.06,
    saturation: 140,
    elasticity: 0.32,
    cornerRadius: 9999,
    borderOpacity: 0.20,
    mode: "prominent",
    overLight: false,
  },
};

export default function SaldoxGlassCard({
  variant,
  children,
  className,
  bankAccentColor,
  topBadge = false,
  padding = "28px",
}) {
  const preset = PRESETS[variant];

  return (
    <div
      className={cn(
        "saldox-liquid-wrap relative isolate",
        topBadge && "shadow-[0_0_64px_rgba(212,165,116,0.18)]",
        className
      )}
      style={{
        borderRadius: preset.cornerRadius,
        border:
          preset.borderOpacity > 0
            ? `1px solid rgba(255, 255, 255, ${preset.borderOpacity})`
            : "none",
        boxShadow:
          variant === "hero"
            ? "inset 0 0.5px 0 rgba(255,255,255,0.14), 0 12px 48px rgba(0,0,0,0.6), -8px 0 80px rgba(123,92,255,0.16)"
            : "inset 0 0.5px 0 rgba(255,255,255,0.14), 0 12px 48px rgba(0,0,0,0.40), 0 32px 96px rgba(0,0,0,0.32)",
      }}
    >
      {/* Liquid-glass refraction layer — sits behind the content,
          refracts the section background through chromatic aberration
          + displacement. Empty filler child keeps the library happy. */}
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ borderRadius: preset.cornerRadius }}
        aria-hidden="true"
      >
        <LiquidGlass
          displacementScale={preset.displacementScale}
          aberrationIntensity={preset.aberrationIntensity}
          blurAmount={preset.blurAmount}
          saturation={preset.saturation}
          elasticity={preset.elasticity}
          cornerRadius={preset.cornerRadius}
          overLight={preset.overLight}
          mode={preset.mode}
          padding="0"
        >
          <div style={{ width: "100%", height: "100%" }} />
        </LiquidGlass>
      </div>

      {/* Bank accent bar — top edge gradient line, above refraction */}
      {bankAccentColor && (
        <div
          className="absolute top-0 left-[12%] right-[12%] h-px z-30 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${bankAccentColor}, transparent)`,
            opacity: 0.7,
          }}
        />
      )}

      {/* Top inner shine line — premium signature detail */}
      <div
        className="absolute top-px left-[12%] right-[12%] h-px z-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
        }}
      />

      {/* Real content layer — drives natural card height, sits above
          the refraction so text stays crisp + readable */}
      <div className="relative z-20" style={{ padding }}>
        {children}
      </div>
    </div>
  );
}
