/**
 * HeroOrbFallback — static CSS/SVG glass-orb composition used when R3F is
 * unavailable (mobile, prefers-reduced-motion, or kill-switch). Designed to
 * read as "premium product photography" of a glass sphere with bank-logo
 * orbiting ring — NOT as a degraded experience.
 */

const BANK_LETTERS = [
  "m", "S", "I", "P", "P", "A",       // ring 1 (outer)
  "M", "B", "C", "N", "T", "V",       // ring 2 (mid)
  "R", "N", "W",                       // ring 3 (inner — just 3 visible)
];

export default function HeroOrbFallback() {
  return (
    <div className="orb-fallback" role="img" aria-label="Saldox — szklana kula z logotypami banków">
      <div className="orb-fallback__sphere" />

      {/* Outer ring — 8 monograms at radius ~46% */}
      <div className="orb-fallback__ring">
        {BANK_LETTERS.slice(0, 8).map((letter, i) => (
          <span
            key={`o-${i}`}
            className="orb-fallback__ring-item"
            style={{ "--a": (i / 8) * 360, "--r": "44%" }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Inner ring — 6 monograms at radius ~28%, counter-rotating */}
      <div className="orb-fallback__ring orb-fallback__ring--reverse">
        {BANK_LETTERS.slice(8, 14).map((letter, i) => (
          <span
            key={`i-${i}`}
            className="orb-fallback__ring-item"
            style={{
              "--a": (i / 6) * 360,
              "--r": "28%",
              width: "30px",
              height: "30px",
              margin: "-15px",
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Specular highlight overlay — gives the sphere a "blown glass" sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "20%",
          top: "12%",
          width: "30%",
          height: "16%",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, transparent 70%)",
          filter: "blur(8px)",
          transform: "rotate(-20deg)",
        }}
      />
    </div>
  );
}
