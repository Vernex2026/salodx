import { useMemo } from "react";

/* HeroStarfield — 150 procedural stars rendered as a single 1×1px
   pseudo via massive box-shadow declaration. Zero DOM nodes per
   star, GPU-cheap. Cyan-tinted minority (~15%) for color variation.
   Twinkles via opacity animation (see @keyframes starsTwinkle). */

export default function HeroStarfield({ count = 150, className = "" }) {
  const stars = useMemo(() => {
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() > 0.92 ? 2 : 1;
      const opacity = 0.3 + Math.random() * 0.6;
      const isCyan = Math.random() > 0.85;
      const color = isCyan
        ? `rgba(0, 229, 255, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`;
      points.push(`${x}vw ${y}vh 0 ${size}px ${color}`);
    }
    return points.join(", ");
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="hero-starfield absolute left-0 top-0 h-px w-px"
        style={{ boxShadow: stars }}
      />
    </div>
  );
}
