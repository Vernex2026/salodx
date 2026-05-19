import { useRef } from "react";
import { useTilt3D } from "../hooks/useTilt3D";
import BankLogo from "./BankLogo";

/**
 * HeroCardCarousel — five bank-offer cards arranged on a Y-axis 3D
 * cylinder (radius 420px, 72° spacing). Whole carousel rotates
 * continuously at 28s/360°. Each card has front + back + 4 edge strips
 * so the user sees real card thickness as it rotates through 90° / 270°.
 * Back face is Saldox-branded (subtle storytelling: every offer flows
 * through us).
 *
 * Hover the carousel → rotation pauses smoothly.
 * Hover a single card → that card pulls forward (+40px translateZ).
 * Cursor on scene → whole scene tilts subtly via useTilt3D (±4°).
 *
 * Mobile (≤768px) and prefers-reduced-motion: locked, single mBank card
 * shown centred — no spin, no dizzy.
 */

const CARDS = [
  {
    bank: "mBank",
    accent: "#E11D48",
    product: "Konto Intensive",
    bonus: "500",
    extra: "+ zwrot 1%",
    requirements: ["Wpływ ≥ 1 500 zł / m-c", "5 transakcji kartą"],
    days: 14,
    minutesAgo: 12,
    hero: true,
  },
  {
    bank: "Santander",
    accent: "#DC2626",
    product: "Konto Jakie Chcę",
    bonus: "300",
    extra: "+ 200 zł cashback",
    requirements: ["Zgoda na marketing", "1 transakcja BLIK-iem"],
    days: 2,
    minutesAgo: 28,
  },
  {
    bank: "ING",
    accent: "#F97316",
    product: "Konto Direct",
    bonus: "450",
    extra: "+ 4% oszczędności",
    requirements: ["Wpływ ≥ 2 000 zł × 2 m-ce", "Aktywacja Moje ING"],
    days: 30,
    minutesAgo: 42,
  },
  {
    bank: "PKO",
    accent: "#1E40AF",
    product: "Konto bez Granic",
    bonus: "400",
    extra: "+ 3% lokata 6 m-cy",
    requirements: ["Wpływ ≥ 1 200 zł / m-c", "Aktywacja IKO"],
    days: 21,
    minutesAgo: 56,
  },
  {
    bank: "Pekao",
    accent: "#B91C1C",
    product: "Konto Przekorzystne",
    bonus: "350",
    extra: "+ zwrot za rachunki",
    requirements: ["Wpływ ≥ 1 500 zł / m-c", "3 transakcje BLIK"],
    days: 7,
    minutesAgo: 8,
  },
];

export default function HeroCardCarousel() {
  const wrapRef = useRef(null);
  const tiltRef = useRef(null);
  useTilt3D(tiltRef, { triggerRef: wrapRef, maxDeg: 4, lerp: 0.06 });

  return (
    <div
      ref={wrapRef}
      className="carousel-3d-wrap relative mx-auto w-full"
      style={{
        aspectRatio: "1 / 1.1",
        perspective: "1600px",
      }}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <div className="carousel-3d">
          {CARDS.map((card, i) => (
            <Card3D
              key={card.bank}
              card={card}
              angle={(i / CARDS.length) * 360}
            />
          ))}
        </div>
        <div className="carousel-spotlight" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ── Card3D — 6-face box, real thickness ─────────────────────── */
function Card3D({ card, angle }) {
  const { bank, accent, hero } = card;
  return (
    <div
      className={`card-3d${hero ? " card-3d--hero" : ""}`}
      style={{ "--card-angle": `${angle}deg` }}
    >
      {/* Four edge strips — physical thickness */}
      <span className="card-3d__edge card-3d__edge--top" aria-hidden="true" />
      <span className="card-3d__edge card-3d__edge--bottom" aria-hidden="true" />
      <span className="card-3d__edge card-3d__edge--left" aria-hidden="true" />
      <span className="card-3d__edge card-3d__edge--right" aria-hidden="true" />

      <div className="card-3d__face card-3d__front">
        <CardFront card={card} />
      </div>
      <div className="card-3d__face card-3d__back">
        <CardBack bank={bank} accent={accent} />
      </div>
    </div>
  );
}

/* ── Front face — offer info ─────────────────────────────────── */
function CardFront({ card }) {
  const { bank, accent, product, bonus, extra, requirements, days, minutesAgo } = card;
  return (
    <div className="relative flex h-full w-full flex-col p-6">
      {/* Bank-color top accent strip */}
      <div
        aria-hidden="true"
        className="absolute left-6 right-6 top-0 h-[2px]"
        style={{ background: accent }}
      />

      {/* Header */}
      <header className="flex items-center gap-2.5">
        <BankLogo bank={bank} size={32} />
        <div className="flex-1 leading-tight">
          <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-white">
            {bank}
          </h3>
          <span className="text-[11px] text-white/55">{product}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 px-2 py-0.5 text-[10px] font-medium text-white/75">
          <span className="live-dot" aria-hidden="true" />
          {minutesAgo} min
        </span>
      </header>

      {/* Bonus */}
      <div className="mt-5">
        <div className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Bonus powitalny
        </div>
        <p className="mt-1 flex items-baseline gap-1">
          <span
            className="font-display numeric text-white"
            style={{
              fontSize: "3.6rem",
              lineHeight: "1",
              letterSpacing: "-0.055em",
              fontWeight: 700,
            }}
          >
            {bonus}
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
        {extra && (
          <span className="mt-1.5 inline-block rounded-full border border-white/14 px-2 py-0.5 text-[10px] font-medium text-white/75">
            {extra}
          </span>
        )}
      </div>

      {/* Requirements */}
      <ul className="mt-4 space-y-1 text-[11.5px] text-white/65">
        {requirements.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg
              aria-hidden="true"
              width="12"
              height="12"
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
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {/* Footer — deadline + Sprawdź */}
      <footer className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Do końca
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span
              className="font-display numeric text-white"
              style={{
                fontSize: "1.35rem",
                letterSpacing: "-0.04em",
                fontWeight: 700,
              }}
            >
              {days}
            </span>
            <span className="text-[10.5px] text-white/55">dni</span>
          </div>
        </div>
        <button
          type="button"
          className="cta-primary cta-primary--light"
          style={{ padding: "8px 14px", fontSize: "11.5px" }}
        >
          Sprawdź
          <svg
            aria-hidden="true"
            width="10"
            height="10"
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
    </div>
  );
}

/* ── Back face — Saldox brand + faux card back chrome ──────── */
function CardBack({ bank, accent }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Magnetic stripe — solid dark band, 48px high */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-7 h-12"
        style={{ background: "#06070B" }}
      />

      {/* Saldox monogram + wordmark — centred */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px]"
          style={{ background: "var(--color-white)" }}
        >
          <span
            className="font-display text-[28px] font-bold text-[var(--color-black)]"
            style={{ letterSpacing: "-0.05em" }}
          >
            S
          </span>
        </span>
        <span
          className="font-display text-[18px] font-bold tracking-[-0.04em] text-white"
        >
          Saldox
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
          oferta przez Saldox
        </span>
      </div>

      {/* Bank accent dot — small brand reminder bottom-right */}
      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[9px] text-white/35">
        <span className="font-mono tracking-[0.14em]">saldox.pl</span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: accent }}
          />
          <span className="font-mono tracking-[0.14em] uppercase">{bank}</span>
        </span>
      </div>
    </div>
  );
}
