/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface VernexChatModeDetail {
  active: boolean;
}
interface VernexTypingDetail {
  active: boolean;
}
interface VernexBurstDetail {
  origin: [number, number, number];
}

interface WindowEventMap {
  "vernex:chat-mode": CustomEvent<VernexChatModeDetail>;
  "vernex:typing": CustomEvent<VernexTypingDetail>;
  "vernex:burst": CustomEvent<VernexBurstDetail>;
  "vernex:open-palette": CustomEvent<void>;
}
