import { useEffect, useRef } from "react";

/**
 * useOrbParallax — single source of truth for the hero parallax-opposition
 * effect. One pointermove listener on the section element. Lerps the
 * normalized cursor position to a mutable ref (consumed by the R3F scene's
 * useFrame) and writes a capped, inverted-sign CSS variable on the section
 * (consumed by the offset card's transform).
 *
 *   mouse →  parallaxRef.current.x in [-1, 1]   (orb yaw, same direction)
 *   mouse → --orb-px / --orb-py     in px capped at ±MAX_PX, INVERTED sign
 *
 * Disabled on touch + prefers-reduced-motion (refs stay at 0).
 */
export function useOrbParallax(sectionRef, { maxPx = 12, lerp = 0.10 } = {}) {
  const parallaxRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = 0, targetY = 0;
    let curX = 0,    curY = 0;
    let rafId = null;
    let listening = false;

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
      if (!rafId) tick();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) tick();
    };

    const tick = () => {
      curX += (targetX - curX) * lerp;
      curY += (targetY - curY) * lerp;

      parallaxRef.current.x = curX;
      parallaxRef.current.y = curY;

      // Inverted sign — card translates OPPOSITE to mouse direction.
      section.style.setProperty("--orb-px", `${(-curX * maxPx).toFixed(2)}px`);
      section.style.setProperty("--orb-py", `${(-curY * maxPx * 0.5).toFixed(2)}px`);

      const settled =
        Math.abs(targetX - curX) < 0.001 &&
        Math.abs(targetY - curY) < 0.001;

      if (settled && targetX === 0 && targetY === 0) {
        parallaxRef.current.x = 0;
        parallaxRef.current.y = 0;
        section.style.setProperty("--orb-px", "0px");
        section.style.setProperty("--orb-py", "0px");
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    listening = true;

    return () => {
      if (listening) {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      }
      if (rafId) cancelAnimationFrame(rafId);
      section.style.setProperty("--orb-px", "0px");
      section.style.setProperty("--orb-py", "0px");
    };
  }, [sectionRef, maxPx, lerp]);

  return parallaxRef;
}
