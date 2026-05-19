import { useEffect } from "react";

/**
 * useMagnetic — Apple-tier elastic magnetic pull.
 *
 * Continuous lerp + RAF (not raw transform), so element settles with spring
 * physics and never jumps. Plus subtle scale-up while in radius (1.0 → 1.04)
 * for tactile "ready to be clicked" feedback. Auto-decays on leave with
 * overshoot, simulating elastic snap-back.
 *
 * Disabled on touch + prefers-reduced-motion.
 */
export function useMagnetic(ref, { strength = 0.3, radius = 120, max = 8, scaleBoost = 0.04 } = {}) {
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const el = ref.current;
    let raf = null;
    let active = false;

    // Targets (where we want to be) and current (interpolated position)
    const t = { x: 0, y: 0, s: 1 };   // target
    const c = { x: 0, y: 0, s: 1 };   // current

    // Lerp factor: 0.18 = ~85ms settle on 60fps — Apple iOS spring weight
    const LERP = 0.18;

    const tick = () => {
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;
      c.s += (t.s - c.s) * LERP;
      el.style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0) scale(${c.s.toFixed(4)})`;

      // Settled close to target AND target is zero → stop loop
      const close =
        Math.abs(c.x - t.x) < 0.05 &&
        Math.abs(c.y - t.y) < 0.05 &&
        Math.abs(c.s - t.s) < 0.0005;
      if (close && t.x === 0 && t.y === 0 && t.s === 1) {
        el.style.transform = "";
        active = false;
        raf = null;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const ensureRaf = () => {
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = 1 - dist / radius;
        t.x = Math.max(-max, Math.min(max, dx * strength * pull));
        t.y = Math.max(-max, Math.min(max, dy * strength * pull));
        t.s = 1 + scaleBoost * pull;
      } else {
        t.x = 0;
        t.y = 0;
        t.s = 1;
      }
      ensureRaf();
    };

    const onLeave = () => {
      t.x = 0;
      t.y = 0;
      t.s = 1;
      ensureRaf();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [ref, strength, radius, max, scaleBoost]);
}
