import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SUGGESTED = [
  "Potrzebuję CRM dla kancelarii",
  "Optymalizacja WebGL",
  "Stack technologiczny",
  "Project NEXUS",
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // [{role, content}]
  const [streaming, setStreaming] = useState(false);
  const [offline, setOffline] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // v31: hide floating pill gdy Terminal jest w live chat — Terminal
  // dispatchuje "vernex:chat-mode" {active}. Eliminuje redundancję
  // dwa wejścia do tego samego asystenta.
  const [chatModeActive, setChatModeActive] = useState(false);
  const inputRef = useRef(null);
  const responseEndRef = useRef(null);
  const typingTimeoutRef = useRef(0);
  const typingActiveRef = useRef(false);

  useEffect(() => {
    const onChatMode = (e) => {
      setChatModeActive(!!(e.detail && e.detail.active));
    };
    window.addEventListener("vernex:chat-mode", onChatMode);
    return () => window.removeEventListener("vernex:chat-mode", onChatMode);
  }, []);

  // v33: Nav "Skontaktuj się" + inne CTA mogą otworzyć paletę bez
  // potrzeby Cmd+K. Replace mailto: linki na premium UX.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("vernex:open-palette", onOpen);
    return () => window.removeEventListener("vernex:open-palette", onOpen);
  }, []);

  // Kinetic feedback: broadcast typing state to ParticleCloud via window event.
  // Debounced 650ms — particles relax back to idle after typing stops.
  const signalTyping = () => {
    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      window.dispatchEvent(
        new CustomEvent("vernex:typing", { detail: { active: true } })
      );
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      typingActiveRef.current = false;
      window.dispatchEvent(
        new CustomEvent("vernex:typing", { detail: { active: false } })
      );
    }, 650);
  };

  useEffect(() => () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typingActiveRef.current) {
      window.dispatchEvent(
        new CustomEvent("vernex:typing", { detail: { active: false } })
      );
    }
  }, []);

  // Mount delay 800ms — let Hero entrance animations finish before
  // pill appears at the bottom.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Mobile detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Global Cmd+K / Ctrl+K listener (+ Esc)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Body scroll lock when modal open; focus input on open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusT = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(focusT);
    };
  }, [open]);

  // Auto-scroll to bottom when tokens stream in
  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function sendQuery(rawQuery) {
    const query = (rawQuery || "").trim();
    if (!query || streaming) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", content: query }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setStreaming(true);
    setOffline(false);

    const updateLast = (text) => {
      setMessages((prev) => {
        if (!prev.length) return prev;
        const copy = prev.slice();
        const lastIdx = copy.length - 1;
        if (copy[lastIdx].role === "assistant") {
          copy[lastIdx] = { role: "assistant", content: text };
        }
        return copy;
      });
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok || !res.body) throw new Error("endpoint-error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        updateLast(acc);
      }
    } catch (err) {
      setOffline(true);
      const text =
        "⚠ Agent chwilowo offline. Napisz brief na biuro@vernex.pl — wracamy z propozycją architektury w 24h.";
      for (let i = 0; i <= text.length; i++) {
        updateLast(text.slice(0, i));
        await new Promise((r) => setTimeout(r, 18));
      }
    } finally {
      setStreaming(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuery(input);
  }

  function clearConversation() {
    setMessages([]);
    setOffline(false);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const showPill = mounted && !open && !chatModeActive;

  const pill = showPill ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Otwórz agenta Vernex (⌘K)"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        height: "40px",
        padding: "0 16px",
        borderRadius: "9999px",
        background: "rgba(15,15,20,0.92)",
        WebkitBackdropFilter: "blur(32px)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 12px 32px -8px rgba(0,0,0,0.65)",
        color: "rgba(255,255,255,0.92)",
        fontFamily: "'Geist', sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 40,
        cursor: "pointer",
        animation: "cmdk-pill-rise 600ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {isMobile ? (
        <>
          <span>Zapytaj agenta</span>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            →
          </span>
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 7px",
              borderRadius: "5px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.02em",
            }}
          >
            ⌘ K
          </span>
          <span>Zapytaj agenta</span>
        </>
      )}
    </button>
  ) : null;

  const modal = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Agent Vernex"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        padding: isMobile ? "12px" : "24px",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "cmdk-overlay-in 200ms ease-out both",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: isMobile ? "92vh" : "76vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(15,15,20,0.92)",
          WebkitBackdropFilter: "blur(40px) saturate(110%)",
          backdropFilter: "blur(40px) saturate(110%)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "20px",
          boxShadow:
            "0 32px 64px -16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)",
          color: "#FFFFFF",
          fontFamily: "'Geist', sans-serif",
          overflow: "hidden",
          animation: "cmdk-modal-in 220ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: "#71717A",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "15px",
              lineHeight: 1,
            }}
          >
            ›
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              signalTyping();
            }}
            placeholder="Zapytaj o architekturę, stack, projekty…"
            disabled={streaming}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#FFFFFF",
              fontFamily: "'Geist', sans-serif",
              fontSize: "15.5px",
              fontWeight: 400,
              padding: 0,
            }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Zamknij"
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#71717A",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </form>

        {/* Body: suggestions or response */}
        {messages.length === 0 ? (
          <Suggestions onPick={sendQuery} items={SUGGESTED} />
        ) : (
          <ResponseArea
            messages={messages}
            streaming={streaming}
            offline={offline}
            endRef={responseEndRef}
            onClear={clearConversation}
          />
        )}

        {/* Footer hint */}
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#52525B",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          <span>Vernex Agent · v1</span>
          <span>
            {streaming
              ? "STREAMING…"
              : messages.length === 0
                ? "Press Enter"
                : "Esc to close"}
          </span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {pill}
      {typeof document !== "undefined" &&
        modal &&
        createPortal(modal, document.body)}
    </>
  );
}

function Suggestions({ onPick, items }) {
  return (
    <div
      style={{
        padding: "16px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: "#71717A",
          textTransform: "uppercase",
        }}
      >
        Sugerowane zapytania
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "9999px",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Geist', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResponseArea({ messages, streaming, offline, endRef, onClear }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        minHeight: "180px",
      }}
    >
      {messages.map((m, i) => (
        <Message
          key={i}
          role={m.role}
          content={m.content}
          streaming={
            streaming && i === messages.length - 1 && m.role === "assistant"
          }
        />
      ))}

      {offline && !streaming && (
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#52525B",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          ⚠ Agent offline · biuro@vernex.pl
        </div>
      )}

      {!streaming && messages.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          style={{
            alignSelf: "flex-start",
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "9999px",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "11.5px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          Nowe pytanie
        </button>
      )}

      <div ref={endRef} />
    </div>
  );
}

function Message({ role, content, streaming }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: role === "user" ? "#A1A1AA" : "#71717A",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {role === "user" ? "Ty" : "Vernex Agent"}
      </div>
      <div
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: "14.5px",
          lineHeight: 1.6,
          color: role === "user" ? "#FFFFFF" : "#D4D4D8",
          whiteSpace: "pre-wrap",
        }}
      >
        {content || (streaming ? "" : "")}
        {streaming && <span className="cmdk-cursor">▍</span>}
      </div>
    </div>
  );
}
