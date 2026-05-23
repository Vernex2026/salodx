import { BLOCKS_DATA } from "./blocksData";

export function QuantumCoreFallback() {
  return (
    <div className="quantum-fallback-grid">
      <div className="quantum-fallback-header">
        <span className="quantum-fallback-badge">[ VERNEX // CORE ]</span>
        <h2>Wewnątrz rdzenia</h2>
        <p>Sześć systemów. Jeden warsztat.</p>
      </div>
      <div className="quantum-fallback-blocks">
        {BLOCKS_DATA.map((data, i) => (
          <article key={i} className="quantum-fallback-card">
            <div className="quantum-fallback-card-badge" style={{ color: data.accent }}>
              {data.stack}
            </div>
            <h3>{data.title}</h3>
            <p>{data.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
