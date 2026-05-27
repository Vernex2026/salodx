import { useCallback } from "react";

const DEFAULT_DELAY_MS = 16;

export function useStreamingTypewriter() {
  return useCallback(async function typewriter(text, onChunk, delayMs = DEFAULT_DELAY_MS) {
    for (let i = 0; i <= text.length; i++) {
      onChunk(text.slice(0, i));
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }, []);
}
