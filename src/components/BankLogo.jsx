/**
 * BankLogo — small inline SVG monograms / abstract marks.
 * Stylized in muted brand colors so they harmonize with Aurora palette.
 */
export default function BankLogo({ bank, size = 40, dark = false }) {
  const id = `${bank}-${size}-${dark ? "d" : "l"}`;
  switch (bank) {
    case "mBank":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="mBank">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E11D48" />
              <stop offset="1" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#FFFFFF"
          >
            mB
          </text>
        </svg>
      );
    case "Santander":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Santander">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#DC2626" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <path
            d="M 12 22 Q 20 12 28 22 Q 20 32 12 22 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "ING":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="ING">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F97316" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="19"
            fill="#FFFFFF"
          >
            ı
          </text>
          <circle cx="14" cy="14" r="2.2" fill="#FFFFFF" />
        </svg>
      );
    case "Pekao":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Pekao">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#B91C1C" />
              <stop offset="1" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#FFFFFF"
          >
            P
          </text>
        </svg>
      );
    case "Alior":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Alior">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#16A34A" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#FFFFFF"
          >
            A
          </text>
        </svg>
      );
    case "PKO":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="PKO">
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1E3A8A" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill={`url(#${id}-g)`} />
          <text
            x="20"
            y="25"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="14"
            fill="#FFFFFF"
          >
            PKO
          </text>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={bank}>
          <rect width="40" height="40" rx="11" fill={dark ? "#1A2942" : "#0B1426"} />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#FAFAF7"
          >
            {bank?.[0] ?? "?"}
          </text>
        </svg>
      );
  }
}
