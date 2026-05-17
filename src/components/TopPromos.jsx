import { useEffect, useMemo, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";

/* (useReveal still used przez FeaturedPromoCard popularity counter) */

const PROMOS = [
  {
    id: 1,
    bank: "mBank",
    bankInitials: "mB",
    bankGradient: "linear-gradient(135deg,#e11d48,#be123c)",
    product: "Konto Intensive",
    category: "Konta osobiste",
    bonus: "500",
    extras: "+ zwrot 1% za zakupy",
    deadline: "31 maja 2026",
    daysLeft: 15,
    urgent: false,
    requirements: [
      "Wpływ ≥ 1 500 zł / miesiąc przez 3 miesiące",
      "5 transakcji kartą miesięcznie",
      "Aktywacja BLIK-a w pierwszym tygodniu",
    ],
    updatedAt: "dziś, 06:32",
    popularity: 217,
  },
  {
    id: 2,
    bank: "Santander",
    bankInitials: "Sa",
    bankGradient: "linear-gradient(135deg,#dc2626,#991b1b)",
    product: "Konto Jakie Chcę",
    category: "Konta osobiste",
    bonus: "300",
    extras: "+ 200 zł cashback Allegro",
    deadline: "18 maja 2026",
    daysLeft: 2,
    urgent: true,
    requirements: [
      "Zgoda na komunikację marketingową",
      "1 transakcja BLIK-iem w pierwszym miesiącu",
    ],
    updatedAt: "wczoraj, 22:14",
  },
  {
    id: 3,
    bank: "ING",
    bankInitials: "I",
    bankGradient: "linear-gradient(135deg,#f97316,#ea580c)",
    product: "Konto Direct",
    category: "Konta osobiste",
    bonus: "400",
    extras: "+ 4% na koncie oszczędnościowym",
    deadline: "30 czerwca 2026",
    daysLeft: 45,
    urgent: false,
    requirements: [
      "Wpływ ≥ 2 000 zł przez 2 kolejne miesiące",
      "Aktywacja aplikacji Moje ING",
    ],
    updatedAt: "dziś, 08:15",
  },
  {
    id: 4,
    bank: "Pekao",
    bankInitials: "Pe",
    bankGradient: "linear-gradient(135deg,#dc2626,#7f1d1d)",
    product: "Konto Przekorzystne",
    category: "Konta osobiste",
    bonus: "350",
    extras: "+ darmowe BLIK przez 12 m-cy",
    deadline: "15 czerwca 2026",
    daysLeft: 30,
    urgent: false,
    requirements: [
      "Wpływ ≥ 1 200 zł / miesiąc",
      "3 transakcje kartą",
    ],
    updatedAt: "dziś, 04:21",
  },
  {
    id: 5,
    bank: "Alior",
    bankInitials: "Al",
    bankGradient: "linear-gradient(135deg,#16a34a,#15803d)",
    product: "Karta Wyboru",
    category: "Karty",
    bonus: "450",
    extras: "+ 3% moneyback na paliwo",
    deadline: "20 czerwca 2026",
    daysLeft: 35,
    urgent: false,
    requirements: [
      "Transakcje kartą ≥ 500 zł / m-c",
      "Brak rezygnacji przez 6 m-cy",
    ],
    updatedAt: "wczoraj, 18:45",
  },
  {
    id: 6,
    bank: "Citi Handlowy",
    bankInitials: "Ci",
    bankGradient: "linear-gradient(135deg,#0ea5e9,#0369a1)",
    product: "Konto SimplyOne",
    category: "Konta osobiste",
    bonus: "600",
    extras: "+ status premium na 6 m-cy",
    deadline: "10 lipca 2026",
    daysLeft: 55,
    urgent: false,
    requirements: [
      "Wpływ ≥ 5 000 zł / miesiąc",
      "2 transakcje walutowe",
    ],
    updatedAt: "dziś, 09:02",
  },

  /* ── KARTY ─────────────────────────────────────────────── */
  {
    id: 7,
    bank: "Millennium",
    bankInitials: "Mi",
    bankGradient: "linear-gradient(135deg,#7c3aed,#5b21b6)",
    product: "Karta Impresja",
    category: "Karty",
    bonus: "250",
    extras: "+ 5% moneyback w e-commerce",
    deadline: "25 czerwca 2026",
    daysLeft: 40,
    urgent: false,
    requirements: [
      "Aktywacja w aplikacji",
      "Transakcje ≥ 300 zł / m-c przez 3 m-ce",
    ],
    updatedAt: "dziś, 11:18",
  },
  {
    id: 8,
    bank: "BNP Paribas",
    bankInitials: "BN",
    bankGradient: "linear-gradient(135deg,#16a34a,#166534)",
    product: "Karta Otwarta",
    category: "Karty",
    bonus: "380",
    extras: "+ darmowe wypłaty za granicą",
    deadline: "12 czerwca 2026",
    daysLeft: 27,
    urgent: false,
    requirements: [
      "Transakcje ≥ 1 000 zł / m-c",
      "Brak rezygnacji przez 12 m-cy",
    ],
    updatedAt: "wczoraj, 14:30",
  },

  /* ── LOKATY ────────────────────────────────────────────── */
  {
    id: 9,
    bank: "Toyota Bank",
    bankInitials: "To",
    bankGradient: "linear-gradient(135deg,#dc2626,#7f1d1d)",
    product: "Lokata Powitalna 12m",
    category: "Lokaty",
    bonus: "8,2%",
    extras: "Oprocentowanie stałe · do 50 000 zł",
    deadline: "31 maja 2026",
    daysLeft: 15,
    urgent: false,
    requirements: [
      "Pierwsza lokata w banku",
      "Wpłata ≥ 1 000 zł",
    ],
    updatedAt: "dziś, 05:44",
  },
  {
    id: 10,
    bank: "Aion Bank",
    bankInitials: "Ai",
    bankGradient: "linear-gradient(135deg,#0ea5e9,#0c4a6e)",
    product: "Lokata Mobilna 6m",
    category: "Lokaty",
    bonus: "7,5%",
    extras: "+ brak limitu kwoty",
    deadline: "20 czerwca 2026",
    daysLeft: 35,
    urgent: false,
    requirements: [
      "Konto Aion ≥ 30 dni",
      "Aktywacja w aplikacji",
    ],
    updatedAt: "wczoraj, 19:55",
  },
  {
    id: 11,
    bank: "Bank Pocztowy",
    bankInitials: "BP",
    bankGradient: "linear-gradient(135deg,#f59e0b,#b45309)",
    product: "Lokata Korzystna",
    category: "Lokaty",
    bonus: "7,8%",
    extras: "+ kapitalizacja miesięczna",
    deadline: "30 czerwca 2026",
    daysLeft: 45,
    urgent: false,
    requirements: [
      "Nowy klient banku",
      "Wpłata 5 000 – 100 000 zł",
    ],
    updatedAt: "dziś, 07:20",
  },

  /* ── POŻYCZKI ─────────────────────────────────────────── */
  {
    id: 12,
    bank: "NetCredit",
    bankInitials: "Ne",
    bankGradient: "linear-gradient(135deg,#16a34a,#15803d)",
    product: "Pożyczka 0% RRSO",
    category: "Pożyczki",
    bonus: "5 000 zł",
    extras: "Pierwsza pożyczka · 30 dni gratis",
    deadline: "31 maja 2026",
    daysLeft: 15,
    urgent: true,
    requirements: [
      "Wiek 21–70 lat",
      "Stały dochód udokumentowany",
    ],
    updatedAt: "dziś, 03:12",
  },
  {
    id: 13,
    bank: "Provident",
    bankInitials: "Pr",
    bankGradient: "linear-gradient(135deg,#dc2626,#7f1d1d)",
    product: "Pożyczka Domowa",
    category: "Pożyczki",
    bonus: "3 000 zł",
    extras: "Bez BIK · obsługa w domu",
    deadline: "15 czerwca 2026",
    daysLeft: 30,
    urgent: false,
    requirements: [
      "Dowolne źródło dochodu",
      "Wiek 18–80 lat",
    ],
    updatedAt: "dziś, 08:47",
  },
  {
    id: 14,
    bank: "Wonga",
    bankInitials: "Wo",
    bankGradient: "linear-gradient(135deg,#16a34a,#14532d)",
    product: "Chwilówka Express",
    category: "Pożyczki",
    bonus: "2 500 zł",
    extras: "30 dni za 0 zł · decyzja w 15 min",
    deadline: "10 czerwca 2026",
    daysLeft: 25,
    urgent: false,
    requirements: [
      "Konto bankowe w PL",
      "Weryfikacja przelewem 1 gr",
    ],
    updatedAt: "wczoraj, 21:33",
  },
];

const FILTERS = [
  { label: "Wszystkie", count: 47 },
  { label: "Konta osobiste", count: 18 },
  { label: "Karty", count: 9 },
  { label: "Lokaty", count: 12 },
  { label: "Pożyczki", count: 8 },
];

export default function TopPromos() {
  const [activeFilter, setActiveFilter] = useState("Wszystkie");
  const [expanded, setExpanded] = useState(false);
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });

  const filtered = useMemo(() => {
    if (activeFilter === "Wszystkie") return PROMOS;
    return PROMOS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const extra = rest.slice(2); // cards ukryte do momentu expand

  return (
    <section
      id="promocje"
      aria-labelledby="promos-heading"
      className="relative bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <header
          ref={headerRef}
          className={`reveal mx-auto max-w-3xl text-center ${headerVisible ? "is-visible" : ""}`}
          style={{ transitionDuration: "500ms" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Tygodniowy ranking
          </p>
          <h2
            id="promos-heading"
            className="font-display mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)] sm:text-5xl lg:text-[60px]"
          >
            Najlepsze promocje tego tygodnia.
          </h2>
          <p className="mx-auto mt-5 flex items-center justify-center gap-2 text-[15px] text-[var(--color-muted)] sm:text-[16px]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[var(--color-success)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
            </span>
            Zaktualizowane <span className="numeric font-medium text-[var(--color-text)]">2 min temu</span>
            <span aria-hidden="true" className="text-[var(--color-faint)]">·</span>
            Następna rewizja — niedziela <span className="numeric font-medium text-[var(--color-text)]">23:59</span>
          </p>
        </header>

        {/* Filter bar — INTERAKTYWNY */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filtruj promocje"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.label;
            return (
              <button
                key={f.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveFilter(f.label);
                  setExpanded(false);
                }}
                className={
                  isActive
                    ? "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-4 py-2 text-[13px] font-semibold text-white shadow-[var(--shadow-glow-soft)] transition-all duration-200"
                    : "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline-2)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-brand-border)] hover:bg-[var(--color-brand-tint)]/60 hover:text-[var(--color-brand)]"
                }
              >
                {f.label}
                <span className={isActive ? "numeric text-[11.5px] font-medium text-white/80" : "numeric text-[11.5px] font-medium text-[var(--color-faint)]"}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid: ZAWSZE compact (featured col-span-2 + 2 side cards). Reszta w collapse container poniżej. */}
        {filtered.length > 0 ? (
          <>
            <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
              {featured && (
                <div className="lg:col-span-2">
                  <FeaturedPromoCard promo={featured} />
                </div>
              )}
              <div className="grid gap-5 lg:gap-6">
                {rest.slice(0, 2).map((p, i) => (
                  <PromoCard key={p.id} promo={p} rank={i + 2} />
                ))}
              </div>
            </div>

            {/* Collapse container — CSS grid-rows transition (animuje real height bez JS) */}
            {extra.length > 0 && (
              <div
                className={
                  "expand-collapse grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1.2,0.36,1)] " +
                  (expanded ? "is-open mt-5 lg:mt-6" : "mt-0")
                }
                style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                aria-hidden={!expanded}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {extra.map((p, i) => (
                      <div
                        key={p.id}
                        className={expanded ? "expand-card-rise" : ""}
                        style={expanded ? { "--rise-delay": `${i * 60}ms` } : undefined}
                      >
                        <PromoCard promo={p} rank={i + 4} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-[var(--color-hairline-2)] bg-white p-10 text-center text-[14px] text-[var(--color-muted)]">
            Brak ofert w kategorii „{activeFilter}". Wróć za chwilę albo wybierz <button onClick={() => setActiveFilter("Wszystkie")} className="font-medium text-[var(--color-brand)] underline-offset-2 hover:underline">Wszystkie</button>.
          </div>
        )}

        {/* Expand toggle */}
        {extra.length > 0 && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-2)] bg-white px-5 py-3 text-[14px] font-medium text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-brand-border)] hover:bg-[var(--color-brand-tint)]/40 hover:text-[var(--color-brand)]"
            >
              {expanded ? "Pokaż mniej" : `Pokaż wszystkie 47 ofert`}
              <svg
                aria-hidden="true"
                width="14" height="14" viewBox="0 0 14 14"
                className={expanded ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300 group-hover:translate-y-0.5"}
              >
                <path d="M2.5 5l4.5 4.5L11.5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Featured #1 — ciemna karta z mesh gradient ───────────── */
function FeaturedPromoCard({ promo }) {
  const [popRef, popVisible] = useReveal({ threshold: 0.3 });
  const [tickBoost, setTickBoost] = useState(0);
  const [tickPulse, setTickPulse] = useState(false);
  const popularityCount = useCountUp((promo.popularity || 0) + tickBoost, { duration: 1600, when: popVisible });

  // Real-time popularity ticker — co 8-12s +1 (random), z subtelnym pulse
  useEffect(() => {
    if (!popVisible) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timeoutId;
    const tick = () => {
      const delay = 8000 + Math.random() * 4000; // 8–12s
      timeoutId = setTimeout(() => {
        setTickBoost((b) => b + 1);
        setTickPulse(true);
        setTimeout(() => setTickPulse(false), 600);
        tick();
      }, delay);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [popVisible]);

  return (
    <article
      ref={popRef}
      className="lift mesh-featured reveal is-visible relative h-full overflow-hidden rounded-[28px] p-8 text-white sm:p-10"
      style={{ boxShadow: "var(--shadow-dark-card)" }}
      aria-label={`${promo.bank} — ${promo.product}, bonus ${promo.bonus} zł, top tygodnia`}
    >
      {/* Top: badges row */}
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-bright)] ring-1 ring-[var(--color-brand)]/30">
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
            <path d="M5.5.5l1.4 3.4 3.6.3-2.7 2.4.8 3.5L5.5 8l-3.1 2.1.8-3.5L.5 4.2l3.6-.3L5.5.5z"/>
          </svg>
          Top tygodnia
        </span>
        <span className="numeric text-[11px] font-semibold text-white/40">01</span>
      </div>

      <div className="relative mt-7 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
        {/* Left: bank + bonus + requirements */}
        <div>
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ background: promo.bankGradient, boxShadow: "0 4px 12px rgba(225,29,72,0.35)" }}
            >
              <span className="font-display text-[16px] font-semibold tracking-[-0.02em]">{promo.bankInitials}</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[18px] font-semibold tracking-[-0.02em] text-white">{promo.bank}</div>
              <div className="text-[13.5px] text-white/60">{promo.product}</div>
            </div>
          </div>

          <div className="mt-7">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-bright)]">
              Bonus powitalny
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display numeric text-[76px] font-semibold leading-none tracking-[-0.05em] text-[var(--color-brand-bright)] sm:text-[88px]">
                {promo.bonus}
              </span>
              <span className="font-display text-[32px] font-medium tracking-[-0.02em] text-[var(--color-brand-bright)]/75">zł</span>
            </div>
            <div className="mt-2 text-[14px] text-white/70">{promo.extras}</div>
          </div>

          <ul role="list" className="mt-7 space-y-2.5 text-[14px] text-white/85">
            {promo.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                {/* Soft mint — niższa saturation, wyższa luminance — nie wibruje na granacie */}
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0" style={{ color: "#7dd3a8" }}>
                  <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: deadline up, CTA + popularity bottom — wyrównane na dole z luką */}
        <div className="flex flex-col justify-between gap-6 lg:items-end">
          <div className="lg:text-right">
            <div className="text-[11px] uppercase tracking-[0.12em] text-white/40">Deadline</div>
            <div className="mt-1 font-display numeric text-[18px] font-semibold tracking-[-0.02em] text-white">
              {promo.deadline}
            </div>
            <div className="numeric mt-0.5 text-[13px] text-white/60">
              jeszcze <span className="font-medium text-white">{promo.daysLeft} dni</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href={`#promo-${promo.id}`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[14.5px] font-semibold text-[var(--color-ink)] shadow-[0_8px_24px_rgba(255,255,255,0.20)] transition-all duration-200 hover:bg-white/95 hover:shadow-[0_12px_32px_rgba(255,255,255,0.28)]"
            >
              Sprawdź ofertę
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {promo.popularity && (
              <div className="flex items-center gap-1.5 text-[12.5px] text-white/55">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 13 13" className="text-[var(--color-warning)]">
                  <path d="M6.5.5C5 3 3 3.5 3 6.5c0 2 1.6 4 3.5 4S10 8.5 10 6.5C10 4 8 3 6.5.5z" fill="currentColor"/>
                </svg>
                <span
                  className={
                    "numeric inline-block font-medium transition-all duration-500 " +
                    (tickPulse ? "scale-110 text-white" : "scale-100 text-white/80")
                  }
                  style={{ transformOrigin: "left center" }}
                >
                  {popularityCount}
                </span>
                <span>osób sprawdzało dziś</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live update micro-row */}
      <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-[11.5px] text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full" style={{ background: "#7dd3a8" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "#7dd3a8" }} />
          </span>
          Aktualizacja: <span className="numeric">{promo.updatedAt}</span>
        </span>
        <span className="numeric">ID #{String(promo.id).padStart(4, "0")}</span>
      </div>
    </article>
  );
}

/* ── Standard card (#2, #3, …) ──────────────────────────── */
function PromoCard({ promo, rank }) {
  return (
    <article
      className="lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-white p-6 lg:p-7"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-label={`${promo.bank} — ${promo.product}, bonus ${promo.bonus} zł`}
    >
      <span
        aria-hidden="true"
        className="numeric font-display absolute right-6 top-5 text-[20px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)]/[0.18]"
      >
        {String(rank).padStart(2, "0")}
      </span>

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
          style={{ background: promo.bankGradient }}
        >
          <span className="font-display text-[14px] font-semibold tracking-[-0.02em]">{promo.bankInitials}</span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{promo.bank}</div>
          <div className="text-[12.5px] text-[var(--color-muted)]">{promo.product}</div>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display numeric text-[44px] font-semibold leading-none tracking-[-0.05em] text-[var(--color-brand)]">
          {promo.bonus}
        </span>
        <span className="font-display text-[20px] font-medium tracking-[-0.02em] text-[var(--color-brand)]/70">zł</span>
        {promo.urgent && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-tint)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-warning)]">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-warning)]" />
            Pilne · {promo.daysLeft}d
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[12.5px] text-[var(--color-faint)]">{promo.extras}</div>

      <div aria-hidden="true" className="my-5 h-px bg-[var(--color-hairline)]" />

      <ul role="list" className="space-y-2 text-[13px] text-[var(--color-text)]">
        {promo.requirements.slice(0, 2).map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 shrink-0 text-[var(--color-success)]">
              <path d="M2.5 7.5l2.5 2.5 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-faint)]/80">Deadline</div>
          <div className="mt-1 numeric text-[12px] font-medium tracking-[0] text-[var(--color-muted)]">
            {promo.deadline}
          </div>
        </div>

        <a
          href={`#promo-${promo.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[12.5px] font-semibold text-white transition-all duration-200 group-hover:bg-[var(--color-brand)] group-hover:shadow-[var(--shadow-glow)]"
        >
          Sprawdź
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 13 13" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  );
}
