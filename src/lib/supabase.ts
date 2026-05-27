import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// VERNEX project Supabase. Publishable key — designed for client bundle
// exposure (anon role, INSERT-only on site_leads via RLS). Hardcoded
// fallback ensures the agent works even when the host platform misses
// the env vars; the env vars still take precedence if set.
const FALLBACK_URL = "https://yachdnnoudjxdxflcjrg.supabase.co";
const FALLBACK_KEY = "sb_publishable_TRUV6CW9KsAikkSGkI4USg_W-tpfkvg";

const url: string = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const key: string = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export const supabaseReady: boolean = Boolean(supabase);
