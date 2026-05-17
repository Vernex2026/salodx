import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const FAQS = [
  {
    q: "Czy Saldox jest płatny?",
    a: "Nie. Saldox jest całkowicie darmowy dla użytkownika. Nie pobieramy prowizji, nie wymagamy konta, nie żądamy karty. Utrzymujemy się z prowizji partnerskich od banków — ale tylko wtedy, gdy faktycznie skorzystasz z oferty, którą rekomendujemy."
  },
  {
    q: "Skąd bierzecie informacje o promocjach?",
    a: "Co 4 godziny nasz system skanuje strony 24 banków w Polsce — regulaminy, landing pages promocji, sekcje „dla nowych klientów\". AI wyciąga warunki, deadline'y i kwoty bonusów. Każda oferta jest dodatkowo zweryfikowana ręcznie przed publikacją."
  },
  {
    q: "Czy korzystanie z Saldox wpływa na BIK?",
    a: "Nie. Samo przeglądanie ofert na Saldox nie wymaga żadnych danych osobowych i nie zostawia śladu w BIK. Decyzja o złożeniu wniosku zawsze należy do Ciebie i odbywa się bezpośrednio w banku."
  },
  {
    q: "Jak długo czeka się na wypłatę bonusu?",
    a: "To zależy od banku — najczęściej 30–60 dni od spełnienia warunków. Każdą ofertę opisujemy z konkretnym terminem („Wypłata: do 45 dni\"). Jeśli bank się spóźnia, pisz do nas — pomagamy interweniować."
  },
  {
    q: "Czy moje dane są bezpieczne?",
    a: "Saldox nie przechowuje żadnych danych finansowych ani osobowych — nie mamy ich, bo Cię o nie nie pytamy. Jedyne co zapisujemy to e-mail (jeśli zapiszesz się do mailingu) i preferencje pod profil bankowy. RODO ✓ — możesz usunąć dane jednym kliknięciem."
  },
  {
    q: "Jak często wysyłacie maile?",
    a: "Maks 1 mail w tygodniu (poniedziałek 9:00) z trzema najlepszymi ofertami pod Twój profil bankowy. Plus alert natychmiastowy, jeśli pojawi się oferta z deadline w 48h. Wypisujesz się jednym kliknięciem, bez tłumaczeń."
  },
  {
    q: "Czym Saldox różni się od porównywarki bankowej?",
    a: "Porównywarki pokazują oferty stałe, my pokazujemy promocje czasowe z konkretnymi deadline'ami. Pokazujemy tylko 12 najlepszych z 47, nie zalewamy listy. Tłumaczymy warunki bez prawniczego. I nie sprzedajemy Twojej zgody na komunikację marketingową."
  },
  {
    q: "Jak mogę usunąć swoje dane?",
    a: "Wejdź na saldox.pl/usun-dane, podaj e-mail którym się zapisywałeś, potwierdź. Wszystko czyścimy w ciągu 24h. Możesz też po prostu napisać do nas na hi@saldox.pl."
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const [headerRef, headerVisible] = useReveal({ threshold: 0.3 });

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <header
          ref={headerRef}
          className={`reveal text-center ${headerVisible ? "is-visible" : ""}`}
          style={{ transitionDuration: "600ms" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Pytania, które słyszymy najczęściej
          </p>
          <h2
            id="faq-heading"
            className="font-display mt-4 text-[36px] font-semibold leading-[1.12] tracking-[-0.035em] text-[var(--color-ink)] sm:text-5xl lg:text-[56px]"
          >
            Nie ma głupich pytań.<br />
            <span className="text-[var(--color-muted)]">Tylko nieodpowiedziane.</span>
          </h2>
        </header>

        <ul role="list" className="mt-14 divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  <span className="font-display flex-1 text-[18px] font-medium tracking-[-0.025em] text-[var(--color-ink)] sm:text-[20px]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-2)] bg-white transition-all duration-300 " +
                      (isOpen ? "rotate-45 border-[var(--color-brand)] bg-[var(--color-brand)] text-white" : "text-[var(--color-muted)]")
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1.2,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  aria-hidden={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-16 text-[15px] leading-relaxed text-[var(--color-muted)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[14px] text-[var(--color-muted)]">Nie znalazłeś odpowiedzi?</p>
          <a
            href="mailto:hi@saldox.pl"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-2)] bg-white px-5 py-3 text-[14px] font-medium text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-brand-border)] hover:bg-[var(--color-brand-tint)]/40 hover:text-[var(--color-brand)]"
          >
            Napisz: hi@saldox.pl
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
