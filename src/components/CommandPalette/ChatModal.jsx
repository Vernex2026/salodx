import { useEffect, useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import Suggestions from "./Suggestions";
import ResponseArea from "./ResponseArea";

const SUGGESTED = [
  "Potrzebuję CRM dla kancelarii",
  "Optymalizacja WebGL",
  "Stack technologiczny",
  "Project NEXUS",
];

export default function ChatModal({
  isMobile,
  input,
  setInput,
  messages,
  streaming,
  offline,
  onSubmit,
  onPickSuggestion,
  onClear,
  onClose,
  onTypingPulse,
}) {
  const inputRef = useRef(null);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Agent Vernex"
      className={`cmdk-overlay${isMobile ? " cmdk-overlay--mobile" : ""}`}
      onClick={handleOverlayClick}
    >
      <div ref={trapRef} className={`cmdk-modal${isMobile ? " cmdk-modal--mobile" : ""}`}>
        <form onSubmit={handleSubmit} className="cmdk-input-row">
          <span aria-hidden="true" className="cmdk-input-caret">›</span>
          <input
            ref={inputRef}
            type="text"
            className="cmdk-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              onTypingPulse();
            }}
            placeholder="Zapytaj o architekturę, stack, projekty…"
            disabled={streaming}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="cmdk-esc"
            onClick={onClose}
            aria-label="Zamknij"
          >
            ESC
          </button>
        </form>

        {messages.length === 0 ? (
          <Suggestions items={SUGGESTED} onPick={onPickSuggestion} />
        ) : (
          <ResponseArea
            messages={messages}
            streaming={streaming}
            offline={offline}
            onClear={onClear}
          />
        )}

        <div className="cmdk-footer">
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
  );
}
