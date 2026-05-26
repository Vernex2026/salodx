import Glyph from "./Glyph";
import { INTEGRATIONS } from "../../data/integrations";

export default function FallbackGrid({ onSelect }) {
  return (
    <div className="cloud-fallback-grid">
      {INTEGRATIONS.map((tile, i) => (
        <button
          key={tile.id}
          type="button"
          className="cloud-fallback-tile"
          onClick={() => onSelect(tile.id)}
          style={{ ["--tile-accent"]: tile.accent }}
        >
          <span className="gaze-tile-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="cloud-fallback-glyph">
            <Glyph type={tile.glyph} accent={tile.accent} />
          </div>
          <span className="gaze-tile-badge">{tile.tag}</span>
          <h3 className="gaze-tile-title">{tile.title}</h3>
          <p className="gaze-tile-metric">{tile.metric}</p>
        </button>
      ))}
    </div>
  );
}
