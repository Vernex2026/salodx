import { useReveal } from "../hooks/useReveal";
import BankLogo from "./BankLogo";

const OFFERS = [
  {
    bank: "mBank",
    product: "Konto Intensive",
    bonus: 500,
    extra: "+ zwrot 1% za zakupy",
    days: 14,
    requirements: [
      "Wpływ ≥ 1 500 zł / m-c",
      "5 transakcji kartą",
    ],
    accent: "#E11D48",
    badge: "TOP TYGODNIA",
    featured: true,
  },
  {
    bank: "Santander",
    product: "Konto Jakie Chcę",
    bonus: 300,
    extra: "+ 200 zł cashback Allegro",
    days: 2,
    urgent: true,
    requirements: [
      "Zgoda na marketing",
      "1 transakcja BLIK-iem",
    ],
    accent: "#DC2626",
  },
  {
    bank: "ING",
    product: "Konto Direct",
    bonus: 450,
    extra: "+ 4% na koncie oszczędnościowym",
    days: 30,
    requirements: [
      "Wpływ ≥ 2 000 zł × 2 m-ce",
      "Aktywacja Moje ING",
    ],
    accent: "#F97316",
  },
];

export default function TopPromos() {
  return (
    <section
      id="promocje"
      aria-labelledby="top-offers-heading"
      className="bg-onyx-mesh bg-grain relative isolate overflow-hidden"
    >
      {/* Decorative electric bloom — violet haze top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 z-0 h-[480px] w-[480px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(123,92,255,0.38) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Companion electric-blue bloom bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 z-0 h-[420px] w-[420px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(closest-side, rgba(77,124,255,0.30) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        {/* Header */}
        <SectionHeader>
          <div className="eyebrow text-white/40">Najgorętsze w tym tygodniu</div>
          <h2
            id="top-offers-heading"
            className="font-display mt-4 text-white"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: "1.02",
              letterSpacing: "-0.025em",
            }}
          >
            <span className="italic">3 oferty.</span>{" "}
            <span>3 deadliny.</span>
            <br className="hidden sm:inline" />{" "}
            <span className="text-white/70">Wszystko czego potrzebujesz.</span>
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
            className="group inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-[14px] font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
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
  const { bank, product, bonus, extra, days, requirements, accent, badge, featured, urgent } = offer;

  return (
    <li
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} group relative`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      <article
        className={`relative overflow-hidden rounded-[20px] border p-7 transition-all duration-500 hover:-translate-y-1 ${
          featured
            ? "border-[rgba(212,165,116,0.32)] bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
            : "border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.01] hover:border-white/16"
        }`}
        style={{
          boxShadow: featured
            ? "inset 0 0 0 1px rgba(212,165,116,0.16), 0 24px 56px -16px rgba(212,165,116,0.18)"
            : "inset 0 0 0 1px rgba(255,255,255,0.03), 0 16px 40px -16px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top accent line — bank color */}
        <div
          aria-hidden="true"
          className="absolute left-7 right-7 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0.55,
          }}
        />

        {/* Featured glow — radial behind number */}
        {featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-20 z-0 h-48 w-48 rounded-full opacity-40"
            style={{
              background: `radial-gradient(closest-side, ${accent}55 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        )}

        {/* Featured badge */}
        {badge && (
          <div className="relative mb-6 inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,165,116,0.32)] bg-[rgba(212,165,116,0.08)] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--color-gold)]">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M6 1l1.2 3.6L11 5l-3 2.5.8 3.5L6 9l-2.8 2 .8-3.5L1 5l3.8-.4L6 1z"
                fill="currentColor"
              />
            </svg>
            {badge}
          </div>
        )}

        {/* Urgent badge — electric cyan (not gold-reserved, not coral-banned) */}
        {urgent && !badge && (
          <div className="relative mb-6 inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,229,255,0.32)] bg-[rgba(0,229,255,0.10)] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--plasma-cyan)]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--plasma-cyan)]"
              style={{ boxShadow: "0 0 8px rgba(0,229,255,0.7)" }}
            />
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

        {/* Bonus amount */}
        <div className="relative mt-7">
          <div className="eyebrow text-white/40">Bonus powitalny</div>
          <p className="mt-2 flex items-baseline gap-2">
            <span
              className="font-display italic numeric text-white"
              style={{
                fontSize: featured ? "6rem" : "5rem",
                lineHeight: "0.95",
                letterSpacing: "-0.04em",
              }}
            >
              {bonus}
            </span>
            <span
              className="font-display italic text-white/55"
              style={{ fontSize: "1.4rem" }}
            >
              zł
            </span>
          </p>
          <span
            className="mt-2 inline-block rounded-full bg-white/[0.06] px-3 py-1 text-[11.5px] font-medium text-white/70"
          >
            {extra}
          </span>
        </div>

        {/* Requirements */}
        <ul className="relative mt-6 space-y-1.5 text-[13px] text-white/60">
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

        {/* Footer — deadline + CTA */}
        <footer className="relative mt-7 flex items-end justify-between gap-4 border-t border-white/8 pt-5">
          <div>
            <div className="eyebrow text-white/35">Do końca</div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className="font-display italic numeric text-white"
                style={{ fontSize: "1.65rem", letterSpacing: "-0.02em" }}
              >
                {days}
              </span>
              <span className="text-[13px] text-white/55">dni</span>
            </div>
          </div>
          <button
            type="button"
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-105"
          >
            Sprawdź
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 14 14"
              className="transition-transform group-hover/btn:translate-x-0.5"
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
      </article>
    </li>
  );
}
