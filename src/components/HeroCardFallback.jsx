import BankLogo from "./BankLogo";

/* ──────────────────────────────────────────────────────────
   HeroCardFallback — static 2D card shown while the R3F chunk
   loads and on mobile / reduced-motion. Uses the same dark stark
   chrome as the TopPromos offer cards so the page does not flash
   an empty box.
   ────────────────────────────────────────────────────────── */

export default function HeroCardFallback() {
  return (
    <div className="hero-scene flex items-center justify-center">
      <div
        className="relative w-full max-w-[360px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0F1320] p-6 shadow-[0_24px_56px_-16px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: "1.586 / 1" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-[2px]"
          style={{ background: "#E11D48" }}
        />
        <header className="flex items-center gap-2.5">
          <BankLogo bank="mBank" size={32} />
          <div className="flex-1 leading-tight">
            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-white">
              mBank
            </h3>
            <span className="text-[11px] text-white/55">Konto Intensive</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 px-2 py-0.5 text-[10px] font-medium text-white/75">
            <span className="live-dot" aria-hidden="true" />
            12 min
          </span>
        </header>
        <div className="mt-5">
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Bonus powitalny
          </div>
          <p className="mt-1 flex items-baseline gap-1">
            <span
              className="font-display numeric text-white"
              style={{
                fontSize: "3.4rem",
                lineHeight: "1",
                letterSpacing: "-0.055em",
                fontWeight: 700,
              }}
            >
              500
            </span>
            <span
              className="font-display text-white/55"
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                letterSpacing: "-0.03em",
              }}
            >
              zł
            </span>
          </p>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] text-white/45">
          <span className="font-mono uppercase tracking-[0.16em]">via Saldox</span>
          <span className="font-mono">14 dni</span>
        </div>
      </div>
    </div>
  );
}
