# YouPrjct Architecture

## Overview
A React Native (Expo) personal productivity app focused on daily habit tracking and goal achievement.

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Storage**: AsyncStorage (local persistence)
- **Navigation**: Expo Router (file-based routing)

## Directory Structure

```
app/
├── (tabs)/              # Tab-based navigation screens
│   ├── you.tsx          # Main dashboard (calendar, routines, tasks)
│   ├── goals.tsx        # Goals management
│   ├── mind.tsx         # Reading/learning tracker
│   ├── body.tsx         # Fitness tracker
│   └── discipline.tsx   # Discipline tracker

components/
├── ui/                  # Reusable UI components
│   ├── Card.tsx         # Container card
│   ├── ListRow.tsx      # Checkbox list item with delete
│   ├── PrimaryButton.tsx # Action button (default/large sizes)
│   ├── AddItemModal.tsx # Modal for adding routines/tasks
│   └── ...
├── dashboard/           # Dashboard-specific components
│   └── MonthGrid.tsx    # Calendar grid with win/loss states

design/
└── tokens.ts            # Design system (colors, spacing, typography)

lib/                     # Data layer (AsyncStorage)
├── goals.ts             # Goals CRUD
├── routines.ts          # Morning/Evening routines (persist forever)
├── dailyTasks.ts        # Daily tasks (reset each day)
├── dailyOutcomes.ts     # Win/loss tracking per day
└── appStreak.ts         # App usage streak tracking
```

## Data Flow

### Storage Keys (AsyncStorage)
- `@youprjct:goals` - User goals
- `@youprjct:routines:morning` - Morning routines
- `@youprjct:routines:evening` - Evening routines
- `@youprjct:routines:{type}:completed:{date}` - Daily completion state
- `@youprjct:dailyTasks:{date}` - Tasks for specific day
- `@youprjct:wins` - Days marked as "won"
- `@youprjct:firstOpenedAt` - App install date (for streak)

### Data Persistence Rules
| Data Type | Persistence | Reset |
|-----------|-------------|-------|
| Goals | Forever | Manual delete |
| Morning/Evening Routines | Forever | Manual delete |
| Routine Completion | Daily | Auto-reset each day |
| Daily Tasks | Daily | Auto-reset each day |
| Wins | Forever | N/A |

## Design System (tokens.ts)

### Colors
- `bg`: Off-white background (#F7F7F5)
- `card`: White cards (#FFFFFF)
- `text`: Near-black (#0B0B0B)
- `muted`: Secondary text (#6B6B6B)
- `tint`: Primary accent blue (#2F6BFF)
- `action`: Gamified emerald (#059669)
- `danger`: Red (#D92D20)
- `calendar.*`: Calendar state colors

### Spacing
`xs: 6, sm: 10, md: 16, lg: 20, xl: 28`

### Radius
`sm: 12, md: 16, lg: 20, pill: 999`
