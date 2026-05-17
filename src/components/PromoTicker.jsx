// PromoTicker — live ticker bar pod nav. Marquee scrolling promocji.
const ITEMS = [
  { bank: "mBank", amount: "500 zł", time: "12 min temu", live: true },
  { bank: "Santander", amount: "300 zł", time: "2h temu" },
  { bank: "ING", amount: "400 zł", time: "wczoraj" },
  { bank: "Pekao", amount: "250 zł", time: "2 dni temu" },
  { bank: "Alior", amount: "350 zł", time: "3 dni temu" },
  { bank: "Citi Handlowy", amount: "600 zł", time: "4 dni temu" },
  { bank: "BNP Paribas", amount: "200 zł", time: "5 dni temu" },
  { bank: "Millennium", amount: "300 zł", time: "1 tydzień temu" },
];

function Row({ items, ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden={ariaHidden}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap text-[12.5px]">
          {it.live && (
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
          )}
          <span className="font-medium text-[var(--color-ink)]">{it.bank}</span>
          <span className="font-display numeric font-semibold text-[var(--color-brand)]">{it.amount}</span>
          <span className="text-[var(--color-muted)]">· {it.time}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-hairline-2)]" />
        </span>
      ))}
    </div>
  );
}

export default function PromoTicker() {
  return (
    <div
      className="relative z-40 overflow-hidden border-b border-[var(--color-hairline)] bg-white"
      role="region"
      aria-label="Najnowsze promocje — strumień live"
    >
      <div className="flex h-9 items-center">
        {/* Left fade mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent"
        />
        {/* Right fade mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent"
        />

        {/* Label */}
        <div className="z-20 flex shrink-0 items-center gap-2 bg-white pl-4 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-brand)]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
          </span>
          Live
        </div>

        {/* Scrolling content (duplicated for seamless loop) */}
        <div className="ticker-scroll flex">
          <Row items={ITEMS} />
          <Row items={ITEMS} ariaHidden />
        </div>
      </div>
    </div>
  );
}
