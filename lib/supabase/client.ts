// Supabase client for You.First
// Reads EXPO_PUBLIC_* env vars directly (Expo handles this automatically)

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ========== Configuration ==========

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// ========== Client Singleton ==========

let supabaseClient: SupabaseClient | null = null;

/**
 * Check if Supabase is configured via environment variables.
 * Returns false when env vars are missing (local dev without backend).
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get the Supabase client instance.
 * Returns null if Supabase is not configured.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false, // No auth in V1, just anon reads
      },
    });
  }

  return supabaseClient;
}
