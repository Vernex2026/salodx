/* PremiumZenSplitLayout — Dolina Krzemowa 2026 hero.
   Białe tło, dwukolumnowy podział: po lewej blok tekstowy
   (brutalist grotesk Geist 800 + opis + czarny pill button),
   po prawej fizyczna tafla na zdjęcie z dark cyan placeholderem.
   Oba bloki dziedziczą fizykę szkła (potrójny shadow + miękki rant).

   Wrapper section dostaje `section-light` — Nav wykrywa tę klasę
   i flipuje na light variant pill nad nim. */

const cardBase = {
  position: "relative",
  borderRadius: "48px",
  overflow: "hidden",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  boxShadow: [
    "0 32px 64px -16px rgba(0, 0, 0, 0.08)",
    "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
    "inset 0 -1px 1px rgba(0, 0, 0, 0.01)",
  ].join(", "),
};

const styles = {
  mainWrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
    paddingTop: "96px",
    paddingBottom: "40px",
  },
  contentContainer: {
    padding: "40px",
    width: "100%",
    maxWidth: "1200px",
    boxSizing: "border-box",
  },
  splitGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    width: "100%",
    alignItems: "stretch",
  },
  textCard: {
    ...cardBase,
    flex: "1 1 460px",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    justifyContent: "space-between",
  },
  imageCard: {
    ...cardBase,
    flex: "1 1 460px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  topLight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  tagLine: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#71717A",
    textTransform: "uppercase",
  },
  headline: {
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    color: "#09090B",
    margin: 0,
    textWrap: "balance",
  },
  headlineMuted: {
    color: "#A1A1AA",
  },
  description: {
    fontSize: "1.1rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#52525B",
    maxWidth: "92%",
    margin: 0,
  },
  button: {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 32px",
    marginTop: "16px",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#FFFFFF",
    backgroundColor: "#09090B",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "transform 0.1s ease, background 0.2s ease",
    textDecoration: "none",
  },
  imagePlaceholder: {
    width: "100%",
    paddingBottom: "62%",
    height: 0,
    backgroundColor: "#09090B",
    borderRadius: "36px",
    position: "relative",
    overflow: "hidden",
  },
  placeholderGradient: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 78% 18%, rgba(0, 229, 255, 0.14) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 22% 88%, rgba(123, 44, 191, 0.18) 0%, rgba(0, 0, 0, 0) 55%)",
  },
  cardStage: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6%",
  },
  cardFloor: {
    position: "absolute",
    left: "16%",
    right: "16%",
    bottom: "10%",
    height: "8%",
    background:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(14px)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "84%",
    aspectRatio: "1.586 / 1",
    borderRadius: "18px",
    overflow: "hidden",
    containerType: "inline-size",
    background: [
      "radial-gradient(at 78% 18%, rgba(0, 229, 255, 0.20) 0%, rgba(0, 0, 0, 0) 45%)",
      "radial-gradient(at 22% 88%, rgba(123, 44, 191, 0.26) 0%, rgba(0, 0, 0, 0) 50%)",
      "linear-gradient(135deg, #14092a 0%, #0a0612 45%, #000000 100%)",
    ].join(", "),
    boxShadow: [
      "0 32px 60px -12px rgba(0,0,0,0.75)",
      "0 20px 36px -14px rgba(0, 229, 255, 0.18)",
      "0 0 0 1px rgba(255,255,255,0.06)",
      "inset 0 1px 0 rgba(255,255,255,0.10)",
      "inset 0 -1px 0 rgba(0,0,0,0.55)",
    ].join(", "),
    transform: "perspective(1500px) rotateX(7deg) rotateY(-14deg)",
    transformOrigin: "center center",
  },
  cardHolographic: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(255,0,110,0) 0%, rgba(255,0,110,0.06) 22%, rgba(0,229,255,0.06) 52%, rgba(0,255,163,0.05) 76%, rgba(255,0,110,0) 100%)",
    mixBlendMode: "screen",
    pointerEvents: "none",
  },
  cardSheen: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(108deg, transparent 32%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.02) 56%, transparent 72%)",
    pointerEvents: "none",
  },
  cardContent: {
    position: "absolute",
    inset: 0,
    padding: "6cqi",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#FFFFFF",
    fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardBrand: {
    display: "flex",
    alignItems: "center",
    gap: "2cqi",
  },
  cardLogo: {
    width: "5.4cqi",
    height: "5.4cqi",
    borderRadius: "1.4cqi",
    background: "linear-gradient(135deg, #FFFFFF 0%, #B8B8C0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.6cqi",
    fontWeight: 800,
    color: "#000000",
    letterSpacing: "-0.05em",
    boxShadow: "inset 0 0 0 0.15cqi rgba(0,0,0,0.06)",
  },
  cardWordmark: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  },
  cardName: {
    fontSize: "3.2cqi",
    fontWeight: 800,
    letterSpacing: "0.06em",
  },
  cardTier: {
    fontSize: "1.5cqi",
    fontWeight: 600,
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.5)",
    marginTop: "0.6cqi",
  },
  cardContactless: {
    width: "5.6cqi",
    height: "5.6cqi",
    opacity: 0.9,
  },
  cardMiddle: {
    display: "flex",
    flexDirection: "column",
    gap: "3.4cqi",
  },
  cardChip: {
    width: "11.5cqi",
    aspectRatio: "1.35 / 1",
    borderRadius: "1.4cqi",
    background:
      "linear-gradient(135deg, #F0CFA0 0%, #C99A5E 45%, #8C6738 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow:
      "inset 0 0 0 0.15cqi rgba(0,0,0,0.3), inset 0 0.2cqi 0.2cqi rgba(255,255,255,0.25)",
  },
  cardChipGrid: {
    position: "absolute",
    inset: "16%",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.3) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,0.3) 50%, transparent 50%)",
    backgroundSize: "50% 33.33%, 33.33% 50%",
    backgroundPosition: "0 0, 0 0",
  },
  cardNumber: {
    fontSize: "4.6cqi",
    fontWeight: 500,
    letterSpacing: "0.06em",
    fontVariantNumeric: "tabular-nums",
    color: "rgba(255,255,255,0.95)",
    fontFamily:
      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    display: "flex",
    gap: "2.6cqi",
  },
  cardNumberDots: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.05em",
  },
  cardBottom: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "4cqi",
  },
  cardFields: {
    display: "flex",
    gap: "5.5cqi",
  },
  cardField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6cqi",
  },
  cardLabel: {
    fontSize: "1.35cqi",
    fontWeight: 600,
    letterSpacing: "0.22em",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: "2.3cqi",
    fontWeight: 500,
    color: "rgba(255,255,255,0.92)",
    letterSpacing: "0.04em",
  },
  cardNetwork: {
    fontSize: "5.2cqi",
    fontWeight: 800,
    fontStyle: "italic",
    letterSpacing: "-0.03em",
    color: "#FFFFFF",
    lineHeight: 1,
  },
};

export default function PremiumZenSplitLayout() {
  return (
    <section
      id="top"
      aria-labelledby="zen-hero-heading"
      className="section-light"
      style={styles.mainWrapper}
    >
      <div style={styles.contentContainer}>
        <div style={styles.splitGrid}>
          {/* LEFT — text card */}
          <div style={styles.textCard}>
            <div style={styles.topLight} />
            <div style={styles.cardContent}>
              <div style={styles.tagLine}>AUTOMATYZACJA</div>
              <h1 id="zen-hero-heading" style={styles.headline}>
                24 Banki. 3 Oferty.
                <br />
                <span style={styles.headlineMuted}>Bezpłatne.</span>
              </h1>
              <p style={styles.description}>
                Codziennie sprawdzamy 24 banki, żebyś Ty nie musiał. Wybieramy 3
                najlepsze oferty tygodnia. Wszystko czego potrzebujesz.
              </p>
              <a href="#promocje" style={styles.button}>
                Zobacz dzisiejsze oferty &rarr;
              </a>
            </div>
          </div>

          {/* RIGHT — image card with Saldox Black premium debit card render */}
          <div style={styles.imageCard}>
            <div style={styles.topLight} />
            <div style={styles.imagePlaceholder} aria-hidden="true">
              <div style={styles.placeholderGradient} />
              <div style={styles.cardStage}>
                <div style={styles.cardFloor} />
                <div style={styles.card}>
                  <div style={styles.cardHolographic} />
                  <div style={styles.cardSheen} />
                  <div style={styles.cardContent}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardBrand}>
                        <div style={styles.cardLogo}>S</div>
                        <div style={styles.cardWordmark}>
                          <div style={styles.cardName}>SALDOX</div>
                          <div style={styles.cardTier}>BLACK</div>
                        </div>
                      </div>
                      <div style={styles.cardContactless}>
                        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                          <g stroke="white" strokeWidth="1.4" strokeLinecap="round">
                            <path d="M9 8.5 Q 11 12 9 15.5" opacity="0.95" />
                            <path d="M12 6 Q 16 12 12 18" opacity="0.7" />
                            <path d="M15 3.5 Q 21 12 15 20.5" opacity="0.5" />
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div style={styles.cardMiddle}>
                      <div style={styles.cardChip}>
                        <div style={styles.cardChipGrid} />
                      </div>
                      <div style={styles.cardNumber}>
                        <span>5314</span>
                        <span style={styles.cardNumberDots}>••••</span>
                        <span style={styles.cardNumberDots}>••••</span>
                        <span>2026</span>
                      </div>
                    </div>
                    <div style={styles.cardBottom}>
                      <div style={styles.cardFields}>
                        <div style={styles.cardField}>
                          <div style={styles.cardLabel}>Holder</div>
                          <div style={styles.cardValue}>J. KOWALSKI</div>
                        </div>
                        <div style={styles.cardField}>
                          <div style={styles.cardLabel}>Exp</div>
                          <div style={styles.cardValue}>05 / 30</div>
                        </div>
                      </div>
                      <div style={styles.cardNetwork}>VISA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
