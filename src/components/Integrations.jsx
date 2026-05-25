import { useState } from "react";

const systems = [
  {
    id: "01",
    title: "Anthropic Claude API",
    subtitle: "Multi-agent Orchestration",
    desc: "Autonomiczne agenty z tool use, pamięcią kontekstu i RAG pipeline. Agent prawny analizuje sprawy, przeszukuje 550k wyroków sądowych, generuje pisma i uczy się z każdej sprawy. Nie chatbot — działający system decyzyjny.",
  },
  {
    id: "02",
    title: "ElevenLabs",
    subtitle: "Synthetic Voice Pipeline",
    desc: "Agent Content Creator generuje opisy w DE/FR/IT i produkuje Reels z lektorem syntetycznym. Jeden trigger — pełne ogłoszenie na wszystkich portalach z narracją głosową. Zero człowieka w pętli.",
  },
  {
    id: "03",
    title: "Supabase",
    subtitle: "pgvector + Realtime + RLS",
    desc: "Semantic search po 10 000 ofertach pojazdów z embeddings. Row Level Security na poziomie każdego rekordu. Realtime subscriptions dla dashboardów live — 4k punktów danych, 60fps, zero pollingu.",
  },
  {
    id: "04",
    title: "MetaTrader 5 (MT5)",
    subtitle: "Live Trading Feed",
    desc: "Tick-by-tick streaming cen przez WebSocket, 1247 ticks/s przy latency 0.4ms. Integracja sygnałów algo do panelu tradera z backtesting engine i P&L tracking w czasie rzeczywistym.",
  },
  {
    id: "05",
    title: "Base / Ethereum",
    subtitle: "On-chain Data Layer",
    desc: "Odczyt danych kontraktów smart przez ethers.js, cross-chain monitoring (ETH, BSC, Base). Agent inwestycyjny analizuje on-chain przepływy i generuje scenariusze tradingowe.",
  },
  {
    id: "06",
    title: "Stripe Connect",
    subtitle: "Marketplace Split Payments",
    desc: "Pełny model marketplace: split payments do vendorów, automatyczne wypłaty, prowizje per transakcja, 7-day trial z automatycznym przejściem na subskrypcję. Webhook handler dla każdego zdarzenia.",
  },
  {
    id: "07",
    title: "WhatsApp Business API",
    subtitle: "Automated Lead Pipeline",
    desc: "Agent komisu DACH: wykrywa ofertę 15% poniżej rynku → wysyła WhatsApp z gotowym draftem wiadomości do sprzedawcy w 60 sekund od pojawienia się ogłoszenia. Zero ręcznej interwencji.",
  },
  {
    id: "08",
    title: "KSeF API",
    subtitle: "Ministerstwo Finansów",
    desc: "Automatyczne wystawianie faktur FA(2) bezpośrednio do KSeF. Session token management, parsowanie UPO (Urzędowe Potwierdzenie Odbioru), archiwizacja w Supabase. Zero ręcznego księgowania.",
  },
  {
    id: "09",
    title: "Resend",
    subtitle: "Transactional Email Engine",
    desc: "Sekwencje email wyzwalane zdarzeniami (nowy lead, zmiana statusu). Automatyczne przypomnienia 24h przed wizytą serwisową i 12 miesięcy po instalacji urządzenia. HTML templates, webhook tracking.",
  },
  {
    id: "10",
    title: "Baselinker API",
    subtitle: "Multi-marketplace Orchestration",
    desc: "Agent monitoruje jakość ofert na Allegro, Amazon DE, eBay jednocześnie. Silnik cenowy z regułami marż, auto-przeliczanie PLN/EUR/GBP, change detection z human-in-the-loop zatwierdzaniem.",
  },
  {
    id: "11",
    title: "Web Speech + Whisper STT",
    subtitle: "Voice Layer",
    desc: "Obsługa głosowa w widgecie czatu z fallbackiem do Whisper dla iOS/Safari. Klient mówi zapytanie o pojazd — agent transkrybuje, analizuje, zwraca dopasowane oferty z linkami URL.",
  },
  {
    id: "12",
    title: "Playwright + Claude Vision",
    subtitle: "Autonomous Web Agent",
    desc: "Headless scraping mobile.de, AutoScout24, tutti.ch z wykrywaniem zmian cen i parametrów. Claude Vision analizuje zdjęcia pojazdów i historię serwisową. Alert do właściciela komisu w 60 sekund.",
  },
];

export default function Integrations() {
  const [activeSystem, setActiveSystem] = useState(null);

  return (
    <section
      id="integrations"
      aria-labelledby="integrations-heading"
      className="w-screen min-h-screen bg-[#000000] text-white flex items-center justify-center snap-start relative overflow-hidden p-6 md:p-12"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-40 pointer-events-none backdrop-blur-[100px]"
      />

      <div className="w-full max-w-[1400px] z-10 flex flex-col justify-center">
        <div className="mb-8 border-l-2 border-neutral-700 pl-4">
          <h2
            id="integrations-heading"
            className="text-sm font-mono tracking-widest text-neutral-500 uppercase m-0"
          >
            Vernex Architecture
          </h2>
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-200 m-0">
            12 Core Integrations
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {systems.map((sys) => (
            <button
              key={sys.id}
              type="button"
              onClick={() => setActiveSystem(sys)}
              className="group relative bg-[#09090b]/60 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between h-[190px] overflow-hidden text-left"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[15px] tracking-tight text-neutral-200 group-hover:text-white transition-colors m-0">
                    {sys.title}
                  </h4>
                  <span className="font-mono text-[10px] text-neutral-600 tracking-wider">
                    {sys.id}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 tracking-tight m-0">
                  {sys.subtitle}
                </p>
                <p className="text-neutral-400 text-[12px] leading-relaxed mt-2 line-clamp-3 group-hover:text-neutral-300 transition-colors">
                  {sys.desc}
                </p>
              </div>

              <div className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400 flex items-center gap-1 transition-colors mt-2">
                <span>Details</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeSystem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setActiveSystem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="integrations-modal-title"
        >
          <div
            className="bg-[#09090b] border border-neutral-800 max-w-2xl w-full rounded-2xl p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-xs text-neutral-500">
                  {activeSystem.id} // SYSTEM INTEGRATION
                </span>
                <h3
                  id="integrations-modal-title"
                  className="text-2xl font-bold text-white mt-1 m-0"
                >
                  {activeSystem.title}
                </h3>
                <p className="font-mono text-sm text-neutral-400 mt-0.5 m-0">
                  {activeSystem.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSystem(null)}
                className="text-neutral-500 hover:text-white font-mono text-sm border border-neutral-800 px-3 py-1 rounded-md hover:bg-neutral-900 transition-colors"
              >
                ESC
              </button>
            </div>
            <div className="border-t border-neutral-800/80 pt-4">
              <p className="text-neutral-300 text-sm leading-relaxed font-sans m-0">
                {activeSystem.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
