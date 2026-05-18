import { useEffect, useRef, useState } from "react";

/**
 * SectionRail — fixed right-side vertical scroll indicator. Five dots,
 * one per page section. Tracks the section closest to viewport vertical
 * centre via IntersectionObserver. Active dot stretches into a pill with
 * the electric gradient and reveals its label.
 *
 * Hidden on mobile (< 1024px) via CSS.
 */

const SECTIONS = [
  { id: "top",       label: "Hero" },
  { id: "promocje",  label: "Promocje" },
  { id: "how",       label: "Jak działa" },
  { id: "trust",     label: "Liczby" },
  { id: "next",      label: "Następny krok" },
];

export default function SectionRail() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const observerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Map of id → IntersectionObserverEntry-like ratio. Pick the section
    // whose midpoint is closest to viewport vertical centre.
    const visibleMap = new Map();

    const tick = () => {
      let bestId = null;
      let bestProximity = Infinity;
      for (const [id, rect] of visibleMap) {
        if (!rect) continue;
        const midY = rect.top + rect.height / 2;
        const proximity = Math.abs(midY - window.innerHeight / 2);
        if (proximity < bestProximity) {
          bestProximity = proximity;
          bestId = id;
        }
      }
      if (bestId) setActive(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleMap.set(id, entry.boundingClientRect);
          } else {
            visibleMap.delete(id);
          }
        }
        tick();
      },
      {
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Defer one frame so all sections are in the DOM
    requestAnimationFrame(() => {
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      }
    });

    const onScroll = () => {
      // Update bounding rects of currently visible sections so the
      // proximity-to-viewport-centre calc stays correct as the user scrolls.
      for (const id of visibleMap.keys()) {
        const el = document.getElementById(id);
        if (el) visibleMap.set(id, el.getBoundingClientRect());
      }
      tick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    observerRef.current = observer;
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <aside className="section-rail" aria-label="Nawigacja sekcji">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          className="section-rail__dot"
          data-active={active === s.id ? "true" : "false"}
          aria-label={`Przejdź do sekcji: ${s.label}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(s.id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="section-rail__label">{s.label}</span>
          <span className="section-rail__pip" aria-hidden="true" />
        </button>
      ))}
    </aside>
  );
}
