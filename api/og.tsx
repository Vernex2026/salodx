import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "#000000",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "#FFFFFF",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            V
          </div>
          <div
            style={{
              fontSize: "40px",
              color: "#FFFFFF",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Vernex
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              color: "#FFFFFF",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            Premium Frontend Engineering
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#A1A1AA",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            AI Agents · WebGL · Architektury B2B
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "20px",
            color: "#71717A",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Claude API</span>
          <span style={{ color: "#3F3F46" }}>·</span>
          <span>Supabase</span>
          <span style={{ color: "#3F3F46" }}>·</span>
          <span>Vercel Edge</span>
          <span style={{ color: "#3F3F46" }}>·</span>
          <span>vernex.pl</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    }
  );
}
