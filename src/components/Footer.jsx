/**
 * Slim footer — Terminal section sits above as climax CTA.
 * Here: logo + nav links + legal + copyright. Brak big CTA.
 */
export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ background: "var(--color-black)" }}
    >
      <div className="relative mx-auto max-w-[1280px] border-t border-white/10 px-6 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-start">
          <div>
            <a
              href="#top"
              className="group inline-flex items-center gap-2.5"
              aria-label="Vernex — strona główna"
            >
              <span
                aria-hidden="true"
                className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px]"
                style={{ background: "var(--color-white)" }}
              >
                <span
                  className="font-display text-[18px] font-bold text-[var(--color-black)]"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  V
                </span>
              </span>
              <span className="font-display text-[22px] font-bold tracking-[-0.04em] text-white">
                Vernex
              </span>
            </a>
            <p className="mt-3 max-w-sm text-[13px] leading-[1.55] text-white/45">
              Engineering studio. WebGL, AI agents, premium frontend.
              Wrocław / Warszawa / Remote.
            </p>
          </div>

          <nav
            aria-label="Linki"
            className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 lg:gap-x-14"
          >
            <FooterCol
              title="Strona"
              links={[
                ["Proces", "#pipeline"],
                ["Panel AI", "#panel"],
                ["Case studies", "#proof"],
                ["Manifest", "#manifesto"],
              ]}
            />
            <FooterCol
              title="Firma"
              links={[
                ["Inicjacja", "#kontakt"],
                ["E-mail", "mailto:biuro@vernex.pl"],
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                ["Regulamin", "#regulamin"],
                ["Prywatność", "#prywatnosc"],
                ["Cookies", "#cookies"],
              ]}
            />
          </nav>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] border-t border-white/10 px-6 py-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-3 text-[12px] text-white/40 sm:flex-row sm:items-center">
          <div>© 2026 Vernex · Wszelkie prawa zastrzeżone.</div>
          <div className="flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            <span>Engineering Studio · WebGL + AI</span>
          </div>
        </div>
      </div>

      <div
        className="relative mx-auto hidden max-w-[1280px] px-6 pb-6 sm:px-8 lg:flex lg:px-12"
        aria-hidden="true"
      >
        <div
          className="flex items-center gap-2 text-white/25"
          style={{
            fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>↕ ↔</span>
          <span>Przeciągnij · soczewka powiększa centrum</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="eyebrow text-white/40">{title}</h4>
      <ul role="list" className="mt-4 space-y-2.5 text-[13.5px]">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-white/65 transition-colors hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
