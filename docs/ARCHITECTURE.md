# Architecture (V1)

## Tech Stack
- Expo + React Native + TypeScript
- Expo Router (file-based routing)
- Local-first persistence via AsyncStorage
- Supabase backend for admin-published training programming (PR#4)
- Supabase Auth with Anonymous Sign-ins for identity (PR#5)

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
   - `initializeTraining()` — Initialize on app start with cache + background sync
   - `seedIfEmpty()` — Seeds tracks, exercises, and current week training (fallback)
   - `getTracks()`, `getActiveTrackId()`, `setActiveTrackId()`
   - `getTrainingDay(trackId, dateISO)` — Get single day's programming
   - `getTrainingWeek(trackId, weekStartISO)` — Get 7 days of programming
   - `getAllExercises()`, `getExerciseById()`, `getMajorExercises()`
   - `forceRefreshFromSupabase()` — Manual refresh (pull-to-refresh)

2. **ResultsRepo** (`lib/repositories/ResultsRepo.ts`)
   - Manages logged performance results and PRs
   - `logResult(exerciseId, trackId, dateISO, value)` — Log a performance result
   - `getResultsForExercise(exerciseId, options)` — Get results history
   - `getLeaderboardForExercise(exerciseId, sortDirection, limit)` — Get ranked leaderboard entries with displayName
   - `getUserPRs()` — Get personal records for major movements

3. **ActivityRepo** (`lib/repositories/ActivityRepo.ts`)
   - Manages time-tracked activity sessions (reading, workouts)
   - `logSession(type, dateISO, durationSeconds)` — Log a timed session
   - `getTotalsByTypeForDate(type, dateISO)` — Get day totals
   - `getTotalsByTypeForWeek(type, weekStartISO)` — Get week totals

4. **ProfileRepo** (`lib/repositories/ProfileRepo.ts`)
   - Manages user profile (local + Supabase)
   - **Local (AsyncStorage):**
     - `getProfile()` — Get local profile (streak, app state)
     - `updateProfile(updates)` — Update local profile
     - `bumpOnAppStreakIfNeeded(todayISO)` — Increment streak if new day
   - **Supabase (public.profiles):**
     - `getSupabaseProfile()` — Get authenticated user's profile
     - `upsertDisplayName(name)` — Create/update display name
     - `hasSupabaseProfile()` — Check if profile exists

**Key Design Decisions:**

- **Exercise as stable reference:** Results reference `exerciseId`, not movement instances, enabling leaderboards across days/weeks
- **Two-track system:** Athlete Track + Functional Fitness Track with active track selection
- **Date-based programming:** Training organized by `trackId` + `dateISO` for clean day/week queries
- **Time tracking foundation:** ActivitySession model supports "You" dashboard metrics (reading time, workout time)
- **Schema versioning:** Ready for future migrations with schema version tracking

### Authentication & Identity (PR#5)

The app uses Supabase Anonymous Sign-ins for seamless identity without login gates.

**Architecture:**
- `lib/supabase/client.ts` — Supabase client with AsyncStorage session persistence
- `lib/supabase/AuthRepo.ts` — Authentication session management

**Auth Configuration:**
```typescript
// lib/supabase/client.ts
auth: {
  storage: AsyncStorage,
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
}
```

**Session Bootstrap:**
- `ensureSession()` called once at app start (non-blocking)
- Checks for existing session first (no repeated sign-ins)
- Creates anonymous session if none exists
- Fails silently if offline or Supabase not configured

**Profiles Table** (`supabase/profiles.sql`):
- `id` — UUID, references `auth.users(id)`
- `display_name` — User's public name for leaderboards
- `avatar_url` — Optional avatar (future)
- RLS policies: authenticated can read all, users can write own

**Identity Flow:**
1. App launches → Dashboard shown immediately (no auth gate)
2. `ensureSession()` runs in background
3. Session persists across app relaunches (AsyncStorage)
4. User can set display name via Profile screen
5. Display name stored in `public.profiles` for leaderboards

**Key Design Decisions:**
- **No login friction:** Anonymous sign-ins give real auth without email/password
- **Persistent sessions:** AsyncStorage adapter persists session tokens
- **Graceful degradation:** App works offline, auth fails silently
- **Migration path:** Anonymous users can link to email/password later

### Supabase Integration (PR#4)

Training programming is now fetched from Supabase with local-first caching.

**Architecture:**
- `lib/supabase/client.ts` — Supabase client singleton with env check
- `lib/supabase/trainingApi.ts` — Typed fetch functions for training data
- `lib/storage/cache.ts` — Cache staleness tracking (5-minute TTL)

**Database Schema** (`supabase/schema.sql`):
- `training_tracks` — Track definitions (Athlete, Functional Fitness)
- `exercises` — Movement definitions with scoring config
- `training_days` — Date-based programming with `workouts` JSONB column

**Data Flow:**
1. App starts → `initializeTraining()` called
2. If cached data exists → Return immediately, trigger background refresh
3. If no cache + Supabase configured → Fetch and cache
4. If no cache + no Supabase → Fall back to seed data

**Offline Behavior:**
- Cached data always available immediately
- Background sync when online
- Seed data fallback for development without Supabase

**Environment Variables:**
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Workout Session Timer (PR#3)

The workout session screen (`app/workout-session.tsx`) implements a persistent timer:

**Timer States:** `idle` | `running` | `paused`

**Persistence Pattern:**
- Timer state persisted to AsyncStorage on every tick and state change
- Storage key format: `@workout:session:timer:{workoutId}:{dateISO}`
- Persisted data: `elapsedSeconds`, `timerState`, `lastTickISO`
- On restore: if timer was `running`, calculates elapsed time since `lastTickISO`

**Timer Flow:**
1. **Start** — Begin timer, persist `running` state
2. **Pause** — Stop interval, persist `paused` state with current elapsed
3. **Resume** — Restart interval from persisted elapsed
4. **Finish** — Log `ActivitySession` of type `workout`, clear persisted state

**Components:**
- `CompactSessionTimer` — Compact inline timer with Start/Pause/Finish buttons
- `ExpandableMovementTile` — Collapsible movement card with Log Result + Results buttons
- `ExerciseLeaderboardModal` — Per-exercise leaderboard sorted by `sortDirection`

### Data (Phase 1: local + Supabase hybrid)
- Wins stored in AsyncStorage keyed by dateKey (YYYY-MM-DD)
- Loss is implicit for past days without win
- Today neutral until day ends
- Training data: Tracks, exercises, scheduled workouts from Supabase (cached locally)
- Results, activity sessions: Local-only (Phase 1)
- Profile: Local streak + Supabase display name (PR#5)
- Later: Full Supabase sync for results and user data (Phase 2+)

## Safety rules
- Keep diffs small
- No large refactors without explicit plan + confirmation
- Never speculate about file contents—always read first
