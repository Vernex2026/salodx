import { useReveal } from "../hooks/useReveal";

const INTEGRATIONS = [
  {
    name: "Anthropic Claude API",
    tagline: "Multi-agent orchestration",
    body: "Autonomiczne agenty z tool use, pamięcią kontekstu i RAG pipeline. Przeszukuje 550k wyroków, generuje pisma.",
  },
  {
    name: "ElevenLabs",
    tagline: "Synthetic Voice Pipeline",
    body: "Agent generuje opisy (DE/FR/IT) i produkuje Reels z lektorem syntetycznym. Zero człowieka w pętli.",
  },
  {
    name: "Supabase",
    tagline: "pgvector + Realtime + RLS",
    body: "Semantic search po 10k ofertach. Realtime subscriptions (60fps, 4k datapoints) bez pollingu.",
  },
  {
    name: "MetaTrader 5",
    tagline: "Live Trading Feed",
    body: "Tick-by-tick streaming przez WebSocket, 1247 ticks/s, latency 0.4ms. Backtesting engine w czasie rzeczywistym.",
  },
  {
    name: "Base / Ethereum",
    tagline: "On-chain Data Layer",
    body: "Odczyt smart kontraktów przez ethers.js. Agent analizuje przepływy i generuje scenariusze tradingowe.",
  },
  {
    name: "Stripe Connect",
    tagline: "Marketplace Split Payments",
    body: "Automatyczne wypłaty do vendorów, prowizje per transakcja, webhooks handler.",
  },
  {
    name: "WhatsApp Business API",
    tagline: "Automated Lead Pipeline",
    body: "Wykrywa oferty 15% poniżej rynku → wysyła WhatsApp z draftem w 60 sekund.",
  },
  {
    name: "KSeF API",
    tagline: "E-faktura (Real-time)",
    body: "Automatyczne wystawianie faktur FA(2) do KSeF. Session management, parsowanie UPO, archiwizacja Supabase.",
  },
  {
    name: "Resend",
    tagline: "Transactional Email Engine",
    body: "Event-driven sequences. Automatyczne przypomnienia 24h przed wizytą i 12 m-cy po instalacji.",
  },
  {
    name: "Baselinker API",
    tagline: "Multi-marketplace Orchestration",
    body: "Agent monitoruje Allegro/Amazon/eBay. Silnik cenowy, auto-przeliczanie PLN/EUR/GBP z human-in-the-loop.",
  },
  {
    name: "Web Speech + Whisper STT",
    tagline: "Voice Layer",
    body: "Głosowy widget czatu z fallbackiem do Whisper dla iOS. Agent transkrybuje i zwraca dopasowane oferty.",
  },
  {
    name: "Playwright + Claude Vision",
    tagline: "Autonomous Web Agent",
    body: "Headless scraping (mobile.de, AutoScout24) z omijaniem zabezpieczeń. Claude Vision analizuje zdjęcia. Alert w 60 sekund.",
  },
];

export default function Integrations() {
  return (
    <section
      id="integrations"
      aria-labelledby="integrations-heading"
      className="relative isolate h-screen w-screen overflow-hidden bg-black flex items-center justify-center p-6 md:p-10"
    >
      <div className="w-full max-w-[1400px] h-full max-h-[900px] flex flex-col">
        <IntegrationsHeader />
        <ul
          role="list"
          className="mt-6 grid flex-1 min-h-0 list-none grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
        >
          {INTEGRATIONS.map((item) => (
            <IntegrationCard key={item.name} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function IntegrationsHeader() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div
      ref={ref}
      className="shrink-0 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10"
    >
      <div>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          [ ARSENAŁ // INTEGRACJE ]
        </span>
        <h2
          id="integrations-heading"
          className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 mt-1 text-white`}
          style={{
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            "--pipeline-reveal-delay": "120ms",
          }}
        >
          Dwanaście systemów.{" "}
          <span className="text-neutral-500">Jeden warsztat.</span>
        </h2>
      </div>
      <p
        className={`pipeline-reveal ${visible ? "is-visible" : ""} m-0 max-w-[440px] text-neutral-400`}
        style={{
          fontSize: "13px",
          lineHeight: 1.5,
          "--pipeline-reveal-delay": "240ms",
        }}
      >
        Real-time integracje produkcyjne. Każdy moduł zbudowany do
        skalowania — nie demo, nie POC.
      </p>
    </div>
  );
}

function IntegrationCard({ item }) {
  return (
    <li className="integrations-card relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-white/30 md:p-6">
      <h3
        className="m-0 text-white"
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {item.name}
      </h3>
      <span
        className="mt-1 font-mono uppercase"
        style={{
          fontSize: "10.5px",
          letterSpacing: "0.12em",
          color: "rgba(110, 231, 183, 0.7)",
        }}
      >
        {item.tagline}
      </span>
      <p
        className="mt-3 text-neutral-400"
        style={{
          fontSize: "12.5px",
          lineHeight: 1.5,
        }}
      >
        {item.body}
      </p>
    </li>
  );
}
