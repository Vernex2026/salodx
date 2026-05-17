import DocumentationPanel from "./DocumentationPanel";

// Footer — pełen 4-col + live signal "ostatni update bazy"
const COLUMNS = [
  {
    title: "Produkt",
    links: ["Promocje", "Banki", "Pożyczki", "Kalkulator bonusów", "FAQ"],
  },
  {
    title: "Banki",
    links: ["mBank", "Santander", "ING", "Pekao", "Millennium", "Wszystkie banki"],
  },
  {
    title: "Firma",
    links: ["O nas", "Blog", "Kontakt", "Praca", "Reklama"],
  },
  {
    title: "Legal",
    links: ["Regulamin", "Polityka prywatności", "Cookies", "Disclaimer"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-hairline)] bg-white pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Top: brand + live signal */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-[var(--color-hairline)] pb-10 sm:flex-row sm:items-center">
          <a href="#top" className="group flex items-center gap-2.5" aria-label="Saldox — strona główna">
            <span
              aria-hidden="true"
              className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-brand)] shadow-[0_4px_12px_rgba(31,91,255,0.30)]"
            >
              <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-white/35 to-transparent" />
              <span className="font-display text-[16px] font-semibold leading-none text-white tracking-[-0.04em]">S</span>
            </span>
            <span className="font-display text-[20px] font-semibold tracking-[-0.035em] text-[var(--color-ink)]">
              Saldox
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            <span className="flex items-center gap-2 text-[var(--color-muted)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              Ostatni update bazy: <span className="numeric font-medium text-[var(--color-text)]">4 min temu</span>
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-hairline-2)]" />
            <span className="numeric text-[var(--color-muted)]">
              Monitorowanych banków: <span className="font-medium text-[var(--color-text)]">24</span>
            </span>
          </div>
        </div>

        {/* Middle: 4-col grid */}
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4 sm:gap-8 lg:gap-10">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                {col.title}
              </h4>
              <ul role="list" className="mt-5 space-y-3 text-[14px]">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[var(--color-muted)] transition-colors duration-150 hover:text-[var(--color-brand)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Documentation — rozwijalna sekcja techniczna */}
        <DocumentationPanel />

        {/* Bottom: copyright + social */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-hairline)] pt-8 text-[12.5px] text-[var(--color-faint)] sm:flex-row sm:items-center">
          <div>
            © 2026 Saldox · Niezależny hub promocji bankowych w Polsce. Nie jesteśmy bankiem ani pośrednikiem.
          </div>
          <div className="flex items-center gap-5">
            <a href="#twitter" className="font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]">X / Twitter</a>
            <a href="#linkedin" className="font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]">LinkedIn</a>
            <a href="#rss" className="font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]">RSS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
