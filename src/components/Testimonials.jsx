import { useReveal } from "../hooks/useReveal";

const REVIEWS = [
  {
    id: 1,
    quote: "Skorzystałam z trzech promocji w pół roku. Saldox pokazał warunki bez bełkotu — wiedziałam dokładnie ile transakcji muszę zrobić i kiedy wpłynie bonus. 1 200 zł na czysto.",
    name: "Anna K.",
    role: "specjalistka HR",
    bank: "mBank · Santander · ING",
    avatarGrad: "linear-gradient(135deg,#4f7dff,#1f5bff)",
    initials: "AK",
  },
  {
    id: 2,
    quote: "Codziennie skanują 24 banki i mówią mi tylko te oferty pod mój profil. Zero spamu. Wreszcie ktoś robi to porządnie zamiast porównywarki sprzed dekady.",
    name: "Michał T.",
    role: "freelancer IT",
    bank: "Pekao",
    avatarGrad: "linear-gradient(135deg,#7c3aed,#5b21b6)",
    initials: "MT",
  },
  {
    id: 3,
    quote: "Mailing co poniedziałek z 3 ofertami pod moje konto. Bez gwiazdek, bez „skontaktuj się z doradcą\". Bardzo dobrze zaprojektowane.",
    name: "Karolina W.",
    role: "lekarka stomatolog",
    bank: "Citi Handlowy",
    avatarGrad: "linear-gradient(135deg,#16a34a,#15803d)",
    initials: "KW",
  },
];

export default function Testimonials() {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });

  return (
    <section
      id="opinie"
      aria-labelledby="reviews-heading"
      className="relative bg-[var(--color-canvas)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <header
          ref={headerRef}
          className={`reveal mx-auto max-w-3xl text-center ${headerVisible ? "is-visible" : ""}`}
          style={{ transitionDuration: "600ms" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Co mówią użytkownicy
          </p>
          <h2
            id="reviews-heading"
            className="font-display mt-4 text-[36px] font-semibold leading-[1.12] tracking-[-0.035em] text-[var(--color-ink)] sm:text-5xl lg:text-[56px]"
          >
            Nie wierz nam.<br />
            <span className="text-[var(--color-muted)]">Posłuchaj ich.</span>
          </h2>

          {/* Aggregate rating */}
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--color-hairline)] bg-white px-4 py-2 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--color-brand-border)] hover:shadow-[0_4px_16px_rgba(31,91,255,0.10)]">
            <span className="flex items-center gap-0.5">
              {[0,1,2,3,4].map((i) => (
                <svg
                  key={i}
                  width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b"
                  className="star-pop"
                  style={{ "--star-delay": `${200 + i * 80}ms` }}
                >
                  <path d="M7 .8l1.9 4.1 4.5.5-3.4 3.1.9 4.4L7 10.7 3.1 12.9l.9-4.4L.6 5.4l4.5-.5L7 .8z"/>
                </svg>
              ))}
            </span>
            <span className="font-display numeric text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">4,9</span>
            <span className="text-[13px] text-[var(--color-muted)]">/ 5 · <span className="numeric">1 247</span> opinii</span>
            <span aria-hidden="true" className="h-3 w-px bg-[var(--color-hairline-2)]" />
            <span className="text-[12px] font-medium text-[var(--color-muted)]">Opineo · Trustpilot</span>
          </div>
        </header>

        <ul role="list" className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {REVIEWS.map((r, i) => (
            <li key={r.id}>
              <ReviewCard review={r} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ReviewCard({ review, index = 0 }) {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  return (
    <article
      ref={ref}
      className={`review-card reveal group relative flex h-full flex-col rounded-3xl border border-[var(--color-hairline)] bg-white p-7 ${visible ? "is-visible" : ""}`}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "700ms",
        "--reveal-delay": `${index * 120}ms`,
      }}
    >
      {/* Opening quote glyph — polski „ jako visual marker NAD cytatem */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none -mt-1 block select-none text-[56px] leading-[0.6] text-[var(--color-brand)]/25 transition-colors duration-300 group-hover:text-[var(--color-brand)]/45"
      >
        „
      </span>

      <blockquote className="mt-4 text-[14.5px] leading-relaxed text-[var(--color-text)]">
        {review.quote}
      </blockquote>

      <div className="flex-1" />

      <footer className="mt-6 flex items-center gap-3 border-t border-[var(--color-hairline)] pt-5">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_2px_6px_rgba(10,14,26,0.10)] ring-2 ring-white transition-transform duration-300 group-hover:scale-105"
          style={{ background: review.avatarGrad }}
        >
          <span className="font-display text-[13px] font-semibold tracking-[-0.02em]">{review.initials}</span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[14px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{review.name}</div>
          <div className="text-[12px] text-[var(--color-muted)]">{review.role} · {review.bank}</div>
        </div>
      </footer>
    </article>
  );
}
