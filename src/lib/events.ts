// Centralized event bus contract. Keeps `vernex:*` names in one place,
// preventing typos like `vernex:typying`. WindowEventMap augmentation
// lives in `src/vite-env.d.ts` so addEventListener gets the typed
// `event.detail` automatically.

export const VERNEX_EVENTS = {
  CHAT_MODE: "vernex:chat-mode",
  TYPING: "vernex:typing",
  BURST: "vernex:burst",
  OPEN_PALETTE: "vernex:open-palette",
} as const;

export type VernexEventName = (typeof VERNEX_EVENTS)[keyof typeof VERNEX_EVENTS];

export function dispatchChatMode(active: boolean): void {
  window.dispatchEvent(
    new CustomEvent(VERNEX_EVENTS.CHAT_MODE, { detail: { active } })
  );
}

export function dispatchTyping(active: boolean): void {
  window.dispatchEvent(new CustomEvent(VERNEX_EVENTS.TYPING, { detail: { active } }));
}

export function dispatchBurst(origin: [number, number, number]): void {
  window.dispatchEvent(new CustomEvent(VERNEX_EVENTS.BURST, { detail: { origin } }));
}

export function dispatchOpenPalette(): void {
  window.dispatchEvent(new CustomEvent(VERNEX_EVENTS.OPEN_PALETTE));
}
