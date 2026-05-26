import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAgentChat } from "../../hooks/useAgentChat";
import PillButton from "./PillButton";
import ChatModal from "./ChatModal";

const MOUNT_DELAY_MS = 800;
const MOBILE_BREAKPOINT_PX = 640;
const TYPING_DEBOUNCE_MS = 650;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [chatModeActive, setChatModeActive] = useState(false);

  const { messages, streaming, offline, streamReply, reset } = useAgentChat();

  const typingTimeoutRef = useRef(0);
  const typingActiveRef = useRef(false);

  const dispatchTyping = (active) => {
    window.dispatchEvent(
      new CustomEvent("vernex:typing", { detail: { active } })
    );
  };

  // Kinetic feedback for ParticleCloud — debounced typing pulse
  const onTypingPulse = useCallback(() => {
    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      dispatchTyping(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      typingActiveRef.current = false;
      dispatchTyping(false);
    }, TYPING_DEBOUNCE_MS);
  }, []);

  // Cleanup typing state on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingActiveRef.current) dispatchTyping(false);
    };
  }, []);

  // Terminal broadcasts chat-mode → hide floating pill while in chat
  useEffect(() => {
    const onChatMode = (e) => setChatModeActive(!!e.detail?.active);
    window.addEventListener("vernex:chat-mode", onChatMode);
    return () => window.removeEventListener("vernex:chat-mode", onChatMode);
  }, []);

  // Nav / other CTAs can open the palette without ⌘K
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("vernex:open-palette", onOpen);
    return () => window.removeEventListener("vernex:open-palette", onOpen);
  }, []);

  // Mount delay — let Hero entrance animations finish first
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), MOUNT_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Mobile breakpoint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Global ⌘K / Ctrl+K + Esc
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

  // Body scroll lock when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSubmit = async (text) => {
    setInput("");
    await streamReply(text);
  };

  const handleClear = () => {
    reset();
    setInput("");
  };

  const showPill = mounted && !open && !chatModeActive;

  return (
    <>
      {showPill && <PillButton isMobile={isMobile} onClick={() => setOpen(true)} />}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <ChatModal
            isMobile={isMobile}
            input={input}
            setInput={setInput}
            messages={messages}
            streaming={streaming}
            offline={offline}
            onSubmit={handleSubmit}
            onPickSuggestion={handleSubmit}
            onClear={handleClear}
            onClose={() => setOpen(false)}
            onTypingPulse={onTypingPulse}
          />,
          document.body
        )}
    </>
  );
}
