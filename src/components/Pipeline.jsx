import { useReveal } from "../hooks/useReveal";

const STEPS = [
  {
    n: "01",
    badge: "[ STACK // PROTOTYPE ]",
    title: "Prototyp",
    tool: "Lovable",
    gain: "72 godziny.",
    body: "Działający, klikalny prototyp w 72h — nie statyczne makiety po trzech miesiącach. Widzisz produkt na żywo zanim agencja przyśle pierwszy invoice.",
  },
  {
    n: "02",
    badge: "[ STACK // PRODUCTION_CODE ]",
    title: "Kod",
    tool: "Claude Code",
    gain: "Własność.",
    body: "Czysty, skalowalny kod prosto do Twojego repo GitHub. Bez uwiązania w No-Code, które zniknie za rok. Twoje IP, nie nasze.",
  },
  {
    n: "03",
    badge: "[ STACK // BACKEND ]",
    title: "Backend",
    tool: "Supabase",
    gain: "Zero chaosu.",
    body: "Relacyjny Postgres z Row-Level Security na każdym wierszu. Audit trail, edge replication, migracje przez MCP. Bazy, które nie zawiodą gdy biznes rośnie.",
  },
  {
    n: "04",
    badge: "[ STACK // HOSTING ]",
    title: "Hosting",
    tool: "Vercel Edge",
    gain: "Globalna wydajność.",
    body: "Sub-100ms latency w 18 regionach. Zero cold start, automatyczny deploy z każdego pusha. Architektura gotowa na ruch od dnia pierwszego.",
  },
];

export default function Pipeline() {
  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-heading"
      className="pipeline-section h-screen w-screen relative isolate flex items-center justify-center px-6 py-20 md:px-10 md:py-28 overflow-hidden snap-start"
    >
      {/* Volumetric smoke wall — global particles bleed through softer glass */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 backdrop-blur-2xl bg-black/40 pointer-events-none"
      />
      <div className="relative z-10 w-full max-w-[1400px] flex flex-col">
        <PipelineHeader />
        <ol
          role="list"
          className="mt-8 grid flex-1 min-h-0 grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-5"
        >
          {STEPS.map((step) => (
            <PipelineCard key={step.n} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function PipelineHeader() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div ref={ref} className="shrink-0">
      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""}`}
        style={{
          fontFamily:
            "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.55)",
          "--pipeline-reveal-delay": "0ms",
        }}
      >
        [ STOS // WARSZTAT ]
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h2
          id="pipeline-heading"
          className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 text-white`}
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            "--pipeline-reveal-delay": "120ms",
          }}
        >
          Twój stos.{" "}
          <span style={{ color: "#A1A1AA" }}>Jeden warsztat.</span>
        </h2>

        <p
          className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 max-w-[440px]`}
          style={{
            fontSize: "15px",
            lineHeight: 1.5,
            color: "#D4D4D8",
            "--pipeline-reveal-delay": "260ms",
          }}
        >
          Cztery narzędzia. Jedna ręka. Bez agencji, bez tickets. Stack, który
          skaluje od prototypu do produkcji w 72 godziny.
        </p>
      </div>
    </div>
  );
}

function PipelineCard({ step }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });

  return (
    <li
      ref={ref}
      className="pipeline-card"
      style={{ listStyle: "none" }}
    >
      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""}`}
        style={{
          fontFamily:
            "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.45)",
          "--pipeline-reveal-delay": "0ms",
        }}
      >
        <span className="pipeline-card-num">{step.n}</span>
        {step.badge}
      </div>

      <h3
        className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 mt-3 text-white`}
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(1.375rem, 2.2vw, 1.875rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.035em",
          "--pipeline-reveal-delay": "60ms",
        }}
      >
        {step.title}{" "}
        <span style={{ color: "#A1A1AA", fontWeight: 600 }}>
          / {step.tool}
        </span>
      </h3>

      <div
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-3`}
        style={{ "--pipeline-reveal-delay": "120ms" }}
      >
        <span
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "18px",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          {step.gain}
        </span>
      </div>

      <p
        className={`pipeline-reveal ${visible ? "is-visible" : ""} mt-2`}
        style={{
          fontSize: "14px",
          lineHeight: 1.55,
          color: "#D4D4D8",
          "--pipeline-reveal-delay": "180ms",
        }}
      >
        {step.body}
      </p>
    </li>
  );
}
