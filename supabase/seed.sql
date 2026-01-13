-- You.First Seed Data
-- Run this after schema.sql to populate initial training data

-- ========== Clear existing data (optional, for re-seeding) ==========
-- Uncomment these lines if you need to reset:
-- DELETE FROM training_days;
-- DELETE FROM exercises;
-- DELETE FROM training_tracks;

-- ========== Training Tracks ==========

INSERT INTO training_tracks (id, title) VALUES
  ('track-athlete', 'Athlete Track'),
  ('track-functional', 'Functional Fitness Track')
ON CONFLICT (id) DO NOTHING;

-- ========== Exercises ==========

INSERT INTO exercises (id, title, score_type, sort_direction, is_major) VALUES
  -- Major movements (show on PRs dashboard)
  ('ex-back-squat', 'Back Squat', 'weight', 'desc', true),
  ('ex-deadlift', 'Deadlift', 'weight', 'desc', true),
  ('ex-bench-press', 'Bench Press', 'weight', 'desc', true),
  ('ex-overhead-press', 'Overhead Press', 'weight', 'desc', true),
  -- Non-major movements
  ('ex-pull-ups', 'Pull-ups', 'reps', 'desc', false),
  ('ex-push-ups', 'Push-ups', 'reps', 'desc', false),
  ('ex-rowing', 'Rowing', 'time', 'asc', false),
  ('ex-running', 'Running', 'time', 'asc', false),
  ('ex-box-jumps', 'Box Jumps', 'reps', 'desc', false),
  ('ex-burpees', 'Burpees', 'reps', 'desc', false),
  ('ex-front-squat', 'Front Squat', 'weight', 'desc', false),
  ('ex-power-clean', 'Power Clean', 'weight', 'desc', false)
ON CONFLICT (id) DO NOTHING;

-- ========== Training Days ==========
-- Generate current week dates dynamically using PostgreSQL date functions
-- Uses jsonb_build_object/jsonb_build_array for proper JSON construction

DO $$
DECLARE
  monday_date DATE;
  current_date_iso TEXT;
  week_start_iso TEXT;
BEGIN
  -- Calculate Monday of current week
  monday_date := date_trunc('week', CURRENT_DATE)::DATE;
  week_start_iso := to_char(monday_date, 'YYYY-MM-DD');

  -- ========== Athlete Track ==========

  -- Monday: Lower Body Strength
  current_date_iso := to_char(monday_date, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Lower Body Strength',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-back-squat', 'targetText', '5x5 @ 80%', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-deadlift', 'targetText', '3x3 @ 85%', 'order', 2),
          jsonb_build_object('id', 'mov-3', 'exerciseId', 'ex-box-jumps', 'targetText', '3x10', 'order', 3)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Tuesday: Upper Body Push
  current_date_iso := to_char(monday_date + 1, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Upper Body Push',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-bench-press', 'targetText', '5x5 @ 75%', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-overhead-press', 'targetText', '4x6 @ 70%', 'order', 2),
          jsonb_build_object('id', 'mov-3', 'exerciseId', 'ex-push-ups', 'targetText', '3xAMRAP', 'order', 3)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Wednesday: Active Recovery
  current_date_iso := to_char(monday_date + 2, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Active Recovery',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-rowing', 'targetText', '3x500m easy pace', 'notes', 'Focus on form and breathing', 'order', 1)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Thursday: Lower Body Power
  current_date_iso := to_char(monday_date + 3, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Lower Body Power',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-power-clean', 'targetText', '5x3 @ 75%', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-front-squat', 'targetText', '4x6 @ 70%', 'order', 2)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Friday: Upper Body Pull
  current_date_iso := to_char(monday_date + 4, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Upper Body Pull',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-deadlift', 'targetText', '5x3 @ 80%', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-pull-ups', 'targetText', '5xAMRAP', 'order', 2)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Saturday: Optional Conditioning
  current_date_iso := to_char(monday_date + 5, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-athlete-' || current_date_iso || '-1',
        'trackId', 'track-athlete',
        'dateISO', current_date_iso,
        'title', 'Optional Conditioning',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-running', 'targetText', '5K steady pace', 'notes', 'Optional - prioritize recovery', 'order', 1)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Sunday: Rest
  current_date_iso := to_char(monday_date + 6, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-athlete-' || current_date_iso,
    'track-athlete',
    current_date_iso,
    week_start_iso,
    '[]'::jsonb
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- ========== Functional Fitness Track ==========

  -- Monday: Strength + MetCon
  current_date_iso := to_char(monday_date, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Strength',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-back-squat', 'targetText', '3x8 @ 70%', 'order', 1)
        )
      ),
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-2',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'MetCon',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-burpees', 'targetText', 'AMRAP 10min', 'notes', '10 burpees + 200m run, repeat', 'order', 1)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Tuesday: Upper Body + Core
  current_date_iso := to_char(monday_date + 1, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Upper Body',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-bench-press', 'targetText', '4x8', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-pull-ups', 'targetText', '4xAMRAP', 'order', 2),
          jsonb_build_object('id', 'mov-3', 'exerciseId', 'ex-push-ups', 'targetText', '3x20', 'order', 3)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Wednesday: Cardio + Mobility
  current_date_iso := to_char(monday_date + 2, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Cardio',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-rowing', 'targetText', '4x500m @ 90% effort', 'notes', 'Rest 2min between rounds', 'order', 1)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Thursday: Lower Body + MetCon
  current_date_iso := to_char(monday_date + 3, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Lower Body',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-deadlift', 'targetText', '4x6 @ 75%', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-box-jumps', 'targetText', '4x12', 'order', 2)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Friday: Full Body Circuit
  current_date_iso := to_char(monday_date + 4, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Full Body Circuit',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-front-squat', 'targetText', '3 rounds: 10 reps', 'order', 1),
          jsonb_build_object('id', 'mov-2', 'exerciseId', 'ex-overhead-press', 'targetText', '3 rounds: 10 reps', 'order', 2),
          jsonb_build_object('id', 'mov-3', 'exerciseId', 'ex-pull-ups', 'targetText', '3 rounds: 10 reps', 'order', 3)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Saturday: Active Recovery
  current_date_iso := to_char(monday_date + 5, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'workout-functional-' || current_date_iso || '-1',
        'trackId', 'track-functional',
        'dateISO', current_date_iso,
        'title', 'Active Recovery',
        'movements', jsonb_build_array(
          jsonb_build_object('id', 'mov-1', 'exerciseId', 'ex-running', 'targetText', '30min easy pace', 'notes', 'Optional - listen to your body', 'order', 1)
        )
      )
    )
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

  -- Sunday: Rest
  current_date_iso := to_char(monday_date + 6, 'YYYY-MM-DD');
  INSERT INTO training_days (id, track_id, date_iso, week_start_iso, workouts) VALUES (
    'day-functional-' || current_date_iso,
    'track-functional',
    current_date_iso,
    week_start_iso,
    '[]'::jsonb
  ) ON CONFLICT (id) DO UPDATE SET workouts = EXCLUDED.workouts;

END $$;

-- ========== Verify Data ==========
-- Uncomment to check:
-- SELECT * FROM training_tracks;
-- SELECT COUNT(*) as exercise_count FROM exercises;
-- SELECT track_id, date_iso, week_start_iso FROM training_days ORDER BY track_id, date_iso;
