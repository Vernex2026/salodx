import { useEffect, useRef, useState } from "react";
import { supabase, supabaseReady } from "../lib/supabase";
import { useReveal } from "../hooks/useReveal";
import { useAgentChat } from "../hooks/useAgentChat";

const MIN_LEN = 12;
const MAX_LEN = 2000;
const LAUNCH_TRANSITION_MS = 600;

export default function Terminal() {
  const [headerRef, headerVisible] = useReveal({ threshold: 0.4 });
  const [pillRef, pillVisible] = useReveal({ threshold: 0.4 });
  const inputRef = useRef(null);
  const honeypotRef = useRef(null);
  const chatInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [focused, setFocused] = useState(false);

  // v28 Agent Chat Mode — submit transforms section into white chat container.
  // idle → launching (burst + white wash) → chatting (white chat UI)
  const [mode, setMode] = useState("idle");
  const [chatInput, setChatInput] = useState("");
  const { messages, streaming: chatStreaming, streamReply } = useAgentChat();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  // v30: direct scrollTop assignment na messages container — NIE używamy
  // scrollIntoView (bubbluje do parent snap container <main> i wymusza
  // scroll viewport do najbliższego snap-point = Hero).
  useEffect(() => {
    if (mode === "chatting" && messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, mode]);

  // v31: broadcast chat-mode state — CommandPalette listens i ukrywa
  // floating ⌘K pill gdy klient już w live chat (redundancja UX).
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("vernex:chat-mode", {
        detail: { active: mode !== "idle" },
      })
    );
    return () => {
      // Cleanup on unmount — signal idle so pill returns
      window.dispatchEvent(
        new CustomEvent("vernex:chat-mode", { detail: { active: false } })
      );
    };
  }, [mode]);

  // v30: focus z preventScroll: true — domyślnie focus() scrolluje
  // viewport żeby pokazać input. Z snap-mandatory parentem to wybija
  // scroll do top page.
  useEffect(() => {
    if (mode === "chatting") {
      const t = setTimeout(
        () => chatInputRef.current?.focus({ preventScroll: true }),
        400
      );
      return () => clearTimeout(t);
    }
  }, [mode]);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting || mode !== "idle") return;
    if (honeypotRef.current?.value) return;

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

    setSubmitting(true);

    // Fire-and-forget Supabase insert — errors logged, NOT blocking chat mode
    if (supabaseReady) {
      supabase
        .from("site_leads")
        .insert({
          query: trimmed,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent.slice(0, 256),
        })
        .then(({ error }) => {
          if (error) console.warn("site_leads insert failed:", error);
        });
    }

    // Dispatch particle burst — origin from pill center in approximate world coords.
    // Camera at z=9 fov 60 → viewport ≈ 10 units wide at z=0.
    let originWorld = [0, -2, 0];
    const rect = pillRef.current?.getBoundingClientRect();
    if (rect) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ndcX = ((rect.left + rect.width / 2) / vw) * 2 - 1;
      const ndcY = -(((rect.top + rect.height / 2) / vh) * 2 - 1);
      originWorld = [ndcX * 6, ndcY * 4, 0];
    }
    window.dispatchEvent(
      new CustomEvent("vernex:burst", { detail: { origin: originWorld } })
    );

    setMode("launching");
    // v31: 850 → 600ms sync z bg transition (520→600ms). Eliminuje
    // ~300ms ghost period gdzie bg już biały ALE chat shell jeszcze
    // niemontowany.
    setTimeout(() => {
      setMode("chatting");
      streamReply(trimmed);
      setSubmitting(false);
    }, LAUNCH_TRANSITION_MS);
  }

  function onChatSubmit(e) {
    e.preventDefault();
    const q = chatInput.trim();
    if (!q || chatStreaming) return;
    setChatInput("");
    streamReply(q);
  }

  const isChat = mode === "chatting";

  return (
    <section
      id="kontakt"
      aria-labelledby="terminal-heading"
      className={`terminal-section h-screen w-screen relative isolate flex items-center justify-center px-6 pt-24 pb-16 md:px-10 md:pt-28 md:pb-20 overflow-hidden snap-start${
        mode !== "idle" ? " terminal-section--launched section-light" : ""
      }`}
      data-mode={mode}
    >
      <div
        className={`relative z-10 mx-auto flex w-full flex-col items-center px-2 text-center sm:px-4 ${
          isChat ? "h-full justify-start" : "justify-center"
        }`}
        style={{
          maxWidth: "1100px",
        }}
      >
        {!isChat && (
          <div
            ref={headerRef}
            className="max-w-3xl"
            data-launching={mode === "launching" ? "true" : "false"}
          >
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
        )}

        {!isChat && (
          <form
            ref={pillRef}
            onSubmit={onSubmit}
            autoComplete="off"
            className={`terminal-pill pipeline-reveal ${pillVisible ? "is-visible" : ""}`}
            style={{
              "--pipeline-reveal-delay": "0ms",
              opacity: mode === "launching" ? 0 : 1,
              transform: mode === "launching" ? "scale(0.92)" : "scale(1)",
              transition: "opacity 320ms ease-out, transform 320ms ease-out",
              pointerEvents: mode === "launching" ? "none" : "auto",
            }}
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

            <button
              type="submit"
              disabled={submitting}
              className="terminal-pill-submit"
              aria-label="Wyślij brief"
            >
              {submitting ? "Wysyłam…" : "Wyślij brief"}
            </button>
          </form>
        )}

        {!isChat && (
          <p
            className="mt-10"
            style={{
              fontFamily:
                "'Geist Mono', ui-monospace, SFMono-Regular, monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.62)",
              opacity: mode === "launching" ? 0 : 1,
              transition: "opacity 320ms ease-out",
            }}
          >
            Brief zapisuje się szyfrowanie. Odpowiadamy w ciągu doby roboczej.
          </p>
        )}

        {isChat && (
          <div className="terminal-chat-shell">
            {/* v31: Gemini/Siri thinking glow — pulsuje gdy LLM stream w toku */}
            <div
              className={`terminal-thinking-glow${chatStreaming ? " is-active" : ""}`}
              aria-hidden="true"
            />
            <div className="terminal-chat-head">
              <span className="terminal-chat-tag">[ AGENT // ACTIVE ]</span>
              <span className="terminal-chat-status">
                <span className="terminal-chat-dot" aria-hidden="true" />
                <span>BRIEF ZAREJESTROWANY · ANALIZUJĘ</span>
              </span>
            </div>

            <div
              ref={messagesContainerRef}
              className="terminal-chat-messages"
              role="log"
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`terminal-chat-msg terminal-chat-msg--${msg.role}`}
                >
                  <span className="terminal-chat-msg-role">
                    {msg.role === "user" ? "Ty" : "Vernex"}
                  </span>
                  <div className="terminal-chat-msg-body">
                    {msg.content ||
                      (chatStreaming && i === messages.length - 1 ? "…" : "")}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={onChatSubmit} className="terminal-chat-input-row">
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Dopytaj o architekturę, harmonogram, koszty…"
                disabled={chatStreaming}
                autoComplete="off"
                className="terminal-chat-input"
                maxLength={MAX_LEN}
              />
              <button
                type="submit"
                disabled={chatStreaming || !chatInput.trim()}
                className="terminal-chat-submit"
              >
                {chatStreaming ? "…" : "Wyślij"}
              </button>
            </form>

            <p className="terminal-chat-footer">
              Twoja rozmowa jest prywatna. Brief został już zapisany —
              odezwiemy się w ciągu doby roboczej, nawet jeśli zamkniesz to okno.
            </p>
          </div>
        )}
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
