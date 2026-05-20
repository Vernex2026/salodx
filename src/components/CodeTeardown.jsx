import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

const COLORS = {
  c: "#546E7A", // comment
  k: "#C792EA", // keyword
  s: "#C3E88D", // string
  f: "#82AAFF", // function
  p: "#EEFFFF", // property
  t: "#FFCB6B", // type
  o: "#89DDFF", // operator
  d: "#D4D4D8", // default
};

// Pre-tokenized code — same shape as live `api/chat.ts` (with one
// aspirational Supabase logging line that lives version omits).
const CODE = [
  [{ t: "c", v: "// vernex/api/chat.ts" }],
  [
    { t: "k", v: "import" },
    { t: "d", v: " { " },
    { t: "f", v: "streamText" },
    { t: "d", v: " } " },
    { t: "k", v: "from" },
    { t: "d", v: " " },
    { t: "s", v: "'ai'" },
  ],
  [
    { t: "k", v: "import" },
    { t: "d", v: " { " },
    { t: "f", v: "anthropic" },
    { t: "d", v: " } " },
    { t: "k", v: "from" },
    { t: "d", v: " " },
    { t: "s", v: "'@ai-sdk/anthropic'" },
  ],
  [
    { t: "k", v: "import" },
    { t: "d", v: " { " },
    { t: "f", v: "createClient" },
    { t: "d", v: " } " },
    { t: "k", v: "from" },
    { t: "d", v: " " },
    { t: "s", v: "'@supabase/supabase-js'" },
  ],
  [],
  [
    { t: "k", v: "export const" },
    { t: "d", v: " " },
    { t: "p", v: "runtime" },
    { t: "d", v: " = " },
    { t: "s", v: "'edge'" },
  ],
  [],
  [
    { t: "k", v: "const" },
    { t: "d", v: " " },
    { t: "p", v: "supabase" },
    { t: "d", v: " = " },
    { t: "f", v: "createClient" },
    { t: "d", v: "(" },
  ],
  [
    { t: "d", v: "  " },
    { t: "p", v: "process" },
    { t: "d", v: "." },
    { t: "p", v: "env" },
    { t: "d", v: "." },
    { t: "t", v: "SUPABASE_URL" },
    { t: "o", v: "!" },
    { t: "d", v: "," },
  ],
  [
    { t: "d", v: "  " },
    { t: "p", v: "process" },
    { t: "d", v: "." },
    { t: "p", v: "env" },
    { t: "d", v: "." },
    { t: "t", v: "SUPABASE_KEY" },
    { t: "o", v: "!" },
  ],
  [{ t: "d", v: ")" }],
  [],
  [
    { t: "k", v: "export async function" },
    { t: "d", v: " " },
    { t: "f", v: "POST" },
    { t: "d", v: "(" },
    { t: "p", v: "req" },
    { t: "o", v: ":" },
    { t: "d", v: " " },
    { t: "t", v: "Request" },
    { t: "d", v: ") {" },
  ],
  [
    { t: "d", v: "  " },
    { t: "k", v: "const" },
    { t: "d", v: " { " },
    { t: "p", v: "messages" },
    { t: "d", v: " } = " },
    { t: "k", v: "await" },
    { t: "d", v: " " },
    { t: "p", v: "req" },
    { t: "d", v: "." },
    { t: "f", v: "json" },
    { t: "d", v: "()" },
  ],
  [],
  [
    { t: "d", v: "  " },
    { t: "k", v: "await" },
    { t: "d", v: " " },
    { t: "p", v: "supabase" },
    { t: "d", v: "." },
    { t: "f", v: "from" },
    { t: "d", v: "(" },
    { t: "s", v: "'queries'" },
    { t: "d", v: ")." },
    { t: "f", v: "insert" },
    { t: "d", v: "({" },
  ],
  [
    { t: "d", v: "    " },
    { t: "p", v: "payload" },
    { t: "o", v: ":" },
    { t: "d", v: " " },
    { t: "p", v: "messages" },
    { t: "d", v: "," },
  ],
  [
    { t: "d", v: "    " },
    { t: "p", v: "ts" },
    { t: "o", v: ":" },
    { t: "d", v: " " },
    { t: "k", v: "new" },
    { t: "d", v: " " },
    { t: "f", v: "Date" },
    { t: "d", v: "()." },
    { t: "f", v: "toISOString" },
    { t: "d", v: "()," },
  ],
  [{ t: "d", v: "  })" }],
  [],
  [
    { t: "d", v: "  " },
    { t: "k", v: "const" },
    { t: "d", v: " " },
    { t: "p", v: "result" },
    { t: "d", v: " = " },
    { t: "f", v: "streamText" },
    { t: "d", v: "({" },
  ],
  [
    { t: "d", v: "    " },
    { t: "p", v: "model" },
    { t: "o", v: ":" },
    { t: "d", v: " " },
    { t: "f", v: "anthropic" },
    { t: "d", v: "(" },
    { t: "s", v: "'claude-sonnet-4-6'" },
    { t: "d", v: ")," },
  ],
  [
    { t: "d", v: "    " },
    { t: "p", v: "system" },
    { t: "o", v: ":" },
    { t: "d", v: " " },
    { t: "s", v: "'Architekt systemów Vernex.'" },
    { t: "d", v: "," },
  ],
  [
    { t: "d", v: "    " },
    { t: "p", v: "messages" },
    { t: "d", v: "," },
  ],
  [{ t: "d", v: "  })" }],
  [],
  [
    { t: "d", v: "  " },
    { t: "k", v: "return" },
    { t: "d", v: " " },
    { t: "p", v: "result" },
    { t: "d", v: "." },
    { t: "f", v: "toTextStreamResponse" },
    { t: "d", v: "()" },
  ],
  [{ t: "d", v: "}" }],
];

const TAGS = ["React 19", "Vercel AI SDK", "Anthropic Claude", "Edge Functions"];

export default function CodeTeardown() {
  return (
    <section
      id="anatomia"
      aria-labelledby="teardown-heading"
      className="relative isolate overflow-hidden"
      style={{ background: "#000000" }}
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 lg:gap-20">
          <TeardownText />
          <Terminal />
        </div>
      </div>
    </section>
  );
}

function TeardownText() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} flex flex-col gap-6 md:gap-7`}
    >
      <div
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        [ ANATOMIA STACKU ]
      </div>

      <h2
        id="teardown-heading"
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "clamp(2.25rem, 5.5vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        Surowy kod.{" "}
        <span style={{ color: "#A1A1AA" }}>Zero abstrakcji.</span>
      </h2>

      <p
        style={{
          fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          fontSize: "17px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#D4D4D8",
          maxWidth: "44ch",
          margin: 0,
        }}
      >
        To nie design system w Figmie. To produkcyjny kod, który właśnie
        streamuje odpowiedzi w Cmd+K. Vercel AI SDK, Anthropic, Supabase,
        Edge Runtime. Każdy znak — taki sam jak w naszych repo.
      </p>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {TAGS.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "5px 11px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "9999px",
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: "11.5px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Terminal() {
  const [ref, visible] = useReveal({ threshold: 0.25 });
  const [shown, setShown] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      reducedRef.current = true;
      setShown(CODE.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= CODE.length) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, [visible]);

  const allDone = shown >= CODE.length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0A0A0F",
          boxShadow: "0 28px 56px -16px rgba(0,0,0,0.7)",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "36px",
            padding: "0 14px",
            background: "rgba(255,255,255,0.035)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            <span
              aria-hidden="true"
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "#FF5F57",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "#FEBC2E",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "#28C840",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'JetBrains Mono', 'Geist Mono', ui-monospace, monospace",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.02em",
            }}
          >
            vernex/api/chat.ts
          </div>
        </div>

        {/* Code area */}
        <div
          style={{
            padding: "20px 18px",
            fontFamily:
              "'JetBrains Mono', 'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "13.5px",
            lineHeight: 1.65,
            overflowX: "auto",
          }}
        >
          {CODE.map((line, i) => {
            const isVisible = i < shown;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(6px)",
                  transition:
                    "opacity 220ms ease-out, transform 220ms ease-out",
                  whiteSpace: "pre",
                  minHeight: "1.65em",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "28px",
                    paddingRight: "16px",
                    textAlign: "right",
                    color: "#3F3F46",
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
                <span>
                  {line.map((tok, j) => (
                    <span
                      key={j}
                      style={{
                        color: COLORS[tok.t] || COLORS.d,
                        fontStyle: tok.t === "c" ? "italic" : "normal",
                      }}
                    >
                      {tok.v}
                    </span>
                  ))}
                  {allDone && i === CODE.length - 1 && (
                    <span
                      className="cmdk-cursor"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      ▍
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
