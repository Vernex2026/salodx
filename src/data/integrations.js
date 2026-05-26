export const INTEGRATIONS = [
  {
    id: "claude",
    glyph: "ai",
    accent: "#D97757",
    title: "Anthropic Claude API",
    tag: "[ MULTI-AGENT // ORCHESTRATION ]",
    metric: "550k wyroków · tool use + RAG",
    desc: "Autonomiczne agenty z tool use, pamięcią kontekstu i RAG pipeline. Agent prawny analizuje sprawy, przeszukuje 550k wyroków sądowych, generuje pisma i uczy się z każdej sprawy. Nie chatbot — działający system decyzyjny.",
  },
  {
    id: "elevenlabs",
    glyph: "radial",
    accent: "#E2255D",
    title: "ElevenLabs",
    tag: "[ SYNTHETIC // VOICE ]",
    metric: "DE/FR/IT · Reels z lektorem",
    desc: "Agent Content Creator generuje opisy w DE/FR/IT i produkuje Reels z lektorem syntetycznym. Jeden trigger — pełne ogłoszenie na wszystkich portalach z narracją głosową. Zero człowieka w pętli.",
  },
  {
    id: "supabase",
    glyph: "cloud",
    accent: "#3ECF8E",
    title: "Supabase",
    tag: "[ PGVECTOR // REALTIME // RLS ]",
    metric: "10k ofert · 4k pts @ 60fps",
    desc: "Semantic search po 10 000 ofertach pojazdów z embeddings. Row Level Security na poziomie każdego rekordu. Realtime subscriptions dla dashboardów live — 4k punktów danych, 60fps, zero pollingu.",
  },
  {
    id: "mt5",
    glyph: "fintech",
    accent: "#2196F3",
    title: "MetaTrader 5",
    tag: "[ LIVE // TRADING FEED ]",
    metric: "1247 ticks/s · 0.4ms",
    desc: "Tick-by-tick streaming cen przez WebSocket, 1247 ticks/s przy latency 0.4ms. Integracja sygnałów algo do panelu tradera z backtesting engine i P&L tracking w czasie rzeczywistym.",
  },
  {
    id: "base",
    glyph: "edge",
    accent: "#0052FF",
    title: "Base / Ethereum",
    tag: "[ ON-CHAIN // DATA LAYER ]",
    metric: "ETH · BSC · Base · L2",
    desc: "Odczyt danych kontraktów smart przez ethers.js, cross-chain monitoring (ETH, BSC, Base). Agent inwestycyjny analizuje on-chain przepływy i generuje scenariusze tradingowe.",
  },
  {
    id: "stripe",
    glyph: "ecom",
    accent: "#635BFF",
    title: "Stripe Connect",
    tag: "[ MARKETPLACE // SPLIT ]",
    metric: "7-day trial → subscription",
    desc: "Pełny model marketplace: split payments do vendorów, automatyczne wypłaty, prowizje per transakcja, 7-day trial z automatycznym przejściem na subskrypcję. Webhook handler dla każdego zdarzenia.",
  },
  {
    id: "whatsapp",
    glyph: "crm",
    accent: "#25D366",
    title: "WhatsApp Business API",
    tag: "[ LEAD // PIPELINE ]",
    metric: "15% poniżej rynku → 60s",
    desc: "Agent komisu DACH: wykrywa ofertę 15% poniżej rynku → wysyła WhatsApp z gotowym draftem wiadomości do sprzedawcy w 60 sekund od pojawienia się ogłoszenia. Zero ręcznej interwencji.",
  },
  {
    id: "ksef",
    glyph: "legal",
    accent: "#DC2626",
    title: "KSeF API",
    tag: "[ MF // E-FAKTURA ]",
    metric: "FA(2) · UPO · session token",
    desc: "Automatyczne wystawianie faktur ustrukturyzowanych zgodnych ze schematem FA(2) bezpośrednio do Krajowego Systemu e-Faktur. Session token management, parsowanie UPO, archiwizacja w Supabase. System generuje i wysyła fakturę w sekundy od zamknięcia transakcji — zero ręcznego księgowania.",
  },
  {
    id: "resend",
    glyph: "edge",
    accent: "#FFFFFF",
    title: "Resend",
    tag: "[ TRANSACTIONAL // EMAIL ]",
    metric: "Event-driven · webhook tracking",
    desc: "Sekwencje email wyzwalane zdarzeniami (nowy lead, zmiana statusu, wygasający kontrakt). Automatyczne przypomnienia 24h przed wizytą serwisową i 12 miesięcy po instalacji urządzenia. HTML templates, webhook tracking.",
  },
  {
    id: "baselinker",
    glyph: "logistics",
    accent: "#FF6500",
    title: "Baselinker API",
    tag: "[ MULTI-MARKETPLACE // ORCH ]",
    metric: "Allegro · Amazon DE · eBay",
    desc: "Agent monitoruje jakość ofert na Allegro, Amazon DE, eBay jednocześnie. Silnik cenowy z regułami marż, auto-przeliczanie PLN/EUR/GBP, change detection z human-in-the-loop zatwierdzaniem zmian.",
  },
  {
    id: "voice",
    glyph: "radial",
    accent: "#10A37F",
    title: "Web Speech + Whisper",
    tag: "[ VOICE // LAYER ]",
    metric: "iOS fallback · live STT",
    desc: "Obsługa głosowa w widgecie czatu z fallbackiem do Whisper dla iOS/Safari. Klient mówi zapytanie o pojazd — agent transkrybuje, analizuje, zwraca dopasowane oferty z linkami URL. Przetestowane na fizycznym iPhone.",
  },
  {
    id: "playwright",
    glyph: "ai",
    accent: "#45BA4B",
    title: "Playwright + Claude Vision",
    tag: "[ AUTONOMOUS // WEB AGENT ]",
    metric: "mobile.de · AutoScout · 60s alert",
    desc: "Headless scraping mobile.de, AutoScout24, tutti.ch, Ricardo.ch z wykrywaniem zmian cen i parametrów. Claude Vision analizuje zdjęcia pojazdów i historię serwisową. Alert do właściciela komisu w 60 sekund od znalezienia okazji.",
  },
];

// 4 cols × 3 rows. Heroes at (col 1, row 1) and (col 2, row 1).
// Numbering left-to-right top-to-bottom; tileIndex points into INTEGRATIONS.
export const CELL_MAP = [
  { col: 0, row: 0, tileIndex: 1 },   // ElevenLabs
  { col: 1, row: 0, tileIndex: 2 },   // Supabase
  { col: 2, row: 0, tileIndex: 4 },   // Base / Ethereum
  { col: 3, row: 0, tileIndex: 5 },   // Stripe Connect
  { col: 0, row: 1, tileIndex: 6 },   // WhatsApp
  { col: 1, row: 1, tileIndex: 3 },   // MetaTrader 5 HERO
  { col: 2, row: 1, tileIndex: 0 },   // Anthropic Claude HERO
  { col: 3, row: 1, tileIndex: 7 },   // KSeF
  { col: 0, row: 2, tileIndex: 8 },   // Resend
  { col: 1, row: 2, tileIndex: 9 },   // Baselinker
  { col: 2, row: 2, tileIndex: 10 },  // Voice
  { col: 3, row: 2, tileIndex: 11 },  // Playwright
];

export const HERO_INDICES = new Set([0, 3]);
