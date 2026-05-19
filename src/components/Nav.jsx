import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { label: "Promocje", href: "#promocje" },
  { label: "Banki",    href: "#banki" },
  { label: "Pożyczki", href: "#pozyczki" },
  { label: "Blog",     href: "#blog" },
  { label: "FAQ",      href: "#faq" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef(null);

  // Scrolled state — glass nav after 64px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock + Esc when menu open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Return focus to hamburger
      hamburgerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed left-1/2 top-3 z-50 -translate-x-1/2 transition-[transform,opacity] duration-300"
        style={{ width: "calc(100% - 24px)", maxWidth: "1180px" }}
        role="banner"
      >
        <nav
          aria-label="Główna nawigacja"
          data-scrolled={scrolled || open ? "true" : "false"}
          className="nav-glass flex h-[60px] items-center justify-between rounded-full pl-4 pr-2 sm:pl-5 sm:pr-3"
        >
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label="Saldox — strona główna"
          >
            <span
              aria-hidden="true"
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px]"
              style={{
                background: "var(--color-white)",
                boxShadow:
                  "none",
              }}
            >
              <span className="font-display text-[18px] font-bold leading-none text-[var(--color-black)]">
                S
              </span>
            </span>
            <span className="font-display text-[22px] font-bold tracking-[-0.04em] text-[var(--color-ink)]">
              Saldox
            </span>
          </a>

          {/* Center: Live indicator (desktop) */}
          <div className="hidden items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-muted)] md:flex">
            <span className="live-dot" aria-hidden="true" />
            <span>
              <span className="text-[var(--color-ink)] numeric font-semibold">47</span> ofert
              <span className="mx-1.5 text-[var(--color-hairline-2)]">·</span>
              <span className="text-[var(--color-ink)] numeric font-semibold">24</span> banki
            </span>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <a
              href="#promocje"
              className="hidden h-10 items-center rounded-full border border-[var(--color-hairline)] bg-white/[0.04] px-4 text-[13px] font-medium text-[var(--color-ink)] transition-colors hover:border-white/20 hover:bg-white/[0.08] sm:inline-flex"
            >
              Zobacz oferty
            </a>

            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
              aria-controls="menu-overlay"
              className="hamburger relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-white/[0.04] text-[var(--color-ink)] transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              data-open={open}
            >
              <span aria-hidden="true" className="relative block h-3.5 w-5">
                <span
                  className="hamburger-line hamburger-line-1 absolute left-0 right-0 top-0 h-[1.6px] rounded-full bg-current"
                  style={{ transformOrigin: "center" }}
                />
                <span
                  className="hamburger-line hamburger-line-2 absolute left-0 right-0 top-1/2 h-[1.6px] -translate-y-1/2 rounded-full bg-current"
                />
                <span
                  className="hamburger-line hamburger-line-3 absolute bottom-0 left-0 right-0 h-[1.6px] rounded-full bg-current"
                  style={{ transformOrigin: "center" }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen menu overlay — ZEN style */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            id="menu-overlay"
            className="menu-overlay"
            data-open={open}
            role="dialog"
            aria-modal={open}
            aria-label="Menu główne"
            aria-hidden={!open}
          >
            <div className="relative flex h-full w-full flex-col">
              {/* Top bar inside overlay — wordmark + close mirrors nav */}
              <div className="flex items-center justify-between px-6 pt-[18px] sm:px-8 lg:px-12">
                <a
                  href="#top"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px]"
                    style={{
                      background: "var(--color-white)",
                      boxShadow:
                        "none",
                    }}
                  >
                    <span className="font-display text-[18px] font-bold leading-none text-[var(--color-black)]">
                      S
                    </span>
                  </span>
                  <span className="font-display text-[22px] font-bold tracking-[-0.04em] text-white">
                    Saldox
                  </span>
                </a>

                {/* Close button — morphs back to hamburger */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zamknij menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:bg-white/[0.12]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Menu items — large editorial typography */}
              <div className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-2 sm:px-8 lg:px-12">
                <ul role="list" className="space-y-0">
                  {LINKS.map((link, i) => (
                    <li
                      key={link.href}
                      className="menu-item"
                      style={{ transitionDelay: open ? `${280 + i * 80}ms` : "0ms" }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group block py-2 font-display tracking-[-0.04em] text-white transition-colors duration-200 hover:underline underline-offset-8 decoration-2 sm:py-2.5"
                        style={{
                          fontSize: "clamp(2rem, min(6.5vw, 7.5vh), 4.5rem)",
                          lineHeight: "1.02",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        <span className="inline-flex items-center gap-6">
                          <span className="numeric text-[14px] font-mono text-white/40 tracking-[0.12em]">
                            0{i + 1}
                          </span>
                          <span className="relative inline-block">
                            {link.label}
                            <span
                              aria-hidden="true"
                              className="absolute -bottom-1 left-0 h-[2px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full"
                            />
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom block — contact + meta */}
              <div
                className="menu-item border-t border-white/10 px-6 pb-6 pt-6 sm:px-8 sm:pb-10 sm:pt-8 lg:px-12"
                style={{ transitionDelay: open ? "720ms" : "0ms" }}
              >
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <div className="eyebrow text-white/40">Kontakt</div>
                    <a
                      href="mailto:biuro@saldox.pl"
                      className="mt-2 inline-block font-display text-[26px] font-medium tracking-[-0.02em] text-white transition-colors hover:underline underline-offset-8 decoration-2 sm:text-[32px]"
                    >
                      biuro@saldox.pl
                    </a>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <a
                      href="#newsletter"
                      onClick={() => setOpen(false)}
                      className="group inline-flex items-center gap-2 text-[14px] font-medium text-white/80 transition-colors hover:text-white"
                    >
                      Zapisz się na newsletter
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path
                          d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <div className="text-[12px] text-white/40">
                      Saldox · 2026 · Premium hub promocji bankowych
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
