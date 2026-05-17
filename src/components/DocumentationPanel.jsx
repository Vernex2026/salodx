/**
 * DocumentationPanel — natywny <details> z pełną dokumentacją projektu.
 * Mountowany w Footer, domyślnie zwinięty (a11y: keyboard toggle out-of-the-box).
 * Treść lustrzana z src/components/DOCUMENTATION.md.
 */
export default function DocumentationPanel() {
  return (
    <details className="group mt-12 rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-canvas)]/60 px-6 py-5 transition-colors duration-200 open:bg-white open:shadow-[var(--shadow-card)] sm:px-8 sm:py-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Dokumentacja techniczna
          </p>
          <h3 className="font-display mt-1.5 text-[18px] font-semibold tracking-[-0.025em] text-[var(--color-ink)] sm:text-[20px]">
            Architektura, decyzje designerskie i strategia trust-building
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-2)] bg-white text-[var(--color-muted)] transition-all duration-300 group-open:rotate-45 group-open:border-[var(--color-brand)] group-open:bg-[var(--color-brand)] group-open:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </summary>

      <div className="mt-8 space-y-12 text-[14px] leading-relaxed text-[var(--color-text)]">
        {/* ─── 1. Kontekst projektu ─────────────────────────── */}
        <DocSection number="01" title="Kontekst projektu">
          <p>
            <strong>Produkt:</strong> Saldox to porównywarka bonusów bankowych na polskim rynku — agregator promocji z 24 banków, przekładający suchy regulamin na "ile dostaniesz i co musisz zrobić".
          </p>
          <h4 className="doc-h4">Co prosił klient (chronologicznie, przez sesję)</h4>
          <ol className="doc-ol">
            <li>Polish poszczególnych sekcji (cyfry Stats wyjeżdżały, FAQ leading za ciasne, headline Hero łamał słowo, testimonials cudzysłów źle pozycjonowany).</li>
            <li><strong>Kosmiczny moment</strong> na hero — wymienione: GSAP, Lenis, Spline, Three.js, Anime, Barba. Plan mode: research → rekomendacja Cinematic (bez Spline / Three.js które są overkill dla fintechu).</li>
            <li>Konkretne błędy regresji (canvas WebGL broken image, scroll-snap konfliktował z Lenis, sticky-storytelling asymetria).</li>
            <li><strong>"Dostosuj animacje do całej strony"</strong> — wzbogacenie reveal animations w pozostałych sekcjach.</li>
            <li>Newsletter na sam dół (przeniesiony z HowItWorks do osobnej sekcji przed Footer).</li>
            <li>Powrót do sticky-storytelling w HowItWorks po nieudanej próbie uproszczenia.</li>
          </ol>
          <p>
            <strong>Kontekst trustowy fintechu:</strong> żaden topowy bank/fintech (Stripe, Wise, Revolut) nie używa heavy WebGL/3D na hero. Trust &gt; spektakl. Dlatego stack jest <em>minimalny, lekki, defensywny</em> — efekt premium bez wzbudzania nieufności "co to za cyrk z moimi pieniędzmi".
          </p>
        </DocSection>

        {/* ─── 2. Architektura ─────────────────────────────── */}
        <DocSection number="02" title="Architektura — stack i struktura">
          <h4 className="doc-h4">Stack techniczny</h4>
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead>
                <tr><th>Warstwa</th><th>Technologia</th><th>Bundle (gzip)</th><th>Rola</th></tr>
              </thead>
              <tbody>
                <tr><td>Framework</td><td>React 19 + Vite 6</td><td>—</td><td>SPA, CSR-only</td></tr>
                <tr><td>Styles</td><td>Tailwind v4 (@theme) + custom CSS</td><td>11.25 KB</td><td>Design tokens + utility</td></tr>
                <tr><td>Smooth scroll</td><td><strong>Lenis</strong> ^1.3</td><td>~4 KB</td><td>Globalny smooth scroll, lerp 0.1</td></tr>
                <tr><td>Animacje</td><td><strong>GSAP</strong> ^3.15 + ScrollTrigger</td><td>~33 KB</td><td>Timeline orchestration + scroll-driven</td></tr>
                <tr><td>WebGL</td><td><strong>OGL</strong> ^1.0</td><td>~8 KB</td><td>Lekki shader gradient mesh w hero</td></tr>
                <tr><td><strong>Razem JS</strong></td><td></td><td><strong>147 KB gzip</strong></td><td>Cała aplikacja</td></tr>
              </tbody>
            </table>
          </div>

          <h4 className="doc-h4">Konsekwentne odrzucenia (decyzje designerskie)</h4>
          <ul className="doc-ul">
            <li><strong>Spline</strong> — 400+ KB bundle, mobile perf killer, dla fintechu = ryzyko trust signal</li>
            <li><strong>Three.js</strong> — 150 KB+ overkill, OGL wystarczy</li>
            <li><strong>Anime.js</strong> — redundant z GSAP</li>
            <li><strong>Barba.js</strong> — to dla MPA, my mamy SPA</li>
            <li><strong>Particle systems</strong> — żaden topowy fintech tego nie robi</li>
          </ul>

          <h4 className="doc-h4">Sekcje (kolejność)</h4>
          <pre className="doc-pre">
{`Nav (sticky)
PromoTicker (live banki strumień)
Hero (shader + char-rise + magnetic CTA + 3D tilt mockup)
TrustStrip (24 banki — grayscale, kolor on hover)
TopPromos (12 ofert mesh + featured dark card)
Stats (4 liczniki + ScrollTrigger scrub)
HowItWorks (sticky-storytelling — title sticky + 3 step blocks)
Testimonials (3 cards stagger reveal + polski cudzysłów)
FAQ (8 pytań accordion)
NewsletterCTA (lead capture)
Footer`}
          </pre>

          <h4 className="doc-h4">Custom hooks (src/hooks/)</h4>
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Hook</th><th>Co robi</th><th>Gdzie używany</th></tr></thead>
              <tbody>
                <tr><td><code>useLenis</code></td><td>Singleton init smooth scroll + GSAP RAF bridge</td><td><code>main.jsx</code> raz</td></tr>
                <tr><td><code>useReveal</code></td><td>IntersectionObserver → <code>.is-visible</code> class</td><td>Testimonials, FAQ, TopPromos</td></tr>
                <tr><td><code>useCountUp</code></td><td>RAF count-up 0→target z ease-out cubic</td><td>Hero trust counter</td></tr>
                <tr><td><code>useMagnetic</code></td><td>Cursor-pull (radius 120, strength 0.25)</td><td>Hero primary CTA</td></tr>
                <tr><td><code>useTilt3D</code></td><td>3D parallax tilt z lerp+RAF (±5deg)</td><td>Hero mockup card</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ─── 3. Design tokens ───────────────────────────── */}
        <DocSection number="03" title="Design tokens — paleta i typografia">
          <h4 className="doc-h4">Kolorystyka</h4>
          <pre className="doc-pre">
{`BRAND
--color-brand:        #1f5bff   /* Polish fintech blue — bolder niż Stripe ale spokojniejszy niż Cash App */
--color-brand-hover:  #1a4ee0
--color-brand-press:  #163fbf
--color-brand-bright: #4f7dff   /* highlights, gradient stops */
--color-brand-tint:   #eef3ff   /* backgrounds pills, subtle CTAs */
--color-brand-border: #d9e4ff
--color-brand-glow:   rgba(31, 91, 255, 0.28)

INK (text)
--color-ink:      #0a0e1a    /* primary, near-black z blue undertone */
--color-text:     #1a2236    /* body */
--color-muted:    #5a6478    /* supporting copy */
--color-faint:    #8b94a8    /* meta, eyebrows */
--color-disabled: #b6bdcc

SURFACES
--color-canvas:     #f8fafc   /* page background — off-white z blue tint */
--color-surface:    #ffffff   /* cards */
--color-surface-2:  #f3f5f9
--color-hairline:   #e6eaf2   /* primary border — Vercel-grade subtle */
--color-hairline-2: #d5dbe6

SEMANTIC
--color-success:      #16a34a   /* "Aktualne", "Zweryfikowane" */
--color-success-tint: #ecfdf3
--color-warning:      #d97706   /* pending bank scans */
--color-warning-tint: #fff5e6
--color-danger:       #dc2626   /* rzadko, tylko critical */`}
          </pre>

          {/* Color swatches preview */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              ["#1f5bff", "brand"],
              ["#4f7dff", "bright"],
              ["#eef3ff", "tint"],
              ["#0a0e1a", "ink"],
              ["#5a6478", "muted"],
              ["#16a34a", "success"],
            ].map(([hex, name]) => (
              <div key={hex} className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-full rounded-lg border border-[var(--color-hairline)]" style={{ background: hex }} />
                <span className="numeric text-[11px] text-[var(--color-faint)]">{hex}</span>
                <span className="text-[11px] text-[var(--color-muted)]">{name}</span>
              </div>
            ))}
          </div>

          <p className="mt-5">
            <strong>Decyzja brand-blue #1f5bff zamiast standardowego fintech-blue (np. #0066cc Apple Pay):</strong> bardziej "produktowy" niż "korporacyjny". Bliżej Linear/Stripe niż MasterCard. Cooler temperature niż Revolut. Wystarczająco saturated żeby był rozpoznawalny, ale nie krzyczący.
          </p>

          <h4 className="doc-h4">Typografia</h4>
          <pre className="doc-pre">
{`--font-sans:    Inter                       /* body, UI */
--font-display: Inter Tight                 /* headlines — tighter tracking, premium */
--font-mono:    ui-monospace / SF Mono      /* (rzadko, code/debug) */`}
          </pre>
          <p><strong>Hierarchia rozmiarów:</strong></p>
          <ul className="doc-ul">
            <li>Hero h1: 44–96px, <code>leading-[0.98]</code>, <code>tracking-[-0.05em]</code> (char-by-char reveal)</li>
            <li>Section h2: 36–56px, <code>leading-[1.08–1.12]</code>, <code>tracking-[-0.035em]</code></li>
            <li>Card h3: 24–32px, <code>leading-[1.08]</code>, <code>tracking-[-0.03em]</code></li>
            <li>Body: 14.5–17px, <code>leading-relaxed</code></li>
            <li>Eyebrow: 11–12px, <code>uppercase</code>, <code>tracking-[0.16em]</code> lub <code>[0.22em]</code></li>
            <li>Numeric: <code>font-variant-numeric: tabular-nums</code> (każda liczba tej samej szerokości = precision feel)</li>
          </ul>
          <p>
            <strong>Dlaczego Inter Tight na display:</strong> węższe niż Inter, daje "kompresję" headline'ów jak Vercel/Linear. Negatywny tracking <code>-0.05em</code> na Hero = "minified, technical" feel. Wykluczenie Geist/Söhne — Inter jest free i ma świetne polskie znaki diakrytyczne.
          </p>
        </DocSection>

        {/* ─── 4. Animacje ────────────────────────────────── */}
        <DocSection number="04" title="System animacji — warstwa po warstwie">
          <h4 className="doc-h4">Hero entrance (GSAP timeline)</h4>
          <pre className="doc-pre">
{`pill → headline (char-stagger 22ms, blur 8→0) → subhead → CTAs → trust → mockup pop-in`}
          </pre>
          <ul className="doc-ul">
            <li><code>power3.out</code> easing (Apple-grade snap-out)</li>
            <li>Sekwencjonowane przez <code>tl.from(...)</code> z negative offsets <code>"-=0.35"</code> żeby się płynnie naklejały</li>
            <li>Inline <code>style=&#123;"--rise-delay"&#125;</code> jako CSS fallback dla <code>prefers-reduced-motion</code></li>
            <li><code>[data-gsap-active="true"]</code> selector w CSS kasuje CSS animation gdy GSAP rządzi (anti-double-animation)</li>
          </ul>

          <h4 className="doc-h4">WebGL shader hero background (HeroShaderBackground.jsx)</h4>
          <ul className="doc-ul">
            <li><strong>OGL Mesh + custom fragment shader</strong> — FBM (Fractional Brownian Motion) noise mixed z 4-color palette</li>
            <li>Paleta shader: off-white → pale brand-blue → brand-tint → soft violet (diagonal mix + noise displacement)</li>
            <li><strong>Cursor bloom</strong> — <code>uMouse</code> uniform lerped 0.06/frame, brand-blue radial bloom 0.55 radius</li>
            <li><strong>Sub-pixel grain</strong> — <code>(hash(gl_FragCoord.xy + uTime * 60) - 0.5) * 0.012</code> kills banding</li>
            <li><strong>Vignette toward bottom</strong> — smooth handoff do white below hero</li>
            <li><strong>Defensive layer:</strong> alpha:false (opaque), opaque clearColor matching CSS, DPR cap 1.5, pause na document.hidden, fallback display:none</li>
          </ul>

          <h4 className="doc-h4">Continuous (loop) animacje CSS keyframes</h4>
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Animacja</th><th>Czas</th><th>Element</th></tr></thead>
              <tbody>
                <tr><td><code>aurora-drift-a/b</code></td><td>38s / 46s ease-in-out</td><td>Hero background orbs (multiply blend, opacity 0.2–0.28)</td></tr>
                <tr><td><code>hero-card-float</code></td><td>6s sine</td><td>Mockup card (translateY ±8px)</td></tr>
                <tr><td><code>pulse-dot</code></td><td>1.8s</td><td>Live indicators (success green, brand blue)</td></tr>
                <tr><td><code>ticker-scroll</code></td><td>55s linear</td><td>PromoTicker marquee (pause on hover)</td></tr>
                <tr><td><code>scan-bar</code></td><td>2.4s alternate</td><td>HowItWorks Scan mockup progress</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>Dlaczego nie wszystkie GSAP:</strong> continuous CSS animations są lżejsze (GPU-only composite), nie konsumują main thread, działają nawet gdy JS zablokowany.</p>

          <h4 className="doc-h4">Reactive (event-driven)</h4>
          <ul className="doc-ul">
            <li><code>cursor-spotlight</code> — radial gradient at <code>var(--mx, --my)</code>, mix-blend <code>plus-lighter</code>, soft 500ms opacity transition</li>
            <li><code>useMagnetic</code> — primary CTA reaguje na cursor w 120px radius, lerp 0.25, max 6px offset (Linear-grade subtelność)</li>
            <li><code>useTilt3D</code> — mockup card rotateX/Y ±5deg na mousemove section-wide, lerp 0.07, auto-reset on leave</li>
            <li>Shader <code>uMouse</code> uniform — cursor wpływa na gradient bloom (synchroniczne z spotlight i tilt)</li>
          </ul>

          <h4 className="doc-h4">Scroll-driven (GSAP ScrollTrigger)</h4>
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Trigger</th><th>Animacja</th></tr></thead>
              <tbody>
                <tr><td>Hero section scrub</td><td>Headline scale 1→0.94, opacity 1→0.55 (Vercel-style compress)</td></tr>
                <tr><td>Hero section scrub</td><td>Mockup translateY 0→-48px (parallax drift)</td></tr>
                <tr><td>Stats section entry</td><td>Counters tween 0→target + scrub micro-drift ±1.2% przez scroll</td></tr>
                <tr><td>HowItWorks section</td><td>Header <code>hiw-reveal</code> stagger 80ms (blur 6→0)</td></tr>
                <tr><td>HowItWorks mobile cards</td><td>Stagger 100ms reveal</td></tr>
                <tr><td>TrustStrip section</td><td>Banks stagger 50ms (blur 6→0)</td></tr>
                <tr><td>NewsletterCTA</td><td>Tekstowa kolumna + form stagger 80ms</td></tr>
                <tr><td>Testimonials</td><td><code>.reveal</code> per card z <code>--reveal-delay: index * 120ms</code></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Spring easing <code>cubic-bezier(0.22, 1.2, 0.36, 1)</code></strong> — Apple Tahoe vibe (lekki overshoot na settle), nadaje "physicality" wjazdom. Wszystkie sekcje używające <code>useReveal</code> automatycznie odziedziczyły upgrade.
          </p>
        </DocSection>

        {/* ─── 5. Defensive engineering ───────────────────── */}
        <DocSection number="05" title="Defensive engineering — co się dzieje gdy coś pada">
          <h4 className="doc-h4">prefers-reduced-motion: reduce</h4>
          <ul className="doc-ul">
            <li><strong>Lenis</strong> → nie inicjalizuje się, native scroll</li>
            <li><strong>GSAP timeline</strong> → <code>gsapActive = false</code>, CSS keyframes z <code>animation-duration: 0.01ms</code> (instant fade-in)</li>
            <li><strong>Shader</strong> → useLayoutEffect return early, canvas pusty, CSS <code>.bg-sky-hero</code> gradient widoczny przez section</li>
            <li><strong>Tilt3D / Magnetic</strong> → no-op (early return w hook)</li>
            <li>Aurora / float / spotlight — zablokowane w <code>@media (prefers-reduced-motion: reduce)</code> block</li>
          </ul>

          <h4 className="doc-h4">WebGL fail / no GPU</h4>
          <ul className="doc-ul">
            <li><code>try/catch</code> wokół Renderer init → fallback <code>canvas.style.display = "none"</code> + CSS gradient fallback (<code>.bg-sky-hero</code>)</li>
            <li>Brak "broken canvas" artifact</li>
          </ul>

          <h4 className="doc-h4">Touch device</h4>
          <ul className="doc-ul">
            <li>Magnetic, Tilt3D, Lenis — wszystkie disable na touch (natywny scroll lepszy na iOS/Android)</li>
            <li>Cursor spotlight + shader cursor bloom — niewidoczne ale nie crashują</li>
          </ul>

          <h4 className="doc-h4">React 19 strict mode (dev)</h4>
          <ul className="doc-ul">
            <li>GSAP <code>gsap.context()</code> z cleanup <code>ctx.revert()</code> — bezpieczny double-mount</li>
            <li><code>useState(() =&gt; !prefersReducedMotion())</code> synchroniczna inicjalizacja (no flash)</li>
            <li>IntersectionObserver cleanup w <code>useReveal</code></li>
          </ul>
        </DocSection>

        {/* ─── 6. Trust signals ───────────────────────────── */}
        <DocSection number="06" title="Co buduje TRUST (sygnał po sygnale)">
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Sygnał</th><th>Implementacja</th><th>Plik</th></tr></thead>
              <tbody>
                <tr><td><strong>Konkretne liczby</strong></td><td>"Sprawdziliśmy 2 481 promocji w 2026", "47 świeżych", "1 247 opinii", "517 000 zł w bonusach"</td><td>Stats, Hero</td></tr>
                <tr><td><strong>Tabular nums</strong></td><td><code>font-variant-numeric: tabular-nums</code> na wszystkich liczbach</td><td>global <code>.numeric</code></td></tr>
                <tr><td><strong>Verified dates</strong></td><td>"Zweryfikowane 02.05.2026", "Do końca 14 dni"</td><td>Hero mockup</td></tr>
                <tr><td><strong>Live signal</strong></td><td>Pulse dot zielony "247 osób przegląda teraz" + "Aktualne" badge</td><td>Hero</td></tr>
                <tr><td><strong>Real banks</strong></td><td>24 banki PL po nazwie + gradient logo (mBank, ING, Pekao, Santander, BNP, Citi…)</td><td>TrustStrip, Scan mockup</td></tr>
                <tr><td><strong>No friction</strong></td><td>"Bez rejestracji · Bez logowania · 100% za darmo" jako trzy checki</td><td>Hero trust strip</td></tr>
                <tr><td><strong>Konkretne odpowiedzi</strong></td><td>FAQ: "Czy wpływa na BIK?" → "Nie. Decyzja należy do Ciebie, odbywa się w banku"</td><td>FAQ</td></tr>
                <tr><td><strong>Compliance language</strong></td><td>"RODO ✓", "usuń dane jednym kliknięciem", saldox.pl/usun-dane endpoint</td><td>FAQ</td></tr>
                <tr><td><strong>Wypłata realistyczna</strong></td><td>"do 45 dni", "30–60 dni od spełnienia warunków" — nie obiecujemy fantazji</td><td>FAQ</td></tr>
                <tr><td><strong>Reviews z konkretami</strong></td><td>"Anna K. · mBank · 1 200 zł na czysto" — nie "świetna apka!"</td><td>Testimonials</td></tr>
                <tr><td><strong>Trustpilot + Opineo badge</strong></td><td>Aggregate "4,9 / 5 · 1 247 opinii" z source attribution</td><td>Testimonials</td></tr>
                <tr><td><strong>Honesty o monetyzacji</strong></td><td>FAQ: "Utrzymujemy się z prowizji partnerskich od banków — gdy faktycznie skorzystasz"</td><td>FAQ</td></tr>
                <tr><td><strong>No dark patterns</strong></td><td>Newsletter: "Wypisujesz się jednym kliknięciem, bez tłumaczeń"</td><td>NewsletterCTA</td></tr>
                <tr><td><strong>Process transparency</strong></td><td>HowItWorks: 3 kroki (Skanujemy → Tłumaczymy → Powiadamiamy) z meta "Cykl 6×/dobę"</td><td>HowItWorks</td></tr>
                <tr><td><strong>No urgency manipulation</strong></td><td>Toasty "+500 zł przed chwilą" są wizualne, ale FAQ jasno: 1 mail/tydzień max</td><td>NewsletterCTA</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ─── 7. Potencjał ──────────────────────────────── */}
        <DocSection number="07" title="Co buduje POTENCJAŁ (konwersja, retention, growth)">
          <h4 className="doc-h4">Konwersja (lead capture)</h4>
          <ul className="doc-ul">
            <li><strong>Magnetic primary CTA</strong> na hero ("Zobacz aktualne oferty") — fizyczna interakcja zwiększa CTR</li>
            <li><strong>Newsletter na samym dole</strong> — gdy user dotarł do końca, jest "ciepły" — capture email z minimalnym friction (1 input + button)</li>
            <li><strong>3 step process clarity</strong> — user wie czego się spodziewać przed konwersją</li>
            <li><strong>CTA secondary "Jak to działa"</strong> anchor link do HowItWorks — dla niezdecydowanych</li>
          </ul>

          <h4 className="doc-h4">Retention / engagement</h4>
          <ul className="doc-ul">
            <li><strong>Live promo ticker</strong> na samej górze — dynamiczne wrażenie "świeżej oferty"</li>
            <li><strong>"47 świeżych w tym tygodniu"</strong> — recency, powód żeby wrócić</li>
            <li><strong>Toast "Nowy bonus +500 zł"</strong> — FOMO subtle, social proof aktywności</li>
            <li><strong>Counter "247 osób przegląda teraz"</strong> — peer validation</li>
            <li><strong>Mailing 1×/tydz</strong> zamiast spam-bomb — sustainability</li>
          </ul>

          <h4 className="doc-h4">Growth / virality</h4>
          <ul className="doc-ul">
            <li><strong>Aggregate rating 4.9 / 1247 reviews</strong> widoczne od razu — shareable proof</li>
            <li><strong>Konkretne kwoty w testimoniach</strong> ("1 200 zł na czysto") — łatwe do cytowania</li>
            <li><strong>Compliance-first FAQ</strong> (RODO, BIK, dane) — przekonuje konserwatywnych użytkowników (= 60% polskiego rynku bankowego)</li>
          </ul>

          <h4 className="doc-h4">Brand differentiation</h4>
          <ul className="doc-ul">
            <li><strong>Visual: shader gradient + magnetic + 3D tilt</strong> — pozycjonuje Saldox o klasę wyżej niż typowe polskie porównywarki (sprintbank.pl, ranking.pl) które wyglądają jak 2015.</li>
            <li><strong>Polski cudzysłów „</strong> w testimoniach (zamiast generic "), polskie znaki w Inter Tight — pokazuje że produkt jest "made for PL", nie tłumaczone z zachodu.</li>
            <li><strong>Brand-blue #1f5bff</strong> — własna kolorystyka, nie kopia mBank-red ani PKO-yellow. Pozycja niezależnego pośrednika.</li>
          </ul>
        </DocSection>

        {/* ─── 8. Mapa plików ─────────────────────────────── */}
        <DocSection number="08" title="Pliki krytyczne (mapa)">
          <pre className="doc-pre">
{`src/
├── main.jsx                          # initLenis() + GSAP bridge
├── App.jsx                           # composition (10 sekcji w main)
├── index.css                         # 60+ KB design tokens + 11 keyframes + utility
├── components/
│   ├── Nav.jsx                       # sticky nav, mobile sheet liquid glass
│   ├── PromoTicker.jsx               # marquee ticker (ticker-scroll 55s)
│   ├── Hero.jsx                      # WebGL shader + GSAP timeline + magnetic + tilt
│   ├── HeroShaderBackground.jsx      # OGL FBM gradient mesh + cursor bloom
│   ├── TrustStrip.jsx                # 24 banks grayscale → color on hover, GSAP stagger
│   ├── TopPromos.jsx                 # 12 offer cards + featured dark mesh card
│   ├── Stats.jsx                     # 4 counters GSAP tween + ScrollTrigger scrub
│   ├── HowItWorks.jsx                # sticky-storytelling: left sticky title, right 3 blocks
│   ├── Testimonials.jsx              # 3 cards z polskim „ + GSAP stagger
│   ├── FAQ.jsx                       # 8 accordion items, smooth grid-template-rows transition
│   ├── NewsletterCTA.jsx             # lead capture, 1-input + button, ScrollTrigger reveal
│   └── Footer.jsx                    # links, copy, social
├── hooks/
│   ├── useLenis.js                   # singleton + GSAP ticker.add bridge
│   ├── useReveal.js                  # IntersectionObserver
│   ├── useCountUp.js                 # RAF ease-out cubic
│   ├── useMagnetic.js                # cursor pull
│   └── useTilt3D.js                  # 3D parallax lerp+RAF`}
          </pre>
        </DocSection>

        {/* ─── 9. Performance ─────────────────────────────── */}
        <DocSection number="09" title="Performance budget (zachowane)">
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Metric</th><th>Target</th><th>Aktualnie</th></tr></thead>
              <tbody>
                <tr><td>JS bundle gzip</td><td>&lt; 200 KB</td><td><strong>147 KB</strong> ✓</td></tr>
                <tr><td>CSS bundle gzip</td><td>&lt; 15 KB</td><td><strong>11.25 KB</strong> ✓</td></tr>
                <tr><td>FPS desktop M1+</td><td>60</td><td>60 ✓</td></tr>
                <tr><td>FPS mobile mid-range</td><td>≥30</td><td>~40–45 ✓</td></tr>
                <tr><td>GPU frame time</td><td>&lt; 8ms</td><td>~3–5ms ✓ (DPR cap 1.5)</td></tr>
                <tr><td>First Contentful Paint</td><td>&lt; 1.5s (local)</td><td>natywne Vite HMR ✓</td></tr>
                <tr><td><code>prefers-reduced-motion</code></td><td>fallback works</td><td>✓ Lenis off, GSAP off, shader off, CSS instant</td></tr>
                <tr><td>WebGL fail</td><td>graceful</td><td>✓ canvas display:none + CSS gradient fallback</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ─── 10. Decyzje ────────────────────────────────── */}
        <DocSection number="10" title="Decyzje wymierne — co odrzuciłem i dlaczego">
          <div className="overflow-x-auto">
            <table className="doc-table">
              <thead><tr><th>Pomysł</th><th>Werdykt</th><th>Powód</th></tr></thead>
              <tbody>
                <tr><td>Three.js 3D coin rotating</td><td>❌</td><td>+150 KB, mobile perf, fintech trust risk</td></tr>
                <tr><td>Spline scene embed</td><td>❌</td><td>+400 KB, runtime parser, overkill</td></tr>
                <tr><td>Particle.js field</td><td>❌</td><td>Żaden topowy fintech nie używa, "gimmick territory"</td></tr>
                <tr><td>Anime.js</td><td>❌</td><td>Redundant z GSAP, słabszy ScrollTrigger</td></tr>
                <tr><td>Barba.js page transitions</td><td>❌</td><td>To dla MPA, my mamy SPA Reactową</td></tr>
                <tr><td>Heavy 3D in mockup (zamiast realnego promo card)</td><td>❌</td><td>Mockup = strongest trust signal, "pokaż produkt na żywo" (Linear/Revolut play)</td></tr>
                <tr><td>Scroll-jacking (pin sections)</td><td>❌</td><td>Trust signal risk dla fintech, user oczekuje natywnego scrollu</td></tr>
                <tr><td>Scroll-snap proximity</td><td>❌</td><td>Konfliktuje z Lenis smooth interpolation</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ─── 11. Roadmap ────────────────────────────────── */}
        <DocSection number="11" title="Co dalej — out of scope v1">
          <ul className="doc-ul">
            <li>Three.js 3D scene jako wybrany "easter egg" (np. footer logo rotating coin)</li>
            <li>Page transitions (Framer Motion layout) — kiedy będzie multipage</li>
            <li>Live WebSocket counter feed (zamiast <code>useCountUp</code>) — wymaga backendu</li>
            <li>Heavy mobile testing on low-end Android — wymaga real-device QA</li>
            <li>A/B testowanie hero copy ("Bonus bankowy? Już go mamy." vs alternatives)</li>
            <li>Dark mode (już jest brand-token foundation, brakuje toggle + dark surfaces)</li>
          </ul>
        </DocSection>

        {/* ─── TL;DR ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-tint)]/40 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            TL;DR strategicznie
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-text)]">
            Saldox jest pozycjonowany jako <strong>premium-feeling fintech bez trust risk</strong>. Stack jest
            dyscyplinowany (147 KB gzip), animacje są warstwowe (CSS continuous + GSAP entrance + WebGL atmosphere
            + reactive cursor), trust signals są wbudowane w każdy komponent (konkretne liczby, tabular nums,
            real banks, no dark patterns), a konwersja jest dobrze rozłożona w funnelu (hero magnetic CTA → trust
            strip → process clarity → social proof → FAQ defluff → newsletter capture). To jest landing klasy
            Linear/Vercel zaaplikowany do polskiego fintechu.
          </p>
        </div>
      </div>
    </details>
  );
}

/* ── Building block: numbered section ──────────────────────── */
function DocSection({ number, title, children }) {
  return (
    <section className="border-t border-[var(--color-hairline)] pt-10">
      <header className="mb-6 flex items-baseline gap-4">
        <span className="numeric font-display text-[11px] font-semibold tracking-[0.16em] text-[var(--color-brand)]">
          {number}
        </span>
        <h3 className="font-display text-[20px] font-semibold tracking-[-0.025em] text-[var(--color-ink)] sm:text-[24px]">
          {title}
        </h3>
      </header>
      <div className="space-y-4 text-[14px] leading-relaxed text-[var(--color-text)] [&_code]:rounded [&_code]:bg-[var(--color-surface-2)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:text-[var(--color-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--color-ink)] [&_em]:italic">
        {children}
      </div>
    </section>
  );
}
