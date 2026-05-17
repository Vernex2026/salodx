import { useEffect } from "react";

/**
 * useTilt3D — subtle 3D parallax tilt driven by cursor position.
 *
 * Attaches mousemove on `triggerRef` (defaults to ref.current's offsetParent
 * section) and applies `rotateX/rotateY` transform on `ref`. Uses RAF + lerp
 * for smooth follow.
 *
 * Disabled on touch devices and prefers-reduced-motion. No-op when ref is null.
 *
 * @param {React.RefObject<HTMLElement>} ref — element that receives the transform
 * @param {Object} opts
 * @param {React.RefObject<HTMLElement>} [opts.triggerRef] — element whose mousemove drives the tilt
 * @param {number} [opts.maxDeg=6] — max rotation amplitude in degrees
 * @param {number} [opts.perspective=1200] — perspective px (set on parent if you want strong 3D)
 * @param {number} [opts.lerp=0.08] — easing factor (0..1)
 */
export function useTilt3D(ref, opts = {}) {
  const { triggerRef, maxDeg = 6, lerp = 0.08 } = opts;

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const el = ref.current;
    const trigger = triggerRef?.current || el.parentElement;
    if (!trigger) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = null;
    let active = false;

    const onMove = (e) => {
      const rect = trigger.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalize to -1..1
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      // Y rotation follows horizontal mouse, X rotation follows vertical (inverted)
      targetY = Math.max(-1, Math.min(1, nx)) * maxDeg;
      targetX = Math.max(-1, Math.min(1, ny)) * -maxDeg * 0.75;
      if (!active) {
        active = true;
        tick();
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      curX += (targetX - curX) * lerp;
      curY += (targetY - curY) * lerp;
      el.style.transform = `translateZ(0) rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg)`;
      // Stop loop when we've settled close to zero (and target is zero)
      if (
        Math.abs(curX - targetX) < 0.01 &&
        Math.abs(curY - targetY) < 0.01 &&
        targetX === 0 &&
        targetY === 0
      ) {
        el.style.transform = "";
        active = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    trigger.addEventListener("mousemove", onMove);
    trigger.addEventListener("mouseleave", onLeave);

    return () => {
      trigger.removeEventListener("mousemove", onMove);
      trigger.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, [ref, triggerRef, maxDeg, lerp]);
}
