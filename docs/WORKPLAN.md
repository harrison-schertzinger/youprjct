# Workplan (V1)

## Phase 1 — UX + Local-first (Current)
- You tab: month grid + win button + stats + routines/tasks layout
- Discipline tab: Rules + Challenges UI scaffolding
- Build shared components and keep design consistent
- Persist wins locally (done), then tasks/routines locally
- **PR#4: Supabase backend for training programming (DONE)**
  - Two tracks: Athlete Track, Functional Fitness Track
  - Date-based programming fetched from Supabase
  - Local-first caching with background refresh
  - Offline fallback to seed data

## Phase 2 — Auth + Membership
- Supabase magic link auth
- Code redemption + membership expiry (365 days)
- Locked experience when expired
- Sync user results and activity to Supabase

## Phase 3 — Admin + Community + Tracks
- Admin publishing dashboard for Challenges + Fitness Tracks
- Community leaderboards (cross-user)
- Major movements + PR charts
- Push notifications for new programming
