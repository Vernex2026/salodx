/**
 * Premium minimal footer — Onyx palette, editorial wordmark, electric CTA.
 */
export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 50% 40% at 20% 20%, rgba(123,92,255,0.16) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 90%, rgba(0,229,255,0.10) 0%, transparent 60%), linear-gradient(180deg, #06070B 0%, #030509 100%)",
      }}
    >
      {/* CTA band */}
      <div className="relative mx-auto max-w-[1280px] px-6 pb-12 pt-24 sm:px-8 md:pb-16 md:pt-32 lg:px-12">
        <div className="max-w-3xl">
          <div className="eyebrow text-white/35">Następny krok</div>
          <h2
            className="font-display mt-4 text-white"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: "0.98",
              letterSpacing: "-0.03em",
            }}
          >
            <span className="italic">Twój bonus</span>
            <br />
            <span className="display-electric-gradient">
              <span className="halo" aria-hidden="true">już czeka.</span>
              już czeka.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-[1.55] text-white/55 sm:text-[17px]">
            Sprawdź dzisiejsze oferty z 24 banków. Trwa krócej niż kawa.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a href="#promocje" className="cta-electric">
              Zobacz dzisiejsze oferty
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
            <a
              href="#newsletter"
              className="inline-flex items-center gap-2 px-2 py-3 text-[14px] font-medium text-white/70 transition-colors hover:text-white"
            >
              Zapisz się na newsletter
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="transition-transform group-hover:translate-x-0.5"
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
              aria-label="Saldox — strona główna"
            >
              <span
                aria-hidden="true"
                className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px]"
                style={{
                  background: "linear-gradient(135deg, #4D7CFF 0%, #7B5CFF 100%)",
                  boxShadow:
                    "0 4px 12px rgba(123,92,255,0.32), inset 0 0.5px 0 rgba(255,255,255,0.5)",
                }}
              >
                <span className="font-display italic text-[18px] text-white">S</span>
              </span>
              <span className="font-display text-[22px] tracking-[-0.02em] text-white">
                Saldox
              </span>
            </a>
            <p className="mt-3 max-w-sm text-[13px] leading-[1.55] text-white/45">
              Niezależny hub premium ofert bankowych. Nie pośrednik. Nie sprzedawca.
              Po prostu Twój filtr.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Linki" className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 lg:gap-x-14">
            <FooterCol
              title="Produkt"
              links={[
                ["Promocje", "#promocje"],
                ["Banki", "#banki"],
                ["Pożyczki", "#pozyczki"],
                ["FAQ", "#faq"],
              ]}
            />
            <FooterCol
              title="Firma"
              links={[
                ["O nas", "#o-nas"],
                ["Blog", "#blog"],
                ["Kontakt", "mailto:biuro@saldox.pl"],
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
          <div>© 2026 Saldox · Wszelkie prawa zastrzeżone.</div>
          <div className="flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            <span>
              Ostatnia aktualizacja bazy:{" "}
              <span className="numeric font-medium text-white/60">4 min temu</span>
            </span>
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
