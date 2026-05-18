import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";

const STATS = [
  { value: 24, format: "raw", label: "banków monitoringu", suffix: "" },
  { value: 47, format: "raw", label: "ofert aktualnych", suffix: "" },
  { value: 2481, format: "spaced", label: "sprawdzonych w 2026", suffix: "" },
  { value: 517000, format: "spaced", label: "w bonusach", suffix: " zł" },
];

const fmt = (n, format) =>
  format === "spaced"
    ? n.toLocaleString("pl-PL").replace(/,/g, " ").replace(/ /g, " ")
    : String(n);

export default function TrustBlock() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="relative isolate overflow-hidden bg-[var(--color-onyx-1)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(123,92,255,0.20) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 0%, rgba(77,124,255,0.14) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <Eyebrow />

        {/* Numbers grid */}
        <ul
          role="list"
          className="mt-16 grid grid-cols-2 gap-y-12 gap-x-6 sm:gap-y-14 md:grid-cols-4 lg:mt-20 lg:gap-y-16"
        >
          {STATS.map((s, i) => (
            <StatItem key={s.label} stat={s} delay={i * 90} />
          ))}
        </ul>

        {/* Divider */}
        <div className="mt-20 h-px w-full bg-[var(--color-hairline)] lg:mt-28" />

        {/* Featured testimonial */}
        <Testimonial />

        {/* Rating block */}
        <RatingRow />
      </div>
    </section>
  );
}

function Eyebrow() {
  const [ref, visible] = useReveal({ threshold: 0.5 });
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} max-w-3xl`}>
      <div className="eyebrow text-[var(--color-faint)]">Saldox w liczbach</div>
      <h2
        id="trust-heading"
        className="font-display mt-4 text-[var(--color-ink)]"
        style={{
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          lineHeight: "1.02",
          letterSpacing: "-0.025em",
        }}
      >
        <span>Nie wierzysz?</span>{" "}
        <span className="italic text-[var(--color-muted)]">Spójrz na liczby.</span>
      </h2>
    </div>
  );
}

function StatItem({ stat, delay = 0 }) {
  const [ref, visible] = useReveal({ threshold: 0.5 });
  const animated = useCountUp(stat.value, { duration: 1600, when: visible });
  return (
    <li
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      <p
        className="font-display italic numeric text-[var(--color-ink)]"
        style={{
          fontSize: "clamp(3rem, 6vw, 5rem)",
          lineHeight: "0.95",
          letterSpacing: "-0.035em",
        }}
      >
        {fmt(animated, stat.format)}
        {stat.suffix && (
          <span
            className="font-display italic text-[var(--color-muted)]"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", marginLeft: "0.15em" }}
          >
            {stat.suffix}
          </span>
        )}
      </p>
      <p className="mt-3 eyebrow text-[var(--color-faint)]">{stat.label}</p>
    </li>
  );
}

function Testimonial() {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  return (
    <figure
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} mx-auto mt-20 max-w-3xl text-center`}
    >
      {/* Open quote — large display */}
      <div
        aria-hidden="true"
        className="font-display italic text-[var(--electric-violet-2)]"
        style={{ fontSize: "5rem", lineHeight: "0.5", marginBottom: "0.5rem" }}
      >
        “
      </div>

      <blockquote>
        <p
          className="font-display text-[var(--color-ink)]"
          style={{
            fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
            lineHeight: "1.32",
            letterSpacing: "-0.015em",
          }}
        >
          Codziennie skanują 24 banki i mówią mi tylko o ofertach pod mój profil.
          Zero spamu.{" "}
          <span className="italic text-[var(--color-muted)]">
            Wreszcie ktoś robi to porządnie zamiast porównywarki sprzed dekady.
          </span>
        </p>
      </blockquote>

      <figcaption className="mt-8 flex items-center justify-center gap-3">
        {/* Avatar — electric gradient (gold reserved for TopPromos badge) */}
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[18px] font-medium text-white"
          style={{
            background: "linear-gradient(135deg, #4D7CFF 0%, #7B5CFF 100%)",
            boxShadow: "0 4px 12px rgba(123,92,255,0.32), inset 0 0.5px 0 rgba(255,255,255,0.3)",
          }}
        >
          MT
        </div>
        <div className="text-left leading-tight">
          <div className="text-[15px] font-semibold text-[var(--color-ink)]">
            Michał T.
          </div>
          <div className="text-[12.5px] text-[var(--color-muted)]">
            freelancer IT · klient mBank
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function RatingRow() {
  const [ref, visible] = useReveal({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[14px] text-[var(--color-muted)]`}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} delay={400 + i * 80} />
          ))}
        </div>
        <span className="font-display italic text-[18px] text-[var(--color-ink)]">
          4,9
        </span>
        <span className="text-[var(--color-faint)]">/ 5</span>
      </div>

      <span className="hidden h-1 w-1 rounded-full bg-[var(--color-hairline-2)] sm:inline-block" />

      <span>
        <span className="numeric font-semibold text-[var(--color-ink)]">1 247</span>{" "}
        opinii
      </span>

      <span className="hidden h-1 w-1 rounded-full bg-[var(--color-hairline-2)] sm:inline-block" />

      <div className="flex items-center gap-3 text-[var(--color-faint)]">
        <span className="font-medium">Opineo</span>
        <span className="opacity-40">·</span>
        <span className="font-medium">Trustpilot</span>
        <span className="opacity-40">·</span>
        <span className="font-medium">Google</span>
      </div>
    </div>
  );
}

function Star({ delay = 0 }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        animation: `toast-pop 520ms ${delay}ms var(--ease-spring) both`,
      }}
    >
      <path
        d="M9 1.5l2.2 5.4 5.8.5-4.4 3.8 1.4 5.7L9 13.8 3.9 16.9l1.4-5.7L0.9 7.4l5.8-.5L9 1.5z"
        fill="var(--color-ink)"
      />
    </svg>
  );
}
