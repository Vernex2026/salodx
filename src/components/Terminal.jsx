import { useEffect, useRef, useState } from "react";
import { supabase, supabaseReady } from "../lib/supabase";
import { useReveal } from "../hooks/useReveal";

const MIN_LEN = 12;
const MAX_LEN = 2000;

export default function Terminal() {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.4 });
  const [pillRef, pillVisible] = useReveal({ threshold: 0.4 });
  const inputRef = useRef(null);
  const honeypotRef = useRef(null);

  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { kind: "ok" | "err", message }
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (honeypotRef.current?.value) return; // bot trap

    const trimmed = query.trim();
    if (trimmed.length < MIN_LEN) {
      setToast({
        kind: "err",
        message: `Brief krótszy niż ${MIN_LEN} znaków. Opisz dokładniej.`,
      });
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setToast({
        kind: "err",
        message: `Brief dłuższy niż ${MAX_LEN} znaków. Skróć.`,
      });
      return;
    }

    if (!supabaseReady) {
      setToast({
        kind: "err",
        message: "Endpoint niedostępny. Napisz na biuro@vernex.pl",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("site_leads").insert({
      query: trimmed,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 256),
    });
    setSubmitting(false);

    if (error) {
      setToast({
        kind: "err",
        message: "Coś poszło nie tak. Spróbuj ponownie za chwilę.",
      });
      return;
    }

    setQuery("");
    setToast({
      kind: "ok",
      message: "Brief wysłany. Skontaktujemy się w 24h.",
    });
    inputRef.current?.blur();
  }

  return (
    <section
      id="kontakt"
      aria-labelledby="terminal-heading"
      className="terminal-section relative isolate overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center px-6 py-32 text-center sm:px-8 md:py-40 lg:px-12 lg:py-48">
        <div ref={headerRef} className="max-w-3xl">
          <div
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""}`}
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.55)",
              "--pipeline-reveal-delay": "0ms",
            }}
          >
            [ INICJACJA_PROJEKTU ]
          </div>

          <h2
            id="terminal-heading"
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} m-0 mt-6 text-white`}
            style={{
              fontFamily:
                "'Geist', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              "--pipeline-reveal-delay": "120ms",
            }}
          >
            Czas przestać planować.{" "}
            <span style={{ color: "#A1A1AA" }}>Czas wdrożyć.</span>
          </h2>

          <p
            className={`pipeline-reveal ${headerVisible ? "is-visible" : ""} mx-auto mt-6 max-w-[560px]`}
            style={{
              fontSize: "17px",
              lineHeight: 1.55,
              color: "#D4D4D8",
              "--pipeline-reveal-delay": "260ms",
            }}
          >
            Wciśnij Enter — system AI przeanalizuje Twój przypadek i zarezerwuje
            okno na prezentację architektury.
          </p>
        </div>

        <form
          ref={pillRef}
          onSubmit={onSubmit}
          autoComplete="off"
          className={`terminal-pill pipeline-reveal ${pillVisible ? "is-visible" : ""}`}
          style={{ "--pipeline-reveal-delay": "0ms" }}
          data-focused={focused ? "true" : "false"}
        >
          <div className="terminal-pill-head">
            <span className="terminal-pill-tag">[ AGENT // READY ]</span>
            <span className="terminal-pill-status">
              <span className="live-dot" aria-hidden="true" />
              <span>ONLINE</span>
            </span>
          </div>

          <div className="terminal-pill-input-row">
            <span className="terminal-pill-prompt" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Opisz w jednym zdaniu, jaki system chcesz zbudować…"
              maxLength={MAX_LEN}
              disabled={submitting}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Brief — opis projektu"
              className="terminal-pill-input"
            />
            <span
              className="terminal-pill-caret"
              aria-hidden="true"
              data-show={query.length === 0 && !focused ? "true" : "false"}
            />
          </div>

          {/* honeypot — bots fill, humans don't see */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="t-company">Firma (nie wypełniaj)</label>
            <input
              ref={honeypotRef}
              id="t-company"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="terminal-pill-hint">
            <span>
              <kbd>⏎</kbd> <span>wyślij brief</span>
            </span>
            <span>
              {query.length > 0 && (
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  {query.length} / {MAX_LEN}
                </span>
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="terminal-pill-submit"
            aria-label="Wyślij brief"
          >
            {submitting ? "Wysyłam…" : "Wyślij brief"}
          </button>
        </form>

        <p
          className="mt-10"
          style={{
            fontFamily:
              "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.40)",
          }}
        >
          Brief zapisuje się szyfrowanie. Odpowiadamy w ciągu doby roboczej.
        </p>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`terminal-toast terminal-toast--${toast.kind}`}
        >
          {toast.kind === "ok" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </section>
  );
}
