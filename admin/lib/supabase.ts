import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key, respects RLS)
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side Supabase client (uses service role, bypasses RLS)
// Use this for admin write operations
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types (matching your app's schema)
export type Exercise = {
  id: string;
  title: string;
  score_type: 'weight' | 'reps' | 'time';
  sort_direction: 'asc' | 'desc';
  is_major: boolean;
  created_at?: string;
  // Note: exercises table has no updated_at column
};

export type TrainingTrack = {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
};

export type ScheduledMovement = {
  id: string;
  exerciseId: string;
  targetText?: string;
  notes?: string;
  order: number;
};

export type Workout = {
  id: string;
  trackId: string;
  dateISO: string;
  title: string;
  movements: ScheduledMovement[];
};

export type TrainingDay = {
  id: string;
  track_id: string;
  date_iso: string;
  week_start_iso: string;
  workouts: Workout[];
  created_at?: string;
  updated_at?: string;
};
