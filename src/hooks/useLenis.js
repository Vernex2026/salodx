import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let rafHooked = false;

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initLenis() {
  if (typeof window === "undefined") return null;
  if (lenisInstance) return lenisInstance;
  if (prefersReducedMotion()) return null;
  if (isTouchDevice()) return null;

  lenisInstance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    syncTouch: false,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  if (!rafHooked) {
    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    rafHooked = true;
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

/**
 * useLenis — guarantees Lenis is initialized (no-op if already done) and
 * returns the singleton. Components don't manage lifecycle — Lenis lives
 * for app lifetime.
 */
export function useLenis() {
  useEffect(() => {
    initLenis();
  }, []);
  return lenisInstance;
}
