/* SaldoxGlassCard — transparent CSS glass shell + iridescent 3D shape
   sibling underneath. The card itself carries no color (per owner
   spec); all color/light comes from the iridescent shape behind it,
   which is sharp (no pre-blur — the card's backdrop-filter does its
   own work) and drifts slowly via the `driftShape` keyframes.

   The shape lives in <div className="absolute -inset-4 -z-10"> so it
   bleeds 16px past the card on every side — that overflow visible
   outside the glass is the "3D object peeking" effect from the
   reference (David Denver / glass-morphism templates).

   PNG assets: drop `iridescent-shape-{1,2,3}.png` into
   /public/decorative/. mBank → 1 (organic ribbon),
   Santander → 2 (twisted form), ING → 3 (sphere/blob).
   While files are missing the <img> onError hides itself and the
   CSS .iridescent-bg-placeholder shows through underneath so the
   layout still reads.

   Currently only the "offer" variant is implemented. */

const cn = (...args) => args.filter(Boolean).join(" ");

export default function SaldoxGlassCard({
  variant = "offer",
  children,
  className,
  bank,
  topBadge = false,
  iridescentShape = 1, // 1 | 2 | 3 → /decorative/iridescent-shape-N.png
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
      <div
        className="pointer-events-none absolute -inset-4 -z-10"
        aria-hidden="true"
      >
        {/* CSS placeholder — visible until/unless the PNG loads */}
        <div className="iridescent-bg-placeholder absolute inset-0" />
        {/* Real 3D iridescent shape — bleeds past the card. Hides
            itself via onError if the asset is missing. */}
        <img
          src={`/decorative/iridescent-shape-${iridescentShape}.png`}
          alt=""
          className="absolute inset-0 h-full w-full object-contain opacity-100"
          style={{
            filter: "blur(0px) saturate(140%) brightness(110%)",
            animation: "driftShape 24s ease-in-out infinite",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <article className="offer-card" data-bank={bank}>
        {children}
      </article>
    </div>
  );
}
