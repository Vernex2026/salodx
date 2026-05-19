/* SaldoxGlassCard — transparent CSS glass shell. The color/light
   comes from a SECTION-WIDE iridescent background (FlowingLightBackground
   video) sitting underneath the whole offer-cards grid, NOT from a
   per-card layer. The card is a thin transparent pane that refracts
   whatever's behind it via .offer-card's backdrop-filter.

   Currently only the "offer" variant is implemented. Other variants
   pass children through unchanged for future migration. */

const cn = (...args) => args.filter(Boolean).join(" ");

export default function SaldoxGlassCard({
  variant = "offer",
  children,
  className,
  bank,
  topBadge = false,
}) {
  if (variant !== "offer") {
    return <div className={className}>{children}</div>;
  }
  return (
    <div
      className={cn(
        "card-with-bg relative",
        topBadge && "shadow-[0_0_64px_rgba(212,165,116,0.18)]",
        className
      )}
    >
      <article className="offer-card" data-bank={bank}>
        {children}
      </article>
    </div>
  );
}
