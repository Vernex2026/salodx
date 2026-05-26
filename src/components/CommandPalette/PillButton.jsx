export default function PillButton({ isMobile, onClick }) {
  return (
    <button
      type="button"
      className="cmdk-pill"
      onClick={onClick}
      aria-label="Otwórz agenta Vernex (⌘K)"
    >
      {isMobile ? (
        <>
          <span>Zapytaj agenta</span>
          <span className="cmdk-pill-arrow" aria-hidden="true">→</span>
        </>
      ) : (
        <>
          <span className="cmdk-pill-kbd" aria-hidden="true">⌘ K</span>
          <span>Zapytaj agenta</span>
        </>
      )}
    </button>
  );
}
