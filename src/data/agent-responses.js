/**
 * Fallback canned responses for CommandPalette when /api/chat is
 * unavailable (missing key, dev environment, 5xx). Streamed via the
 * same typewriter pipeline as real LLM tokens, so the UX is identical.
 */
export const FALLBACK_RESPONSES = {
  crm: `CRM B2B to nasza specjalność. Stack: Next.js / React 19 + Supabase (Postgres, RLS, auth) + Vercel AI SDK dla wewnętrznych asystentów. Średni timeline: 6–10 tygodni od briefu do produkcji. Owner zachowuje full kod ownership. Szczegóły → biuro@vernex.pl.`,

  optimization: `Optymalizacja: cele to sub-100ms TTI i utrzymane 60fps na WebGL workloadach. Strategie: code-splitting na trasy, React 19 transitions, GPU instancing dla particle systems, edge rendering dla AI responses. Średnio podnosimy Lighthouse o 30–50 punktów w 2 tygodnie audytu.`,

  stack: `Stack Vernex: React 19, Vite 6, Tailwind v4, Vercel AI SDK + Anthropic Claude, Supabase (Postgres + auth), Edge Functions. Dla WebGL: three.js + R3F + postprocessing (Bloom + custom shaders). GSAP do choreografii animacji. Wszystko dowiezione w wąskich budżetach <800KB JS gz.`,

  nexus: `Project NEXUS to nasz PoC wizualizacji AI w czasie rzeczywistym. WebGL particle reaktor (75 000 cząsteczek na GPU, 60fps), opakowany w fizykę szkła (Dark Material). Dowodzi, że potrafimy obsłużyć najbardziej wymagające systemy AI i finansowe bez kompromisów. Live wersja widoczna w tle tej strony.`,

  agents: `AI agents: budujemy autonomiczne systemy korzystające z Vercel AI SDK + Anthropic Claude (sonnet, opus, haiku). Use cases: wewnętrzne asystenty B2B, automatyczna analiza dokumentów, RAG nad korporacyjną bazą wiedzy. Edge Runtime dla niskich latencji.`,

  contact: `Najszybszy kanał: biuro@vernex.pl. Wracamy z rekomendacją architektury w 48h od briefu. Vernex · Wrocław / Warszawa / Remote.`,

  default: `Vernex specjalizuje się w premium frontend engineering: WebGL, AI agents, architektury B2B. Każdy projekt zaczyna się od audytu w 48h i propozycji architektury. Pisz na biuro@vernex.pl z briefem — wracamy z konkretami.`,
};

/**
 * Match user query to a fallback intent bucket via simple regex.
 * Falls back to "default" when nothing matches.
 */
export function matchIntent(query) {
  const q = (query || "").toLowerCase();
  if (/\b(crm|panel|admin|b2b|kancelar)/i.test(q)) return "crm";
  if (/\b(optymalizacj|wydajn|performance|fps|szybko|lighthouse)/i.test(q))
    return "optimization";
  if (/\b(stack|technolog|narzędzi|używacie|budujecie|tech)/i.test(q))
    return "stack";
  if (/\b(nexus|webgl|particle|cząstecz|wizualizacj)/i.test(q)) return "nexus";
  if (/\b(agent|ai|llm|claude|gpt|sonnet|opus)/i.test(q)) return "agents";
  if (/\b(kontakt|mail|email|napisz|porozmawia|skontakt)/i.test(q))
    return "contact";
  return "default";
}
