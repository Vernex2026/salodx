import { useReveal } from "../hooks/useReveal";

const ROWS = [
  {
    old: {
      title: "Tygodnie wycen",
      body: "Czekasz miesiącami na pierwszy klikalny ekran. Brief krąży między działami, deadline puchnie.",
    },
    nw: {
      title: "72-godzinny prototyp",
      body: "Działający, klikalny system w 3 dni od briefu. Klient widzi produkt zanim zafakturujemy.",
    },
  },
  {
    old: {
      title: "Uwiązanie w No-Code",
      body: "Twój produkt żyje na cudzej platformie. Znikną — znikniesz razem z subskrypcją.",
    },
    nw: {
      title: "Czysty kod React/Vercel",
      body: "Generujemy do Twojego repozytorium GitHub. Architektura jest Twoją własnością intelektualną.",
    },
  },
  {
    old: {
      title: "Abonament za zmiany",
      body: "Każda zmiana tekstu = faktura. Każda kosmetyka = ticket w queue agencji.",
    },
    nw: {
      title: "AI self-service",
      body: "Zarządzasz produktem rozmową z wbudowanym agentem. Zwalniasz nas po wdrożeniu.",
    },
  },
];

export default function Manifesto() {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.35 });
  const [closingRef, closingVisible] = useReveal({ threshold: 0.5 });

  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="manifesto-section section-light relative isolate overflow-hidden"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 sm:px-8 md:py-40 lg:px-12 lg:py-48">
        <div ref={headerRef} className="max-w-3xl">
          <div
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""}`}
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(9,9,11,0.55)",
              "--pipeline-reveal-delay": "0ms",
            }}
          >
            [ ENGAGEMENT // NO_BULLSHIT ]
          </div>

          <h2
            id="manifesto-heading"
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} m-0 mt-6`}
            style={{
              fontFamily:
                "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              color: "#09090B",
              "--pipeline-reveal-delay": "120ms",
            }}
          >
            Kod jest Twój.{" "}
            <span style={{ color: "#52525B" }}>Od pierwszego dnia.</span>
          </h2>

          <p
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} mt-6 max-w-[640px]`}
            style={{
              fontSize: "18px",
              lineHeight: 1.55,
              color: "#52525B",
              "--pipeline-reveal-delay": "260ms",
            }}
          >
            Tradycyjne agencje sprzedają Ci abonamenty, zablokowany kod i
            miesiące wycen. My sprzedajemy gotową architekturę i niezależność.
          </p>
        </div>

        <div className="manifesto-grid mt-20 lg:mt-28">
          <div className="manifesto-divider" aria-hidden="true" />
          {ROWS.map((row, i) => (
            <ManifestoRow key={i} row={row} index={i} />
          ))}
        </div>

        <div
          ref={closingRef}
          className={`manifesto-closing pipeline-reveal ${closingVisible ? "is-visible" : ""} mt-20 lg:mt-28`}
          style={{ "--pipeline-reveal-delay": "0ms" }}
        >
          <p
            className="m-0 mx-auto max-w-[820px] text-center"
            style={{
              fontFamily:
                "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(1.25rem, 2.1vw, 1.625rem)",
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: "-0.025em",
              color: "#52525B",
            }}
          >
            Twój zysk: Inwestujesz w technologię, która staje się{" "}
            <strong
              style={{
                color: "#09090B",
                fontWeight: 800,
              }}
            >
              własnością Twojej firmy (IP)
            </strong>
            , a nie wynajmujesz ją od pośrednika.
          </p>
        </div>
      </div>
    </section>
  );
}

function ManifestoRow({ row, index }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  const delay = index * 120;

  return (
    <div
      ref={ref}
      className="manifesto-row"
      data-visible={visible ? "true" : "false"}
      style={{ "--manifesto-row-delay": `${delay}ms` }}
    >
      <div className="manifesto-old">
        <div className="manifesto-eyebrow manifesto-eyebrow--old">
          [ STARY MODEL ]
        </div>
        <h3 className="manifesto-title manifesto-title--old">
          {row.old.title}
        </h3>
        <p className="manifesto-body manifesto-body--old">{row.old.body}</p>
      </div>

      <div className="manifesto-vs" aria-hidden="true">
        →
      </div>

      <div className="manifesto-new">
        <div className="manifesto-eyebrow manifesto-eyebrow--new">
          [ MODEL // VERNEX ]
        </div>
        <h3 className="manifesto-title manifesto-title--new">{row.nw.title}</h3>
        <p className="manifesto-body manifesto-body--new">{row.nw.body}</p>
      </div>
    </div>
  );
}
