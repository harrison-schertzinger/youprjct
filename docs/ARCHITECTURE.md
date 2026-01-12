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

## Data (Phase 1: local)
- Wins stored in AsyncStorage keyed by dateKey (YYYY-MM-DD)
- Loss is implicit for past days without win
- Today neutral until day ends
- Later: routines/tasks/goals persisted locally, then Supabase

## Safety rules
- Keep diffs small
- No large refactors without explicit plan + confirmation
- Never speculate about file contents—always read first
