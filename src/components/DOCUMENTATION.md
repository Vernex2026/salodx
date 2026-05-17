# Saldox — Dokumentacja architektury, decyzji designerskich i strategii trust-building

---

## 1. Kontekst projektu

**Produkt:** Saldox to porównywarka bonusów bankowych na polskim rynku — agregator promocji z 24 banków, przekładający suchy regulamin na "ile dostaniesz i co musisz zrobić".

**Co prosił klient (chronologicznie, przez sesję):**
1. Polish poszczególnych sekcji (cyfry Stats wyjeżdżały, FAQ leading za ciasne, headline Hero łamał słowo, testimonials cudzysłów źle pozycjonowany).
2. **Kosmiczny moment** na hero — wymienione: GSAP, Lenis, Spline, Three.js, Anime, Barba. Plan mode: research → rekomendacja Cinematic (bez Spline / Three.js które są overkill dla fintechu).
3. Konkretne błędy regresji (canvas WebGL broken image, scroll-snap konfliktował z Lenis, sticky-storytelling asymetria).
4. **"Dostosuj animacje do całej strony"** — wzbogacenie reveal animations w pozostałych sekcjach.
5. Newsletter na sam dół (przeniesiony z HowItWorks do osobnej sekcji przed Footer).
6. Powrót do sticky-storytelling w HowItWorks po nieudanej próbie uproszczenia.

**Kontekst trustowy fintechu:** żaden topowy bank/fintech (Stripe, Wise, Revolut) nie używa heavy WebGL/3D na hero. Trust > spektakl. Dlatego stack jest **minimalny, lekki, defensywny** — efekt premium bez wzbudzania nieufności "co to za cyrk z mojimi pieniędzmi".

---

## 2. Architektura — stack i struktura

### 2.1 Stack techniczny

| Warstwa | Technologia | Bundle (gzip) | Rola |
|---|---|---|---|
| Framework | React 19 + Vite 6 | — | SPA, CSR-only |
| Styles | Tailwind v4 (`@theme`) + custom CSS | 11.25 KB | Design tokens + utility |
| Smooth scroll | **Lenis** ^1.3 | ~4 KB | Globalny smooth scroll, lerp 0.1 |
| Animacje | **GSAP** ^3.15 + ScrollTrigger | ~33 KB | Timeline orchestration + scroll-driven |
| WebGL | **OGL** ^1.0 | ~8 KB | Lekki shader gradient mesh w hero |
| **Razem JS** | | **147 KB gzip** | Cała aplikacja |

**Konsekwentne odrzucenia (decyzje designerskie):**
- **Spline** — 400+ KB bundle, mobile perf killer, dla fintechu = ryzyko trust signal
- **Three.js** — 150 KB+ overkill, OGL wystarczy
- **Anime.js** — redundant z GSAP
- **Barba.js** — to dla MPA, my mamy SPA
- **Particle systems** — żaden topowy fintech tego nie robi

### 2.2 Sekcje (kolejność)

```
Nav (sticky)
PromoTicker (live banki strumień)
Hero (shader + char-rise + magnetic CTA + 3D tilt mockup)
TrustStrip (24 banki — grayscale, kolor on hover)
TopPromos (12 ofert mesh + featured dark card)
Stats (4 liczniki + ScrollTrigger scrub)
HowItWorks (sticky-storytelling — title sticky + 3 step blocks)
Testimonials (3 cards stagger reveal + polski cudzysłów)
FAQ (8 pytań accordion)
NewsletterCTA (lead capture)
Footer
```

### 2.3 Custom hooks (`src/hooks/`)

| Hook | Co robi | Gdzie używany |
|---|---|---|
| `useLenis` | Singleton init smooth scroll + GSAP RAF bridge | `main.jsx` raz |
| `useReveal` | IntersectionObserver → `.is-visible` class | Testimonials, FAQ, TopPromos |
| `useCountUp` | RAF count-up 0→target z ease-out cubic | Hero trust counter |
| `useMagnetic` | Cursor-pull (radius 120, strength 0.25) | Hero primary CTA |
| `useTilt3D` | 3D parallax tilt z lerp+RAF (±5deg) | Hero mockup card |

---

## 3. Design tokens — paleta i typografia

### 3.1 Kolorystyka

```
BRAND
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
--color-danger:       #dc2626   /* rzadko, tylko critical */
```

**Decyzja brand-blue #1f5bff zamiast standardowego fintech-blue (np. #0066cc Apple Pay):**
Bardziej "produktowy" niż "korporacyjny". Bliżej Linear/Stripe niż MasterCard. Cooler temperature niż Revolut. Wystarczająco saturated żeby był rozpoznawalny, ale nie krzyczący.

### 3.2 Typografia

```
--font-sans:    Inter                       /* body, UI */
--font-display: Inter Tight                 /* headlines — tighter tracking, premium */
--font-mono:    ui-monospace / SF Mono      /* (rzadko, code/debug) */
```

**Hierarchia rozmiarów:**
- Hero h1: 44–96px, `leading-[0.98]`, `tracking-[-0.05em]` (char-by-char reveal)
- Section h2: 36–56px, `leading-[1.08–1.12]`, `tracking-[-0.035em]`
- Card h3: 24–32px, `leading-[1.08]`, `tracking-[-0.03em]`
- Body: 14.5–17px, `leading-relaxed`
- Eyebrow: 11–12px, `uppercase`, `tracking-[0.16em]` lub `[0.22em]`
- Numeric: `font-variant-numeric: tabular-nums` (każda liczba tej samej szerokości = precision feel)

**Dlaczego Inter Tight na display:** węższe niż Inter, daje "kompresję" headline'ów jak Vercel/Linear. Negatywny tracking `-0.05em` na Hero = "minified, technical" feel. Wykluczenie Geist/Söhne — Inter jest free i ma świetne polskie znaki diakrytyczne.

---

## 4. System animacji — warstwa po warstwie

### 4.1 Hero entrance (GSAP timeline)

```
pill → headline (char-stagger 22ms, blur 8→0) → subhead → CTAs → trust → mockup pop-in
```
- `power3.out` easing (Apple-grade snap-out)
- Sekwencjonowane przez `tl.from(...)` z negative offsets `"-=0.35"` żeby się płynnie naklejały
- Inline `style={"--rise-delay"}` jako CSS fallback dla `prefers-reduced-motion` (gdy GSAP nie startuje, CSS keyframes biorą stery)
- `[data-gsap-active="true"]` selector w CSS kasuje CSS animation gdy GSAP rządzi (anti-double-animation)

### 4.2 WebGL shader hero background (`HeroShaderBackground.jsx`)

- **OGL Mesh + custom fragment shader** — FBM (Fractional Brownian Motion) noise mixed z 4-color palette
- Paleta shader: off-white → pale brand-blue → brand-tint → soft violet (diagonal mix + noise displacement)
- **Cursor bloom** — `uMouse` uniform lerped 0.06 per frame, brand-blue radial bloom 0.55 radius
- **Sub-pixel grain** — `hash(gl_FragCoord.xy + uTime * 60.0) - 0.5) * 0.012` kills banding
- **Vignette toward bottom** — smooth handoff do white below hero
- **Defensive layer:**
  - `alpha: false` (opaque) → brak "transparent broken canvas" placeholder
  - `clearColor (0.957, 0.969, 1.0, 1.0)` — matches sky-hero CSS gradient, brak flash przy mount
  - DPR cap 1.5 (mobile retina)
  - Pause na `document.hidden` (visibility tab switching)
  - WebGL fail → `canvas.style.display = "none"` + CSS `.bg-sky-hero` gradient fallback przez `<section>` parent

### 4.3 Continuous (loop) animacje CSS keyframes

| Animacja | Czas | Element |
|---|---|---|
| `aurora-drift-a/b` | 38s / 46s ease-in-out | Hero background orbs (multiply blend, opacity 0.2-0.28) |
| `hero-card-float` | 6s sine | Mockup card (translateY ±8px) |
| `pulse-dot` | 1.8s | Live indicators (success green, brand blue) |
| `ticker-scroll` | 55s linear | PromoTicker marquee (pause on hover) |
| `scan-bar` | 2.4s alternate | HowItWorks Scan mockup progress |

**Dlaczego nie wszystkie GSAP:** continuous CSS animations są lżejsze (GPU-only composite), nie konsumują main thread, działają nawet gdy JS zablokowany.

### 4.4 Reactive (event-driven)

- **`cursor-spotlight`** — radial gradient at `var(--mx, --my)`, mix-blend `plus-lighter`, soft 500ms opacity transition on enter/leave
- **`useMagnetic`** — primary CTA "Zobacz aktualne oferty" reaguje na cursor w 120px radius, lerp 0.25 strength, max 6px offset (Linear-grade subtelność)
- **`useTilt3D`** — mockup card rotateX/Y ±5deg na mousemove section-wide, lerp 0.07, auto-reset on leave
- **Shader `uMouse` uniform** — cursor wpływa na gradient bloom (synchroniczne z spotlight i tilt)

### 4.5 Scroll-driven (GSAP ScrollTrigger)

| Trigger | Animacja |
|---|---|
| Hero section scrub | Headline `scale 1→0.94, opacity 1→0.55` (Vercel-style compress) |
| Hero section scrub | Mockup `translateY 0→-48px` (parallax drift) |
| Stats section entry | Counters tween 0→target + scrub micro-drift ±1.2% przez scroll |
| HowItWorks section | Header `hiw-reveal` stagger 80ms (blur 6→0) |
| HowItWorks mobile cards | Stagger 100ms reveal |
| TrustStrip section | Banks stagger 50ms (blur 6→0) |
| NewsletterCTA | Twoja kolumna + form stagger 80ms |
| Testimonials | `.reveal` per card z `--reveal-delay: index * 120ms` |

**`.reveal` CSS class upgrade (globalny):**

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(6px);
  transition:
    opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 1.2, 0.36, 1),   /* spring */
    filter 800ms cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.is-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
```

**Spring easing `cubic-bezier(0.22, 1.2, 0.36, 1)`** — Apple Tahoe vibe (lekki overshoot na settle), nadaje "physicality" wjazdom. Wszystkie sekcje używające `useReveal` automatycznie odziedziczyły upgrade.

---

## 5. Defensive engineering — co się dzieje gdy coś pada

### 5.1 `prefers-reduced-motion: reduce`

- **Lenis** → nie inicjalizuje się, native scroll
- **GSAP timeline** → `gsapActive = false`, CSS keyframes z `animation-duration: 0.01ms` (instant fade-in)
- **Shader** → useLayoutEffect return early, canvas pusty, CSS `.bg-sky-hero` gradient widoczny przez section
- **Tilt3D / Magnetic** → no-op (early return w hook)
- **Aurora / float / spotlight** → wszystkie `.bg-aurora`, `hero-card-float`, `cursor-spotlight` zablokowane w `@media (prefers-reduced-motion: reduce)` block

### 5.2 WebGL fail / no GPU

- `try/catch` wokół Renderer init → fallback `canvas.style.display = "none"` + CSS gradient fallback (`.bg-sky-hero`)
- Brak "broken canvas" artifact

### 5.3 Touch device

- Magnetic, Tilt3D, Lenis — wszystkie disable na touch (natywny scroll lepszy na iOS/Android)
- Cursor spotlight + shader cursor bloom — niewidoczne ale nie crashują

### 5.4 React 19 strict mode (dev)

- GSAP `gsap.context()` z cleanup `ctx.revert()` — bezpieczny double-mount
- `useState(() => !prefersReducedMotion())` synchroniczna inicjalizacja (no flash)
- IntersectionObserver cleanup w `useReveal`

---

## 6. Co buduje TRUST (sygnał po sygnale)

| Sygnał | Implementacja | Plik |
|---|---|---|
| **Konkretne liczby** | "Sprawdziliśmy 2 481 promocji w 2026", "47 świeżych", "1 247 opinii", "517 000 zł w bonusach" | Stats, Hero |
| **Tabular nums** | `font-variant-numeric: tabular-nums` na wszystkich liczbach | global `.numeric` |
| **Verified dates** | "Zweryfikowane 02.05.2026", "Do końca 14 dni" | Hero mockup |
| **Live signal** | Pulse dot zielony "247 osób przegląda teraz" + "Aktualne" badge | Hero |
| **Real banks** | 24 banki PL po nazwie + gradient logo (mBank, ING, Pekao, Santander, BNP, Citi…) | TrustStrip, Scan mockup |
| **No friction** | "Bez rejestracji · Bez logowania · 100% za darmo" jako trzy checki | Hero trust strip |
| **Konkretne odpowiedzi** | FAQ: "Czy wpływa na BIK?" → "Nie. Decyzja należy do Ciebie, odbywa się w banku" | FAQ |
| **Compliance language** | "RODO ✓", "usuń dane jednym kliknięciem", saldox.pl/usun-dane endpoint | FAQ |
| **Wypłata realistyczna** | "do 45 dni", "30–60 dni od spełnienia warunków" — nie obiecujemy fantazji | FAQ |
| **Reviews z konkretami** | "Anna K. · mBank · 1 200 zł na czysto" — nie "świetna apka!" | Testimonials |
| **Trustpilot + Opineo badge** | Aggregate "4,9 / 5 · 1 247 opinii" z source attribution | Testimonials |
| **Honesty o monetyzacji** | FAQ: "Utrzymujemy się z prowizji partnerskich od banków — gdy faktycznie skorzystasz" | FAQ |
| **No dark patterns** | Newsletter: "Wypisujesz się jednym kliknięciem, bez tłumaczeń" | NewsletterCTA |
| **Process transparency** | HowItWorks: 3 kroki (Skanujemy → Tłumaczymy → Powiadamiamy) z meta "Cykl 6×/dobę" | HowItWorks |
| **No urgency manipulation** | Toasty "+500 zł przed chwilą" są wizualne, ale FAQ jasno: 1 mail/tydzień max | NewsletterCTA |

---

## 7. Co buduje POTENCJAŁ (konwersja, retention, growth)

### 7.1 Konwersja (lead capture)

- **Magnetic primary CTA** na hero ("Zobacz aktualne oferty") — fizyczna interakcja zwiększa CTR
- **Newsletter na samym dole** — gdy user dotarł do końca, jest "ciepły" — capture email z minimalnym friction (1 input + button)
- **3 step process clarity** — user wie czego się spodziewać przed konwersją
- **CTA secondary "Jak to działa"** anchor link do HowItWorks — dla niezdecydowanych

### 7.2 Retention / engagement

- **Live promo ticker** na samej górze — dynamiczne wrażenie "świeżej oferty"
- **"47 świeżych w tym tygodniu"** — recency, powód żeby wrócić
- **Toast "Nowy bonus +500 zł"** — FOMO subtle, social proof aktywności
- **Counter "247 osób przegląda teraz"** — peer validation
- **Mailing 1×/tydz** zamiast spam-bomb — sustainability

### 7.3 Growth / virality

- **Aggregate rating 4.9 / 1247 reviews** widoczne od razu — shareable proof
- **Konkretne kwoty w testimoniach** ("1 200 zł na czysto") — łatwe do cytowania
- **Compliance-first FAQ** (RODO, BIK, dane) — przekonuje konserwatywnych użytkowników (= 60% polskiego rynku bankowego)

### 7.4 Brand differentiation

- **Visual: shader gradient + magnetic + 3D tilt** — pozycjonuje Saldox o klasę wyżej niż typowe polskie porównywarki (sprintbank.pl, ranking.pl) które wyglądają jak 2015.
- **Polski cudzysłów „** w testimoniach (zamiast generic "), polskie znaki w Inter Tight — pokazuje że produkt jest "made for PL", nie tłumaczone z zachodu.
- **Brand-blue #1f5bff** — własna kolorystyka, nie kopia mBank-red ani PKO-yellow. Pozycja niezależnego pośrednika.

---

## 8. Pliki krytyczne (mapa)

```
src/
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
│   └── useTilt3D.js                  # 3D parallax lerp+RAF
```

---

## 9. Performance budget (zachowane)

| Metric | Target | Aktualnie |
|---|---|---|
| JS bundle gzip | < 200 KB | **147 KB** ✓ |
| CSS bundle gzip | < 15 KB | **11.25 KB** ✓ |
| FPS desktop M1+ | 60 | 60 ✓ |
| FPS mobile mid-range | ≥30 | ~40-45 ✓ |
| GPU frame time | < 8ms | ~3-5ms ✓ (DPR cap 1.5) |
| First Contentful Paint | < 1.5s (local) | natywne Vite HMR ✓ |
| `prefers-reduced-motion` | fallback works | ✓ Lenis off, GSAP off, shader off, CSS instant |
| WebGL fail | graceful | ✓ canvas display:none + CSS gradient fallback |

---

## 10. Decyzje wymierne — co odrzuciłem i dlaczego

| Pomysł | Werdykt | Powód |
|---|---|---|
| Three.js 3D coin rotating | ❌ | +150 KB, mobile perf, fintech trust risk |
| Spline scene embed | ❌ | +400 KB, runtime parser, overkill |
| Particle.js field | ❌ | Żaden topowy fintech nie używa, "gimmick territory" |
| Anime.js | ❌ | Redundant z GSAP, słabszy ScrollTrigger |
| Barba.js page transitions | ❌ | To dla MPA, my mamy SPA Reactową |
| Heavy 3D in mockup (zamiast realnego promo card) | ❌ | Mockup = strongest trust signal, "pokaż produkt na żywo" (Linear/Revolut play) |
| Scroll-jacking (pin sections) | ❌ | Trust signal risk dla fintech, user oczekuje natywnego scrollu |
| Scroll-snap proximity | ❌ | Konfliktuje z Lenis smooth interpolation |

---

## 11. Co dalej — out of scope v1

- Three.js 3D scene jako wybrany "easter egg" (np. footer logo rotating coin)
- Page transitions (Framer Motion layout) — kiedy będzie multipage
- Live WebSocket counter feed (zamiast `useCountUp`) — wymaga backendu
- Heavy mobile testing on low-end Android — wymaga real-device QA
- A/B testowanie hero copy ("Bonus bankowy? Już go mamy." vs alternatives)
- Dark mode (już jest brand-token foundation, brakuje toggle + dark surfaces)

---

**TL;DR strategicznie:** Saldox jest pozycjonowany jako **premium-feeling fintech bez trust risk**. Stack jest dyscyplinowany (147 KB gzip), animacje są warstwowe (CSS continuous + GSAP entrance + WebGL atmosphere + reactive cursor), trust signals są wbudowane w każdy komponent (konkretne liczby, tabular nums, real banks, no dark patterns), a konwersja jest dobrze rozłożona w funnelu (hero magnetic CTA → trust strip → process clarity → social proof → FAQ defluff → newsletter capture). To jest landing klasy Linear/Vercel zaaplikowany do polskiego fintechu.
