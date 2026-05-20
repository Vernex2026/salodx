/* GeminiFeatureBlock — masywna szklana tafla z mocno zaokrąglonymi
   rogami (48px), ciemny węgiel Onyx z deep drop-shadow. Wzorowane
   na Gemini feature cards: extreme border-radius + dark-material
   glass + grotesk typography. Sits in its own section between
   TrustBlock and Footer (automation feature highlight). */

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    position: "relative",
    maxWidth: "580px",
    width: "100%",
    padding: "48px",
    borderRadius: "48px",
    backgroundColor: "rgba(10, 10, 15, 0.45)",
    backdropFilter: "blur(25px) saturate(140%)",
    WebkitBackdropFilter: "blur(25px) saturate(140%)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 30px 90px -10px rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
    overflow: "hidden",
  },
  topLight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  tag: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#71717A",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "3.2rem",
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: "-0.04em",
    color: "#FFFFFF",
    fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
  },
  description: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#D4D4D8",
    margin: 0,
    maxWidth: "90%",
  },
  button: {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 28px",
    marginTop: "16px",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
    transition: "transform 0.1s ease",
  },
};

export default function GeminiFeatureBlock({
  className = "",
  title = "AUTOMATYZACJA",
  value = "24 Banki",
  description = "Skanowane jednocześnie przez agentów AI w poszukiwaniu zmian.",
  cta = "Sprawdź live →",
}) {
  return (
    <section
      aria-label={title}
      className={`relative isolate overflow-hidden py-24 sm:py-32 lg:py-40 ${className}`}
      style={{ background: "var(--color-black)" }}
    >
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.topLight} />
          <div style={styles.content}>
            <div style={styles.tag}>{title}</div>
            <div style={styles.value}>{value}</div>
            <p style={styles.description}>{description}</p>
          </div>
          <button type="button" style={styles.button}>
            {cta}
          </button>
        </div>
      </div>
    </section>
  );
}
