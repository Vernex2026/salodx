export default function Suggestions({ items, onPick }) {
  return (
    <div className="cmdk-suggestions">
      <div className="cmdk-suggestions-eyebrow">Sugerowane zapytania</div>
      <div className="cmdk-suggestions-grid">
        {items.map((q) => (
          <button
            key={q}
            type="button"
            className="cmdk-suggestion"
            onClick={() => onPick(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
