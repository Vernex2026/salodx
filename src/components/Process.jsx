import { useReveal } from "../hooks/useReveal";

const STEPS = [
  {
    number: "01",
    title: "Brief i Architektura",
    body: "Zaczynamy od twardych danych. Analizujemy Twój problem i w 48 godzin proponujemy stack technologiczny (od Reacta po backend w Supabase).",
  },
  {
    number: "02",
    title: "Kod i Wdrożenie",
    body: "Żadnych „ładnych obrazków” w Figmie, które nie działają. Programujemy na żywym organizmie. Dostajesz dostęp do środowiska testowego na bieżąco.",
  },
  {
    number: "03",
    title: "Skala i Przekazanie",
    body: "Optymalizujemy wydajność, dopinamy infrastrukturę i przekazujemy Ci pełną własność nad kodem. System jest Twój.",
  },
];

export default function Process() {
  return (
    <section
      id="proces"
      aria-labelledby="process-heading"
      className="section-light relative isolate overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-32 sm:px-8 sm:py-40 md:py-48 lg:px-12 lg:py-56">
        <ProcessHeader />

        <ol
          role="list"
          className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:mt-20 lg:gap-14"
        >
          {STEPS.map((step, i) => (
            <ProcessStep key={step.number} step={step} delay={i * 120} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessHeader() {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} max-w-4xl`}
    >
      <h2
        id="process-heading"
        className="font-display"
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(3rem, 9vw, 6rem)",
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.045em",
          margin: 0,
          color: "#06070B",
        }}
      >
        Jak pracujemy.{" "}
        <span style={{ color: "#71717A" }}>Bez agencji, bez chaosu.</span>
      </h2>
    </div>
  );
}

function ProcessStep({ step, delay = 0 }) {
  const [ref, visible] = useReveal({ threshold: 0.25 });
  return (
    <li
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${delay}ms`, listStyle: "none" }}
    >
      <div
        style={{
          fontFamily:
            "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.15em",
          color: "#A1A1AA",
        }}
      >
        {step.number}
      </div>
      <h3
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(1.875rem, 3vw, 2.625rem)",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-0.035em",
          color: "#06070B",
          margin: "16px 0 0 0",
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "17px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#52525B",
          margin: "16px 0 0 0",
          maxWidth: "32ch",
        }}
      >
        {step.body}
      </p>
    </li>
  );
}
