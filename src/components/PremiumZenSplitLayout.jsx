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
      "radial-gradient(circle at 10% 10%, rgba(0, 229, 255, 0.10) 0%, rgba(0, 0, 0, 0) 60%)",
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

          {/* RIGHT — image card (placeholder until owner drops <img>) */}
          <div style={styles.imageCard}>
            <div style={styles.topLight} />
            <div style={styles.imagePlaceholder} aria-hidden="true">
              <div style={styles.placeholderGradient} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
