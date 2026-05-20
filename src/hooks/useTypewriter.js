import { useEffect, useState } from "react";

/**
 * useTypewriter — char-by-char text reveal hook.
 * Returns the progressively-revealed substring of `text`.
 * Set `when=false` to halt; resets to empty when text changes.
 */
export function useTypewriter(text, { speed = 20, when = true } = {}) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!when || !text) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, when]);

  return out;
}
