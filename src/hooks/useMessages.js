import { useCallback, useReducer } from "react";

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case "append":
      return [...state, action.message];
    case "appendUserAndPlaceholder":
      return [
        ...state,
        { role: "user", content: action.userText },
        { role: "assistant", content: "" },
      ];
    case "updateLast":
      if (state.length === 0) return state;
      return state.map((m, i) =>
        i === state.length - 1 && m.role === "assistant"
          ? { ...m, content: action.content }
          : m
      );
    case "clear":
      return initialState;
    default:
      return state;
  }
}

export function useMessages() {
  const [messages, dispatch] = useReducer(reducer, initialState);

  const append = useCallback((message) => dispatch({ type: "append", message }), []);
  const appendUserAndPlaceholder = useCallback(
    (userText) => dispatch({ type: "appendUserAndPlaceholder", userText }),
    []
  );
  const updateLast = useCallback(
    (content) => dispatch({ type: "updateLast", content }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  return { messages, append, appendUserAndPlaceholder, updateLast, clear };
}
