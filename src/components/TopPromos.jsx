import { useReveal } from "../hooks/useReveal";
import BankLogo from "./BankLogo";
import SaldoxGlassCard from "./ui/SaldoxGlassCard";
import FlowingLightBackground from "./decorative/FlowingLightBackground";

const OFFERS = [
  {
    bank: "mBank",
    bankKey: "mbank",
    product: "Konto Intensive",
    bonus: 500,
    extra: "+ zwrot 1% za zakupy",
    days: 14,
    requirements: [
      "Wpływ ≥ 1 500 zł / m-c",
      "5 transakcji kartą",
    ],
    accent: "#FF1E2F",
    badge: "TOP TYGODNIA",
    featured: true,
  },
  {
    bank: "Santander",
    bankKey: "santander",
    product: "Konto Jakie Chcę",
    bonus: 300,
    extra: "+ 200 zł cashback Allegro",
    days: 2,
    urgent: true,
    requirements: [
      "Zgoda na marketing",
      "1 transakcja BLIK-iem",
    ],
    accent: "#00C896",
  },
  {
    bank: "ING",
    bankKey: "ing",
    product: "Konto Direct",
    bonus: 450,
    extra: "+ 4% na koncie oszczędnościowym",
    days: 30,
    requirements: [
      "Wpływ ≥ 2 000 zł × 2 m-ce",
      "Aktywacja Moje ING",
    ],
    accent: "#FF6600",
  },
];

export default function TopPromos() {
  return (
    <section
      id="promocje"
      aria-labelledby="top-offers-heading"
      className="section-atmosphere-promos relative isolate overflow-hidden"
      style={{ background: "var(--color-black)" }}
    >
      <FlowingLightBackground opacity={0.85} blendMode="screen" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        {/* Header */}
        <SectionHeader>
          <div className="eyebrow text-white/40">Najgorętsze w tym tygodniu</div>
          <h2
            id="top-offers-heading"
            className="font-display mt-4 text-white"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: "0.94",
              letterSpacing: "-0.06em",
              fontWeight: 700,
            }}
          >
            <span>3 oferty. 3 deadliny.</span>
            <br className="hidden sm:inline" />{" "}
            <span className="text-white/55">Wszystko czego potrzebujesz.</span>
          </h2>
          <p
            className="mt-6 max-w-xl text-[16px] leading-[1.55] text-white/55 sm:text-[17px]"
          >
            Codziennie sprawdzamy 24 banki. W tym tygodniu wybraliśmy te trzy —
            warte Twojego czasu, sprawdzone warunki, czytelne deadline'y.
          </p>
        </SectionHeader>

        {/* Cards grid */}
        <ul
          role="list"
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6"
        >
          {OFFERS.map((offer, i) => (
            <OfferCard key={offer.bank} offer={offer} delay={i * 110} />
          ))}
        </ul>

        {/* See all link */}
        <div className="mt-14 flex justify-center">
          <a
            href="#all-offers"
            className="group inline-flex items-center gap-2 rounded-full border border-white/16 bg-transparent px-5 py-3 text-[14px] font-medium text-white transition-all hover:border-white/40 hover:bg-white/[0.04]"
          >
            Zobacz wszystkie 47 ofert
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ children }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} max-w-3xl`}
    >
      {children}
    </div>
  );
}

function OfferCard({ offer, delay = 0 }) {
  const [ref, visible] = useReveal({ threshold: 0.15 });
  const { bank, bankKey, product, bonus, extra, days, requirements, badge, featured, urgent } = offer;

  return (
    <li
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} group relative`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      <SaldoxGlassCard
        variant="offer"
        bank={bankKey}
        topBadge={!!badge}
      >
        <div className="relative flex flex-col">
          {/* Featured badge — gold */}
          {badge && (
            <div className="relative mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgba(212,165,116,0.42)] bg-[rgba(212,165,116,0.06)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M6 1l1.2 3.6L11 5l-3 2.5.8 3.5L6 9l-2.8 2 .8-3.5L1 5l3.8-.4L6 1z"
                  fill="currentColor"
                />
              </svg>
              {badge}
            </div>
          )}

          {/* Urgent badge */}
          {urgent && !badge && (
            <div className="relative mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/24 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white">
              <span className="live-dot" aria-hidden="true" />
              Kończy się
            </div>
          )}

          {/* Header */}
          <header className="relative flex items-center gap-3">
            <BankLogo bank={bank} size={40} />
            <div className="leading-tight">
              <h3 className="font-sans text-[15px] font-semibold tracking-[-0.01em] text-white">
                {bank}
              </h3>
              <span className="text-[12.5px] text-white/45">{product}</span>
            </div>
          </header>

          {/* Bonus amount — Instrument Serif italic per owner spec */}
          <div className="relative mt-7">
            <div className="eyebrow text-white/40">Bonus powitalny</div>
            <p className="mt-2 flex items-baseline gap-2">
              <span
                className="numeric text-white"
                style={{
                  fontFamily: "'Instrument Serif', 'Geist', serif",
                  fontStyle: "italic",
                  fontSize: featured ? "6.25rem" : "5.25rem",
                  lineHeight: "0.92",
                  letterSpacing: "-0.02em",
                  fontWeight: 400,
                }}
              >
                {bonus}
              </span>
              <span
                className="text-white/55"
                style={{
                  fontFamily: "'Instrument Serif', 'Geist', serif",
                  fontStyle: "italic",
                  fontSize: "1.6rem",
                  fontWeight: 400,
                }}
              >
                zł
              </span>
            </p>
            <span className="mt-3 inline-block rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11.5px] font-medium text-white/75">
              {extra}
            </span>
          </div>

          {/* Requirements */}
          <ul className="relative mt-6 space-y-1.5 text-[13px] text-white/65">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="mt-0.5 shrink-0 text-[var(--mint-live)]"
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
                {r}
              </li>
            ))}
          </ul>

          {/* Footer — deadline + CTA (glass pill with text per spec) */}
          <footer className="relative mt-7 flex items-end justify-between gap-4 border-t border-white/8 pt-5">
            <div>
              <div className="eyebrow text-white/35">Do końca</div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span
                  className="numeric text-white"
                  style={{
                    fontFamily: "'Instrument Serif', 'Geist', serif",
                    fontStyle: "italic",
                    fontSize: "1.85rem",
                    letterSpacing: "-0.01em",
                    fontWeight: 400,
                  }}
                >
                  {days}
                </span>
                <span className="text-[13px] text-white/55">dni</span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/16 bg-white/[0.08] px-4 py-2 text-[13px] font-medium text-white transition-all hover:border-white/24 hover:bg-white/[0.12]"
            >
              Sprawdź
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 14 14"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </footer>
        </div>
      </SaldoxGlassCard>
    </li>
  );
}
