import { useEffect } from "react";

/**
 * useMagnetic — subtelnie przesuwa element w kierunku kursora gdy pointer jest blisko.
 * Pass ref + opcje. Disabled na touch + prefers-reduced-motion.
 */
export function useMagnetic(ref, { strength = 0.3, radius = 120, max = 8 } = {}) {
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    // Disable on touch + reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const el = ref.current;
    let raf = null;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = 1 - dist / radius;
        const tx = Math.max(-max, Math.min(max, dx * strength * pull));
        const ty = Math.max(-max, Math.min(max, dy * strength * pull));
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      } else if (el.style.transform) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = "";
        });
      }
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, strength, radius, max]);
}
