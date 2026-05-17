import { useEffect, useState } from "react";
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

  // Esc + body scroll lock when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--color-hairline)]/50 bg-white/45 backdrop-blur-md backdrop-saturate-150"
      role="banner"
    >
      <nav
        aria-label="Główna nawigacja"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10"
      >
        {/* Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Saldox — strona główna"
        >
          <span
            aria-hidden="true"
            className="relative flex h-7 w-7 items-center justify-center rounded-[10px] bg-[var(--color-brand)] shadow-[0_4px_12px_rgba(31,91,255,0.35)]"
          >
            <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/35 to-transparent" />
            <span className="font-display text-[15px] font-semibold leading-none text-white tracking-[-0.04em]">S</span>
          </span>
          <span className="font-display text-[19px] font-semibold tracking-[-0.035em] text-[var(--color-ink)]">
            Saldox
          </span>
        </a>

        {/* Desktop center links */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-[14px] font-medium text-[var(--color-text)] transition-colors duration-150 ease-out hover:text-[var(--color-brand)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <a
            href="#login"
            className="hidden rounded-md px-3 py-2 text-[14px] font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] sm:inline-block"
          >
            Zaloguj
          </a>
          <a
            href="#promocje"
            className="group hidden items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[13.5px] font-medium text-white transition-all duration-200 ease-out hover:bg-[#1a2236] hover:shadow-[0_8px_20px_rgba(10,14,26,0.18)] sm:inline-flex"
          >
            Zobacz oferty
            <svg
              aria-hidden="true"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            >
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Otwórz menu"
            aria-expanded={open}
            aria-controls="mobile-sheet"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)] md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet — renderowany przez portal do body (poza sticky header stacking context) */}
      {open && createPortal(
        <div
          id="mobile-sheet"
          className="fixed inset-0 z-[100] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
        >
          {/* Overlay — mocniejszy backdrop blur + ciemniejszy podkład */}
          <div
            className="sheet-overlay absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Sheet — liquid glass tafla (macOS Tahoe / Vision Pro style) */}
          <div
            className="sheet-panel absolute left-3 right-3 top-3 flex max-h-[92vh] flex-col overflow-hidden rounded-[32px]"
            style={{
              background: "rgba(255, 255, 255, 0.42)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              boxShadow: [
                // outer drop — unoszenie tafli
                "0 32px 64px -16px rgba(10,14,26,0.28)",
                "0 12px 24px -8px rgba(10,14,26,0.14)",
                "0 2px 4px rgba(10,14,26,0.04)",
                // inset edge ring — krawędź refrakcyjna
                "inset 0 0 0 1px rgba(255,255,255,0.55)",
                // inset top highlight — światło z góry
                "inset 0 1.5px 0 rgba(255,255,255,0.85)",
                // inset bottom subtle shadow — depth pod taflą
                "inset 0 -1px 0 rgba(10,14,26,0.06)",
              ].join(", "),
            }}
          >
            {/* Refraction sheen — subtle top→bottom gradient overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[32px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0) 60%)",
              }}
            />
            <div className="relative flex h-full flex-col">
            {/* Header — bez separatora (czysta tafla) */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="relative flex h-7 w-7 items-center justify-center rounded-[10px] bg-[var(--color-brand)] shadow-[0_4px_12px_rgba(31,91,255,0.35)]"
                >
                  <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/35 to-transparent" />
                  <span className="font-display text-[15px] font-semibold leading-none text-white tracking-[-0.04em]">S</span>
                </span>
                <span className="font-display text-[17px] font-semibold tracking-[-0.035em] text-[var(--color-ink)]">Saldox</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zamknij menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <ul role="list" className="flex-1 space-y-1 px-3 py-6">
              {LINKS.map((l, i) => (
                <li
                  key={l.href}
                  className="sheet-link-item"
                  style={{ animationDelay: `${180 + i * 70}ms` }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-medium text-[var(--color-ink)] transition-all duration-200 hover:bg-white/40 hover:text-[var(--color-brand)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_1px_0_rgba(255,255,255,0.8)]"
                  >
                    {l.label}
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="text-[var(--color-faint)]">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 p-5">
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="block rounded-full border border-[var(--color-hairline-2)] bg-white px-5 py-3 text-center text-[14px] font-medium text-[var(--color-ink)]"
              >
                Zaloguj
              </a>
              <a
                href="#promocje"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-brand)] px-5 py-3 text-[14px] font-semibold text-white shadow-[var(--shadow-glow)]"
              >
                Zobacz oferty
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
