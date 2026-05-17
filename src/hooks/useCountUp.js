import { useEffect, useState } from "react";

/**
 * useCountUp — animuje liczbę 0 → target gdy `when` = true.
 * Easing: ease-out cubic. Respects prefers-reduced-motion (instant target).
 */
export function useCountUp(target, { duration = 1400, when = true } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!when) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let start = null;
    let raf = null;
    const animate = (ts) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [target, duration, when]);

  return value;
}
