-- You.First Training Programming Schema
-- Run this in your Supabase SQL Editor to set up the database

-- ========== Training Tracks ==========
-- Two tracks: "Athlete Track" and "Functional Fitness Track"

CREATE TABLE IF NOT EXISTS training_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== Exercises ==========
-- Movement definitions with scoring configuration

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  score_type TEXT NOT NULL CHECK (score_type IN ('weight', 'reps', 'time')),
  sort_direction TEXT NOT NULL CHECK (sort_direction IN ('desc', 'asc')),
  is_major BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== Training Days ==========
-- Date-based programming with workouts stored as JSONB
-- workouts column stores Workout[] matching app types:
-- {
--   id: string,
--   trackId: string,
--   dateISO: string,
--   title: string,
--   movements: ScheduledMovement[]
-- }

CREATE TABLE IF NOT EXISTS training_days (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES training_tracks(id) ON DELETE CASCADE,
  date_iso TEXT NOT NULL, -- YYYY-MM-DD format
  week_start_iso TEXT NOT NULL, -- Monday of the week (YYYY-MM-DD)
  workouts JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== Indexes ==========
-- Optimized for common query patterns

-- Fetch single day's programming
CREATE INDEX IF NOT EXISTS idx_training_days_track_date
  ON training_days(track_id, date_iso);

-- Fetch week's programming
CREATE INDEX IF NOT EXISTS idx_training_days_track_week
  ON training_days(track_id, week_start_iso);

-- ========== Row Level Security ==========
-- Enable RLS for all tables

ALTER TABLE training_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_days ENABLE ROW LEVEL SECURITY;

-- ========== RLS Policies ==========
-- Anonymous users can read all training data (published programming)
-- Admin write access will be added in Phase 3

-- Training Tracks: Public read
CREATE POLICY "Training tracks are viewable by everyone"
  ON training_tracks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Exercises: Public read
CREATE POLICY "Exercises are viewable by everyone"
  ON exercises
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Training Days: Public read
CREATE POLICY "Training days are viewable by everyone"
  ON training_days
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ========== Admin Policies (for dashboard/seeding) ==========
-- These allow authenticated service role to manage data
-- In production, use service_role key from admin dashboard only

CREATE POLICY "Service role can manage training tracks"
  ON training_tracks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage exercises"
  ON exercises
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage training days"
  ON training_days
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ========== Updated At Trigger ==========
-- Auto-update updated_at on row changes

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_training_tracks_updated_at
  BEFORE UPDATE ON training_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_days_updated_at
  BEFORE UPDATE ON training_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========== Seed Data (Optional) ==========
-- Uncomment and run to seed initial tracks and exercises

/*
INSERT INTO training_tracks (id, title) VALUES
  ('track-athlete', 'Athlete Track'),
  ('track-functional', 'Functional Fitness Track')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, title, score_type, sort_direction, is_major) VALUES
  ('ex-back-squat', 'Back Squat', 'weight', 'desc', true),
  ('ex-deadlift', 'Deadlift', 'weight', 'desc', true),
  ('ex-bench-press', 'Bench Press', 'weight', 'desc', true),
  ('ex-overhead-press', 'Overhead Press', 'weight', 'desc', true),
  ('ex-pull-ups', 'Pull-ups', 'reps', 'desc', false),
  ('ex-push-ups', 'Push-ups', 'reps', 'desc', false),
  ('ex-rowing', 'Rowing', 'time', 'asc', false),
  ('ex-running', 'Running', 'time', 'asc', false),
  ('ex-box-jumps', 'Box Jumps', 'reps', 'desc', false),
  ('ex-burpees', 'Burpees', 'reps', 'desc', false),
  ('ex-front-squat', 'Front Squat', 'weight', 'desc', false),
  ('ex-power-clean', 'Power Clean', 'weight', 'desc', false)
ON CONFLICT (id) DO NOTHING;
*/
