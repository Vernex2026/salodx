/**
 * Premium minimal footer — solid black, bold sans, no bloom, no gradient.
 */
export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ background: "var(--color-black)" }}
    >
      {/* CTA band */}
      <div id="next" className="relative mx-auto max-w-[1280px] px-6 pb-12 pt-24 sm:px-8 md:pb-16 md:pt-32 lg:px-12">
        <div className="max-w-3xl">
          <div className="eyebrow text-white/40">Następny krok</div>
          <h2
            className="font-display mt-4 text-white"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              lineHeight: "0.88",
              letterSpacing: "-0.065em",
              fontWeight: 700,
            }}
          >
            <span className="block">Porozmawiajmy.</span>
            <span className="block text-white/55">O Twoim produkcie.</span>
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-[1.55] text-white/55 sm:text-[17px]">
            Wyślij brief. Wracamy z rekomendacją architektury w 48h.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a href="mailto:biuro@vernex.pl" className="cta-primary cta-primary--light">
              Wyślij brief
              <svg
                className="arrow"
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="relative mx-auto max-w-[1280px] border-t border-white/8 px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          {/* Wordmark + tagline */}
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
                <span className="font-display text-[18px] font-bold text-[var(--color-black)]" style={{letterSpacing:"-0.04em"}}>V</span>
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

          {/* Links */}
          <nav aria-label="Linki" className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-2 lg:gap-x-14">
            <FooterCol
              title="Firma"
              links={[
                ["O nas", "#o-nas"],
                ["Case studies", "#nexus"],
                ["Kontakt", "mailto:biuro@vernex.pl"],
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

      {/* Bottom bar */}
      <div className="relative mx-auto max-w-[1280px] border-t border-white/8 px-6 py-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-3 text-[12px] text-white/40 sm:flex-row sm:items-center">
          <div>© 2026 Vernex · Wszelkie prawa zastrzeżone.</div>
          <div className="flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            <span>Engineering Studio · WebGL + AI</span>
          </div>
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
