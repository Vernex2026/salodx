import { useRef } from "react";
import { useTilt3D } from "../hooks/useTilt3D";
import BankLogo from "./BankLogo";

/**
 * HeroCardStack — three offer cards arranged in an isometric stack.
 * CSS-only 3D (no R3F). Whole stack tilts on cursor via useTilt3D.
 *
 * Layout (from back to front):
 *   - Card 1 (Santander, 300 zł):  translate(-22%, -8%)  rotate(-7°)  scale(0.85)  z 1
 *   - Card 2 (mBank, 500 zł):      centre                rotate(0°)   scale(1.00)  z 3
 *   - Card 3 (ING, 450 zł):        translate(+22%, +12%) rotate(+6°)  scale(0.92)  z 2
 */
export default function HeroCardStack() {
  const stackRef = useRef(null);
  const stackInnerRef = useRef(null);
  useTilt3D(stackInnerRef, { triggerRef: stackRef, maxDeg: 6, lerp: 0.08 });

  return (
    <div
      ref={stackRef}
      className="relative w-full"
      style={{
        aspectRatio: "1 / 1",
        perspective: "1400px",
      }}
    >
      <div
        ref={stackInnerRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Card 1 — Santander (back, left, tilted left) */}
        <OfferCard
          bank="Santander"
          accent="#DC2626"
          product="Konto Jakie Chcę"
          bonus="300"
          extra="+ 200 zł cashback Allegro"
          requirements={["Zgoda na marketing", "1 transakcja BLIK-iem"]}
          days={2}
          minutesAgo={28}
          tone="dim"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(280px, 64%)",
            transform: "translate(-50%, -50%) translate(-30%, -14%) rotate(-7deg) scale(0.86)",
            zIndex: 1,
            opacity: 0.92,
          }}
        />

        {/* Card 3 — ING (front, right, tilted right) */}
        <OfferCard
          bank="ING"
          accent="#F97316"
          product="Konto Direct"
          bonus="450"
          extra="+ 4% na koncie oszczędnościowym"
          requirements={["Wpływ ≥ 2 000 zł × 2 m-ce", "Aktywacja Moje ING"]}
          days={30}
          minutesAgo={42}
          tone="dim"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(280px, 64%)",
            transform: "translate(-50%, -50%) translate(28%, 18%) rotate(7deg) scale(0.90)",
            zIndex: 2,
            opacity: 0.96,
          }}
        />

        {/* Card 2 — mBank (centre, hero) */}
        <OfferCard
          bank="mBank"
          accent="#E11D48"
          product="Konto Intensive"
          bonus="500"
          extra="+ zwrot 1%"
          requirements={[
            { label: "Wpływ ≥ 1 500 zł / m-c", bold: "1 500 zł" },
            { label: "5 transakcji kartą", bold: "5" },
          ]}
          days={14}
          minutesAgo={12}
          tone="bright"
          featured
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(320px, 72%)",
            transform: "translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}

/* ── OfferCard — solid stark surface, sharp shadows, no blur ─── */
function OfferCard({
  bank,
  accent,
  product,
  bonus,
  extra,
  requirements = [],
  days,
  minutesAgo,
  tone = "bright",
  featured = false,
  style,
}) {
  return (
    <article
      className="card-stark"
      style={{
        ...style,
        padding: "22px",
        boxShadow: featured
          ? "0 2px 4px rgba(0,0,0,0.45), 0 40px 80px -16px rgba(0,0,0,0.70)"
          : "0 1px 2px rgba(0,0,0,0.40), 0 24px 56px -16px rgba(0,0,0,0.55)",
      }}
    >
      {/* Bank-color top strip — solid 2px line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "20px",
          right: "20px",
          height: "2px",
          background: accent,
        }}
      />

      {/* Header — logo + name + live pill */}
      <header className="flex items-center gap-3">
        <BankLogo bank={bank} size={36} />
        <div className="flex-1 leading-tight">
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-white">
            {bank}
          </h3>
          <span className="text-[12px] text-white/55">{product}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-2 py-1 text-[10.5px] font-medium text-white/75">
          <span className="live-dot" aria-hidden="true" />
          {minutesAgo} min
        </span>
      </header>

      {/* Bonus block */}
      <div className="mt-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Bonus powitalny
        </div>
        <p className="mt-1.5 flex items-baseline gap-1">
          <span
            className="font-display numeric text-white"
            style={{
              fontSize: featured ? "4.6rem" : "3.4rem",
              lineHeight: "1",
              letterSpacing: "-0.055em",
              fontWeight: 700,
            }}
          >
            {bonus}
          </span>
          <span
            className="font-display text-white/55"
            style={{ fontSize: featured ? "1.4rem" : "1.1rem", fontWeight: 600, letterSpacing: "-0.03em" }}
          >
            zł
          </span>
        </p>
        {extra && (
          <span className="mt-2 inline-block rounded-full border border-white/14 bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium text-white/75">
            {extra}
          </span>
        )}
      </div>

      {/* Requirements list */}
      {requirements.length > 0 && (
        <ul className="mt-5 space-y-1.5 text-[12.5px] text-white/65">
          {requirements.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-live)" }}
              >
                <path
                  d="M3 7.5l2.5 2.5 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {typeof r === "string" ? (
                <span>{r}</span>
              ) : (
                <span>
                  {r.label.split(r.bold).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <span className="numeric font-semibold text-white">
                          {r.bold}
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Footer — deadline + Sprawdź CTA */}
      <footer className="mt-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Do końca
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span
              className="font-display numeric text-white"
              style={{ fontSize: "1.5rem", letterSpacing: "-0.04em", fontWeight: 700 }}
            >
              {days}
            </span>
            <span className="text-[11.5px] text-white/55">dni</span>
          </div>
        </div>
        <button
          type="button"
          className="cta-primary cta-primary--light"
          style={{
            padding: "10px 18px",
            fontSize: "12.5px",
          }}
        >
          Sprawdź
          <svg
            aria-hidden="true"
            width="11"
            height="11"
            viewBox="0 0 12 12"
            className="arrow"
          >
            <path
              d="M2.5 6h7M6 2.5L9.5 6 6 9.5"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </footer>
    </article>
  );
}
