// AuthRepo: Manages authentication session for You.First
// Uses Supabase Anonymous Sign-ins for seamless identity without login gates

import { getSupabase } from './client';

/**
 * Ensures an authenticated session exists.
 *
 * If no session exists, creates an anonymous session via Supabase Auth.
 * Anonymous users can later link to email/password if needed.
 *
 * This function is designed to be non-blocking and safe:
 * - Checks for existing session first (no repeated sign-ins)
 * - Fails silently if Supabase not configured or network unavailable
 * - Should be called once at app start (e.g., in root layout)
 */
export async function ensureSession(): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      // Supabase not configured, skip silently
      return;
    }

    // Check for existing session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('AuthRepo: Error checking session:', sessionError.message);
      return;
    }

    // If session exists, we're done
    if (session) {
      return;
    }

    // No session exists, create anonymous session
    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      console.error('AuthRepo: Error creating anonymous session:', signInError.message);
    }
  } catch (error) {
    // Fail silently for any unexpected errors (e.g., network offline)
    console.error('AuthRepo: Unexpected error in ensureSession:', error);
  }
}

/**
 * Get the current user's ID from the session.
 * Returns null if no session exists or Supabase not configured.
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch (error) {
    console.error('AuthRepo: Error getting current user ID:', error);
    return null;
  }
}
