import { useReveal } from "../hooks/useReveal";

const CARDS = [
  {
    tag: "[ LLM & AGENTS ]",
    title: "Architektura AI",
    body: "Integracja modeli językowych z logiką biznesową. Budujemy autonomiczne systemy analizy danych, korzystając z Vercel AI SDK i zaawansowanych baz wektorowych.",
  },
  {
    tag: "[ WEBGL & REACT ]",
    title: "Inżynieria Frontendowa",
    body: "Ekstremalnie zoptymalizowane interfejsy. Odrzucamy ciężkie szablony na rzecz czystego kodu. Płynne 60fps, architektura oparta na React i sprzętowej akceleracji GPU.",
  },
  {
    tag: "[ SUPABASE & CLOUD ]",
    title: "Systemy B2B & CRM",
    body: "Skalowalne bazy danych i bezpieczna infrastruktura. Od kompleksowych migracji danych po dedykowane panele administracyjne dla wymagających branż.",
  },
];

export default function Bento() {
  return (
    <section
      id="stack"
      aria-labelledby="bento-heading"
      className="relative isolate overflow-hidden"
      style={{ background: "#000000" }}
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <BentoHeader />

        <ul
          role="list"
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-20 lg:gap-6"
        >
          {CARDS.map((card, i) => (
            <BentoCard key={card.tag} card={card} delay={i * 120} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function BentoHeader() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} max-w-3xl`}
    >
      <div
        style={{
          fontFamily:
            "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        [ STACK // CO BUDUJEMY ]
      </div>
      <h2
        id="bento-heading"
        className="font-display mt-6 text-white"
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          margin: 0,
        }}
      >
        Trzy filary architektury.
      </h2>
    </div>
  );
}

function BentoCard({ card, delay = 0 }) {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  return (
    <li
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          padding: "40px",
          borderRadius: "28px",
          background:
            "linear-gradient(180deg, rgba(20,20,25,0.85) 0%, rgba(9,9,11,0.95) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: [
            "0 24px 48px -16px rgba(0,0,0,0.65)",
            "inset 0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#71717A",
          }}
        >
          {card.tag}
        </div>
        <h3
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "#A1A1AA",
            margin: 0,
          }}
        >
          {card.body}
        </p>
      </div>
    </li>
  );
}
