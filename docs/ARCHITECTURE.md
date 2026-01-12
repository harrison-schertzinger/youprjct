# Architecture (V1)

## Tech Stack
- Expo + React Native + TypeScript
- Expo Router (file-based routing)
- Local-first persistence via AsyncStorage (Phase 1)
- Supabase auth + data sync later (Phase 2)

## Navigation
Tabs: You / Discipline / Body / Mind / Goals

File mapping:
- app/(tabs)/you.tsx
- app/(tabs)/discipline.tsx
- app/(tabs)/body.tsx
- app/(tabs)/mind.tsx
- app/(tabs)/goals.tsx

## Design System
- design/tokens.ts is the single source of truth
- components/ui contains reusable primitives:
  - ScreenContainer
  - Card
  - SectionHeader
  - ListRow
  - PrimaryButton
  - Chip

## Feature Modules (preferred)
- components/dashboard contains dashboard-specific modules:
  - MonthGrid
  - WinTheDayHeader
  - (future) streak calculations, metrics charts

## Data Layer

### Repository Pattern (NEW in PR#1)

We use a typed repository layer to abstract data access and prepare for future Supabase migration.

**Structure:**
- `lib/training/types.ts` — Domain types (TrainingTrack, Exercise, Workout, Result, ActivitySession, Profile)
- `lib/storage/` — Typed AsyncStorage wrapper with schema versioning
- `lib/repositories/` — Domain repositories (Training, Results, Activity, Profile)
- `lib/training/seed.ts` — Seed data for training tracks and exercises

**Repositories:**

1. **TrainingRepo** (`lib/repositories/TrainingRepo.ts`)
   - Manages training tracks, exercises, and scheduled programming
   - `seedIfEmpty()` — Seeds tracks, exercises, and current week training
   - `getTracks()`, `getActiveTrackId()`, `setActiveTrackId()`
   - `getTrainingDay(trackId, dateISO)` — Get single day's programming
   - `getTrainingWeek(trackId, weekStartISO)` — Get 7 days of programming
   - `getAllExercises()`, `getExerciseById()`, `getMajorExercises()`

2. **ResultsRepo** (`lib/repositories/ResultsRepo.ts`)
   - Manages logged performance results and PRs
   - `logResult(exerciseId, trackId, dateISO, value)` — Log a performance result
   - `getResultsForExercise(exerciseId, options)` — Get leaderboard data
   - `getUserPRs()` — Get personal records for major movements

3. **ActivityRepo** (`lib/repositories/ActivityRepo.ts`)
   - Manages time-tracked activity sessions (reading, workouts)
   - `logSession(type, dateISO, durationSeconds)` — Log a timed session
   - `getTotalsByTypeForDate(type, dateISO)` — Get day totals
   - `getTotalsByTypeForWeek(type, weekStartISO)` — Get week totals

4. **ProfileRepo** (`lib/repositories/ProfileRepo.ts`)
   - Manages user profile and on-app streak
   - `getProfile()` — Get current profile
   - `updateProfile(updates)` — Update profile fields
   - `bumpOnAppStreakIfNeeded(todayISO)` — Increment streak if new day

**Key Design Decisions:**

- **Exercise as stable reference:** Results reference `exerciseId`, not movement instances, enabling leaderboards across days/weeks
- **Two-track system:** Athlete Track + Functional Fitness Track with active track selection
- **Date-based programming:** Training organized by `trackId` + `dateISO` for clean day/week queries
- **Time tracking foundation:** ActivitySession model supports "You" dashboard metrics (reading time, workout time)
- **Schema versioning:** Ready for future migrations with schema version tracking

### Data (Phase 1: local)
- Wins stored in AsyncStorage keyed by dateKey (YYYY-MM-DD)
- Loss is implicit for past days without win
- Today neutral until day ends
- Training data: Tracks, exercises, scheduled workouts, results, activity sessions, profile
- Later: Supabase sync (repository swap, no UI changes)

## Safety rules
- Keep diffs small
- No large refactors without explicit plan + confirmation
- Never speculate about file contents—always read first
