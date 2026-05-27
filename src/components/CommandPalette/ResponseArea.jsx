import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ResponseArea({ messages, streaming, offline, onClear }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="cmdk-response">
      {messages.map((m, i) => (
        <Message
          key={i}
          role={m.role}
          content={m.content}
          streaming={streaming && i === messages.length - 1 && m.role === "assistant"}
        />
      ))}

      {offline && !streaming && (
        <div className="cmdk-offline-badge">⚠ Agent offline · biuro@vernex.pl</div>
      )}

      {!streaming && messages.length > 0 && (
        <button type="button" className="cmdk-clear" onClick={onClear}>
          Nowe pytanie
        </button>
      )}

      <div ref={endRef} />
    </div>
  );
}
