import { useCallback, useState } from "react";
import { useMessages, type ChatMessage } from "./useMessages";
import { useStreamingTypewriter } from "./useStreamingTypewriter";

const OFFLINE_MESSAGE =
  "⚠ Agent chwilowo offline. Napisz brief na biuro@vernex.pl — wracamy z propozycją architektury w 24h.";

export function useAgentChat() {
  const { messages, appendUserAndPlaceholder, updateLast, clear } = useMessages();
  const [streaming, setStreaming] = useState(false);
  const [offline, setOffline] = useState(false);
  const typewriter = useStreamingTypewriter();

  const streamReply = useCallback(
    async (userText: string): Promise<void> => {
      const text = (userText ?? "").trim();
      if (!text || streaming) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: text },
      ];
      appendUserAndPlaceholder(text);
      setStreaming(true);
      setOffline(false);

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
      } catch {
        setOffline(true);
        await typewriter(OFFLINE_MESSAGE, updateLast);
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, appendUserAndPlaceholder, updateLast, typewriter]
  );

  const reset = useCallback(() => {
    clear();
    setOffline(false);
  }, [clear]);

  return { messages, streaming, offline, streamReply, reset };
}
