/* SaldoxGlassCard — transparent CSS glass shell + iridescent sibling
   underneath. The card itself carries no color (per owner spec); all
   color/light comes from the iridescent element behind it, refracted
   through the card's backdrop-filter blur. Plus a 1px bank-tinted
   top accent line and a 1px white shine line right above it.

   Currently only the "offer" variant is implemented. hero / menu /
   testimonial / ctaShell are placeholder pass-throughs for future
   migration.

   PNG swap-in path: when /public/decorative/iridescent-shape-*.png
   assets land, pass `iridescentSrc` and we render an <img> behind
   the card instead of the CSS gradient placeholder. */

const cn = (...args) => args.filter(Boolean).join(" ");

export default function SaldoxGlassCard({
  variant = "offer",
  children,
  className,
  bank,
  topBadge = false,
  iridescentSrc,
}) {
  if (variant !== "offer") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "card-wrapper relative",
        topBadge && "shadow-[0_0_64px_rgba(212,165,116,0.18)]",
        className
      )}
    >
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-[24px]"
        aria-hidden="true"
      >
        {iridescentSrc ? (
          <img
            src={iridescentSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
            style={{ filter: "blur(12px) saturate(140%)" }}
          />
        ) : (
          <div className="iridescent-bg-placeholder absolute inset-0" />
        )}
      </div>
      <article className="offer-card" data-bank={bank}>
        {children}
      </article>
    </div>
  );
}
