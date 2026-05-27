import { useCallback } from "react";

const DEFAULT_DELAY_MS = 16;

export type TypewriterOnChunk = (chunk: string) => void;

export function useStreamingTypewriter() {
  return useCallback(async function typewriter(
    text: string,
    onChunk: TypewriterOnChunk,
    delayMs: number = DEFAULT_DELAY_MS
  ): Promise<void> {
    for (let i = 0; i <= text.length; i++) {
      onChunk(text.slice(0, i));
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }, []);
}
