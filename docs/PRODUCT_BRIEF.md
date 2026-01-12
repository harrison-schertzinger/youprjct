# You.Prjct (.uoY) — Product Brief (V1)

## Mission
You.Prjct is a premium personal development platform that helps users establish discipline, structure, and order—measuring what matters and staying committed to who they want to become.

“.uoY” is the mirrored identity mark: when you get better, life gets better.

## V1 Primary Loop (You tab)
- Calendar shows the month (Sunday-first)
- User selects a day
- User can claim: “I Won Today”
- Wins show green in calendar
- Past days without win = loss (red outline / shaded by loss streak)
- Today is neutral until it ends
- Stats bar: Days Won / Consistency / This Week
- Daily routines: Morning, Tasks, Evening
- Tasks can be linked to Goals (goal chip shown in task row)

## Tabs (V1)
- You: Winning the day dashboard (calendar + win button + routines + tasks)
- Discipline: Rules + Challenges
- Body: training tracks + workout timer + score logging (Mayhem-like structure)
- Mind: reading timer + book list + insights
- Goals: goals list + tasks linked to goals show counts

## UI Direction
Premium, clean, Apple/WHOOP-inspired:
- off-white background
- white cards
- clear spacing rhythm
- subtle borders and shadows
- blue accent for primary actions
- avoid cramped “cards inside cards”
- plus actions are small (+), not big buttons everywhere

## Key V1 Behaviors
- Win button is a single action (no win/loss toggle UI)
- Past days without win are losses
- Today stays neutral until day ends
- Local-first persistence (AsyncStorage) while UX is built
- Later: Supabase auth + membership gating

## Non-goals for now
- Supabase Auth, code redemption, membership gating (Phase 2)
- Admin dashboard + community challenges (Phase 3)
- Full leaderboard + tracks backend (Phase 3)
