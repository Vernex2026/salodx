const SIZE = 36;

export default function Glyph({ type, accent }) {
  const c = accent || "#00E5A0";

  switch (type) {
    case "fintech":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <rect x="10" y="28" width="6" height="18" rx="1" fill={c} opacity="0.45" />
          <rect x="22" y="18" width="6" height="28" rx="1" fill={c} opacity="0.7" />
          <rect x="34" y="22" width="6" height="24" rx="1" fill={c} opacity="0.55" />
          <rect x="46" y="12" width="6" height="34" rx="1" fill={c} />
        </svg>
      );
    case "ai":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <path d="M28 8 L31 22 L45 25 L31 28 L28 42 L25 28 L11 25 L25 22 Z" fill={c} />
          <circle cx="42" cy="14" r="2.5" fill={c} opacity="0.7" />
          <circle cx="14" cy="42" r="2" fill={c} opacity="0.5" />
        </svg>
      );
    case "crm":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          {[14, 28, 42].map((y) =>
            [14, 28, 42].map((x) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.8" fill={c} opacity={(x + y) / 90} />
            ))
          )}
        </svg>
      );
    case "legal":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <path
            d="M28 8 L44 14 L44 28 C44 38 36 46 28 48 C20 46 12 38 12 28 L12 14 Z"
            stroke={c}
            strokeWidth="2"
            fill={`${c}14`}
          />
          <rect x="23" y="24" width="10" height="11" rx="1" stroke={c} strokeWidth="1.5" fill="none" />
          <path
            d="M25 24 L25 20 C25 18 26 17 28 17 C30 17 31 18 31 20 L31 24"
            stroke={c}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      );
    case "ecom":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <path
            d="M10 14 L14 14 L18 36 L42 36 L46 20 L18 20"
            stroke={c}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="22" cy="42" r="3" fill={c} />
          <circle cx="38" cy="42" r="3" fill={c} />
        </svg>
      );
    case "logistics":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          {[
            [10, 10], [16, 10], [22, 10], [10, 16], [22, 16],
            [10, 22], [16, 22], [22, 22],
            [34, 10], [40, 10], [46, 10], [34, 16], [46, 16],
            [34, 22], [40, 22], [46, 22],
            [10, 34], [16, 34], [22, 34], [10, 40], [22, 40],
            [10, 46], [16, 46], [22, 46],
            [34, 34], [40, 34], [34, 40], [40, 40], [46, 40],
            [34, 46], [40, 46], [46, 46],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="3.4" height="3.4" fill={c} opacity={(i % 5) / 5 + 0.4} />
          ))}
        </svg>
      );
    case "cloud":
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <path
            d="M14 36 C9 36 6 32 8 28 C5 22 11 16 18 18 C20 12 28 10 33 14 C40 12 47 18 45 26 C50 28 49 36 42 36 Z"
            stroke={c}
            strokeWidth="2"
            fill={`${c}10`}
          />
          <circle cx="20" cy="44" r="1.6" fill={c} opacity="0.6" />
          <circle cx="28" cy="46" r="1.6" fill={c} opacity="0.8" />
          <circle cx="36" cy="44" r="1.6" fill={c} opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg width={SIZE} height={SIZE} viewBox="0 0 56 56" fill="none" aria-hidden>
          <circle cx="28" cy="28" r="8" fill={c} opacity="0.9" />
          <circle cx="28" cy="28" r="14" stroke={c} strokeWidth="1" opacity="0.5" fill="none" />
          <circle cx="28" cy="28" r="20" stroke={c} strokeWidth="0.5" opacity="0.3" fill="none" />
          <circle cx="14" cy="28" r="1.6" fill={c} />
          <circle cx="42" cy="28" r="1.6" fill={c} />
          <circle cx="28" cy="14" r="1.6" fill={c} />
          <circle cx="28" cy="42" r="1.6" fill={c} />
        </svg>
      );
  }
}
