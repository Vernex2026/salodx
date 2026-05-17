import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function NewsletterCTA() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".newsletter-rise", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="newsletter-heading"
      className="relative bg-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-hairline)] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-white px-8 py-10 sm:px-12 sm:py-14"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(31,91,255,0.18), rgba(31,91,255,0))" }}
          />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="newsletter-rise max-w-2xl">
              <h3
                id="newsletter-heading"
                className="font-display text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[var(--color-ink)] sm:text-[32px]"
              >
                Dostawaj najlepsze oferty zanim znikną.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)] sm:text-[16px]">
                Jeden mail w poniedziałek z trzema ofertami pod twój profil bankowy. Bez zobowiązań,
                wypisujesz się jednym kliknięciem.
              </p>
            </div>

            <form
              className="newsletter-rise flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Zapis do mailingu Saldox"
            >
              <label htmlFor="newsletter-email" className="sr-only">Twój e-mail</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="twoj@email.pl"
                className="flex-1 rounded-full border border-[var(--color-hairline-2)] bg-white px-5 py-3 text-[14.5px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)] transition-all duration-200 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-brand)] px-6 py-3 text-[14px] font-semibold text-white shadow-[var(--shadow-glow)] transition-all duration-200 hover:bg-[var(--color-brand-hover)]"
              >
                Zapisz mnie
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
