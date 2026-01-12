# Plan: Cross-Platform UI Consistency (Phase 1)

## Current State Analysis

### ✅ Already Complete
- **You tab**: Fully implemented with calendar, win tracking, stats, routines, and tasks
- **Discipline tab**: V1 UI scaffolding complete with Challenge and Rules views
  - Components: SegmentedControl, RulesAdherenceCard, MiniGrid, ChallengeCard, RuleListItem
  - Feature structure in place: `features/discipline/` with types, components, index

### 🚧 Needs V1 Scaffolding
- **Goals tab**: Only has ScreenShell placeholder
- **Body tab**: Only has ScreenShell placeholder
- **Mind tab**: Only has ScreenShell placeholder

### 📦 Existing Design System (Complete)
All components follow the premium iOS-inspired design from tokens.ts:
- ✅ **Core UI**: ScreenContainer, Card, SectionHeader, ListRow, PrimaryButton, Chip
- ✅ **Dashboard**: MonthGrid, WeekBattery, WinTheDayHeader, StatCard, EmptyState
- ✅ **Modals**: AddItemModal
- ✅ **Design tokens**: Colors, spacing, radius, typography, shadows (iOS + Android)

---

## Proposed File Tree Changes

### 1. Goals Feature Structure
```
features/goals/
├── index.ts              ✅ exists
├── types.ts              ✅ exists (Goal type)
├── components.tsx        🔄 replace placeholder with real components
└── lib.ts                ➕ NEW - persistence helpers (extends lib/goals.ts)
```

**New components needed:**
- `GoalCard` - Display goal with progress bar (title, current/target, percentage)
- `GoalsList` - List of goals with add button
- `LinkedTasksSummary` - Show tasks linked to each goal
- `EmptyGoalsState` - Empty state with CTA

### 2. Body Feature Structure (Mayhem-like)
```
features/body/
├── index.ts              ✅ exists
├── types.ts              ➕ NEW
├── components.tsx        🔄 replace with real components
└── lib.ts                ➕ NEW - local persistence for workouts
```

**New types needed:**
- `WorkoutTrack` - training track (e.g., "Strength", "Conditioning")
- `WorkoutSession` - logged workout with timer data
- `WorkoutScore` - performance metric

**New components needed:**
- `TrackCard` - Display training track with recent activity
- `WorkoutTimer` - Simple timer with start/pause/stop
- `ScoreLogger` - Input for reps/weight/time
- `RecentWorkouts` - List of recent sessions

### 3. Mind Feature Structure
```
features/mind/
├── index.ts              ✅ exists
├── types.ts              ➕ NEW
├── components.tsx        🔄 replace with real components
└── lib.ts                ➕ NEW - local persistence for reading
```

**New types needed:**
- `Book` - book title, author, pages, completion
- `ReadingSession` - timer session for reading

**New components needed:**
- `BookCard` - Display book with progress
- `BooksList` - List of books with add button
- `ReadingTimer` - Simple timer for reading sessions
- `InsightsList` - Optional notes/insights section

---

## Missing Design Tokens/Colors

### Current tokens.ts coverage:
✅ bg, card, text, muted, border, tint (blue), action (emerald), danger (red)

### Recommended additions:
```typescript
// Success states
success: '#10B981',    // emerald-500 (already have action emerald, could use this)

// Warning/caution (for streaks at risk, etc.)
warning: '#F59E0B',    // amber-500

// Neutral variations (if needed for future states)
neutral: '#6B7280',    // gray-500
```

**Decision**: Current tokens are sufficient for Phase 1. The `action` emerald covers success states, and we can add warning/neutral colors in Phase 2 if needed for advanced streak logic or challenge states.

---

## Screens to Scaffold Next

### Priority 1: Discipline V1 (Already Complete! ✅)
The Discipline tab is already fully scaffolded with:
- Challenge view with requirements checklist
- Rules view with adherence tracking and 30-day grid
- SegmentedControl for switching views
- Full feature module in place

### Priority 2: Goals V1 (Next to implement)
**File**: `app/(tabs)/goals.tsx` + `features/goals/components.tsx`

**Layout**:
1. Header: "Goals" + "What you're aiming at" subtitle
2. Stats bar (optional for v1): Total goals, Goals completed this month
3. Goals list:
   - GoalCard for each goal (title, progress bar, linked tasks count)
   - Empty state if no goals
   - Add button (+) to create new goal
4. Tapping a goal could show linked tasks (v1: just display, no deep editing)

**Key behavior**:
- Display goals from lib/goals.ts
- Show progress as a percentage (current/target)
- Display count of tasks linked to each goal
- Add new goals with title and target (e.g., "Run 100 miles", target: 100)

### Priority 3: Body V1 (Future, after Goals)
**File**: `app/(tabs)/body.tsx` + `features/body/` (full structure)

**Layout**:
1. Header: "Body" + "Training and performance" subtitle
2. Training tracks section (v1: just 2-3 hardcoded tracks)
   - "Strength" track card
   - "Conditioning" track card
3. Quick workout timer section
4. Recent workouts log (last 5 sessions)

**Key behavior (minimal v1)**:
- Start a simple timer for workouts
- Log a workout with duration and optional notes
- Display recent workouts (stored locally)

### Priority 4: Mind V1 (Future, after Body)
**File**: `app/(tabs)/mind.tsx` + `features/mind/` (full structure)

**Layout**:
1. Header: "Mind" + "Reading and reflection" subtitle
2. Current book section (if one in progress)
3. Reading timer
4. Books list (title, author, pages read / total pages)
5. Add book button

**Key behavior**:
- Start reading timer
- Track pages read
- Display book progress bars
- Add new books with title, author, total pages

---

## Out of Scope for Phase 1

### Definitely Phase 2+
- ❌ Supabase auth and sync
- ❌ Code redemption + membership gating
- ❌ Multi-user features (leaderboards, community challenges)
- ❌ Admin dashboard for publishing challenges/tracks
- ❌ Social features (sharing, following, etc.)

### Likely Phase 2
- ❌ Advanced streak calculations beyond current win/loss logic
- ❌ Notifications/reminders
- ❌ Export data (CSV, JSON)
- ❌ Dark mode toggle (can use system dark mode for now)
- ❌ Onboarding flow

### Keep Simple for Phase 1
- ✅ Focus on local-first persistence (AsyncStorage)
- ✅ Hardcoded training tracks and challenge templates
- ✅ Simple timers without advanced analytics
- ✅ Manual input for scores/metrics
- ✅ No graphs/charts (just numbers and progress bars)

---

## Implementation Approach

### Step 1: Goals V1 UI Scaffolding (Immediate next task)
1. Create `features/goals/components.tsx` with GoalCard, GoalsList, EmptyGoalsState
2. Update `app/(tabs)/goals.tsx` to use these components
3. Wire up to existing `lib/goals.ts` persistence
4. Add ability to create/delete goals
5. Display linked tasks count per goal

### Step 2: Body V1 UI Scaffolding (After Goals approval)
1. Create `features/body/types.ts` with workout types
2. Create `features/body/components.tsx` with TrackCard, Timer, ScoreLogger
3. Create `features/body/lib.ts` for local workout persistence
4. Update `app/(tabs)/body.tsx` with full layout
5. Implement basic workout logging

### Step 3: Mind V1 UI Scaffolding (After Body approval)
1. Create `features/mind/types.ts` with book types
2. Create `features/mind/components.tsx` with BookCard, ReadingTimer
3. Create `features/mind/lib.ts` for local reading persistence
4. Update `app/(tabs)/mind.tsx` with full layout
5. Implement basic reading tracking

---

## Cross-Platform Considerations

### iOS vs Android Consistency
- ✅ Already handled via tokens.ts (iOS shadow vs Android elevation)
- ✅ SafeAreaView in ScreenContainer handles notches
- ✅ Pressable components work cross-platform
- ⚠️ Test modals on Android (bottom sheet behavior)
- ⚠️ Test timers on both platforms (background behavior TBD in Phase 2)

### Design Consistency Checklist
- ✅ All screens use ScreenContainer wrapper
- ✅ All cards use tokens.colors.card + tokens.shadow
- ✅ All text uses typography scale from tokens
- ✅ All spacing uses tokens.spacing values
- ✅ All interactive elements use tokens.colors.tint for primary actions
- ⚠️ Confirm Add buttons (+) follow same corner pattern from You tab

---

## Test Checklist (Post-Implementation)

### Goals Tab
- [ ] Display empty state when no goals exist
- [ ] Create a new goal with title and target
- [ ] Display progress bar correctly (50/100 = 50%)
- [ ] Show linked tasks count from You tab
- [ ] Delete a goal

### Body Tab (Future)
- [ ] Display training tracks
- [ ] Start/stop workout timer
- [ ] Log workout session
- [ ] View recent workouts list

### Mind Tab (Future)
- [ ] Add a book with title/author/pages
- [ ] Start/stop reading timer
- [ ] Update pages read
- [ ] View book progress

### Cross-Platform
- [ ] iOS: Verify shadows render correctly
- [ ] Android: Verify elevation renders correctly
- [ ] Both: Verify safe area insets on notched devices
- [ ] Both: Verify modals dismiss correctly
- [ ] Both: Verify tap targets are 44x44pt minimum

---

## Questions for Review

1. **Goals priority**: Confirm Goals V1 is the next priority after Discipline?
2. **Linked tasks**: Should Goals tab allow editing linked tasks, or just display count?
3. **Body tracks**: Should v1 have hardcoded tracks, or allow custom track creation?
4. **Mind insights**: Include insights/notes section in v1, or defer to v2?
5. **Design tokens**: Are current colors sufficient, or add warning/success variants now?

---

## Summary

**Discipline V1**: ✅ Already complete (no work needed)

**Next: Goals V1** - Small, focused PR to scaffold Goals tab with:
- GoalCard, GoalsList, EmptyGoalsState components
- Basic CRUD (create, display, delete goals)
- Show progress bars and linked task counts
- Estimated files changed: 3-4 files (goals.tsx, components.tsx, types update, lib update)

**After Goals approval**: Body V1, then Mind V1 in separate PRs

**Phase 1 complete** when all 5 tabs have functional V1 UI with local persistence.
