import { useEffect, useRef } from "react";

/**
 * CursorBlob — ambient gradient blob follower (Apple Vision Pro / Lovable signature).
 *
 * Massive soft radial gradient that drifts after the cursor with damped inertia.
 * Mix-blend `plus-lighter` on dark surfaces makes it look like real light bleeding
 * through the page. Disabled on touch + reduced-motion.
 *
 * Mount once at App root, not per-section.
 */
export default function CursorBlob() {
  const blobRef = useRef(null);
  const stateRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, visible: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const blob = blobRef.current;
    if (!blob) return;

    // Init at viewport center, hidden until first mousemove
    stateRef.current.x = window.innerWidth / 2;
    stateRef.current.y = window.innerHeight / 2;
    stateRef.current.tx = stateRef.current.x;
    stateRef.current.ty = stateRef.current.y;

    const onMove = (e) => {
      stateRef.current.tx = e.clientX;
      stateRef.current.ty = e.clientY;
      if (!stateRef.current.visible) {
        stateRef.current.visible = true;
        blob.style.opacity = "1";
      }
    };

    const onLeave = () => {
      stateRef.current.visible = false;
      blob.style.opacity = "0";
    };

    const tick = () => {
      const s = stateRef.current;
      // Damped follow — 0.08 lerp = ~125ms settle, Apple-grade weight
      s.x += (s.tx - s.x) * 0.08;
      s.y += (s.ty - s.y) * 0.08;
      blob.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="cursor-blob"
      style={{ opacity: 0 }}
    />
  );
}
