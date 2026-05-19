import { useEffect, useRef } from "react";

/**
 * HeroSpotlight — cursor-tracked sharp radial wash on hero section.
 * No blur, no chroma — only alpha modulation. Writes --mx / --my CSS
 * vars from mousemove. Disabled on touch + reduced-motion via CSS
 * media queries.
 *
 * Mount inside the hero section as a sibling to content (z-index 1
 * via .hero-spotlight rule).
 */
export default function HeroSpotlight({ sectionRef }) {
  const spotRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const section = sectionRef?.current;
    const spot = spotRef.current;
    if (!section || !spot) return;

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      spot.style.setProperty("--mx", `${mx}%`);
      spot.style.setProperty("--my", `${my}%`);
      spot.dataset.active = "true";
    };
    const onLeave = () => {
      spot.dataset.active = "false";
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [sectionRef]);

  return (
    <div
      ref={spotRef}
      className="hero-spotlight"
      data-active="false"
      aria-hidden="true"
    />
  );
}
