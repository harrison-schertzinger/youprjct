// Seed data for You.First training system

import type {
  TrainingTrack,
  Exercise,
  TrainingDay,
  Workout,
  ScheduledMovement,
} from './types';

// ========== Helper: Get current week dates ==========

function getCurrentWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function getMondayOfWeek(dateISO: string): string {
  const date = new Date(dateISO);
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split('T')[0];
}

// ========== Tracks ==========

export const SEED_TRACKS: TrainingTrack[] = [
  {
    id: 'track-athlete',
    title: 'Athlete Track',
    createdAtISO: new Date().toISOString(),
    updatedAtISO: new Date().toISOString(),
  },
  {
    id: 'track-functional',
    title: 'Functional Fitness Track',
    createdAtISO: new Date().toISOString(),
    updatedAtISO: new Date().toISOString(),
  },
];

// ========== Exercises ==========

export const SEED_EXERCISES: Exercise[] = [
  // Major movements (show on PRs dashboard)
  {
    id: 'ex-back-squat',
    title: 'Back Squat',
    scoreType: 'weight',
    sortDirection: 'desc',
    isMajor: true,
  },
  {
    id: 'ex-deadlift',
    title: 'Deadlift',
    scoreType: 'weight',
    sortDirection: 'desc',
    isMajor: true,
  },
  {
    id: 'ex-bench-press',
    title: 'Bench Press',
    scoreType: 'weight',
    sortDirection: 'desc',
    isMajor: true,
  },
  {
    id: 'ex-overhead-press',
    title: 'Overhead Press',
    scoreType: 'weight',
    sortDirection: 'desc',
    isMajor: true,
  },

  // Non-major movements
  {
    id: 'ex-pull-ups',
    title: 'Pull-ups',
    scoreType: 'reps',
    sortDirection: 'desc',
  },
  {
    id: 'ex-push-ups',
    title: 'Push-ups',
    scoreType: 'reps',
    sortDirection: 'desc',
  },
  {
    id: 'ex-rowing',
    title: 'Rowing',
    scoreType: 'time',
    sortDirection: 'asc', // Lower time is better
  },
  {
    id: 'ex-running',
    title: 'Running',
    scoreType: 'time',
    sortDirection: 'asc',
  },
  {
    id: 'ex-box-jumps',
    title: 'Box Jumps',
    scoreType: 'reps',
    sortDirection: 'desc',
  },
  {
    id: 'ex-burpees',
    title: 'Burpees',
    scoreType: 'reps',
    sortDirection: 'desc',
  },
  {
    id: 'ex-front-squat',
    title: 'Front Squat',
    scoreType: 'weight',
    sortDirection: 'desc',
  },
  {
    id: 'ex-power-clean',
    title: 'Power Clean',
    scoreType: 'weight',
    sortDirection: 'desc',
  },
];

// ========== Training Programming ==========

export function generateCurrentWeekTraining(): TrainingDay[] {
  const weekDates = getCurrentWeekDates();
  const weekStart = getMondayOfWeek(weekDates[0]);

  const athleteTrackDays = generateAthleteTrackWeek(weekDates, weekStart);
  const functionalTrackDays = generateFunctionalTrackWeek(weekDates, weekStart);

  return [...athleteTrackDays, ...functionalTrackDays];
}

// ========== Athlete Track Programming ==========

function generateAthleteTrackWeek(dates: string[], weekStart: string): TrainingDay[] {
  const [mon, tue, wed, thu, fri, sat, sun] = dates;

  return [
    // Monday: Lower Body Strength
    {
      id: `day-athlete-${mon}`,
      trackId: 'track-athlete',
      dateISO: mon,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${mon}-1`,
          trackId: 'track-athlete',
          dateISO: mon,
          title: 'Lower Body Strength',
          movements: [
            {
              id: `mov-athlete-${mon}-1`,
              exerciseId: 'ex-back-squat',
              targetText: '5x5 @ 80%',
              order: 1,
            },
            {
              id: `mov-athlete-${mon}-2`,
              exerciseId: 'ex-deadlift',
              targetText: '3x3 @ 85%',
              order: 2,
            },
            {
              id: `mov-athlete-${mon}-3`,
              exerciseId: 'ex-box-jumps',
              targetText: '3x10',
              order: 3,
            },
          ],
        },
      ],
    },

    // Tuesday: Upper Body Push
    {
      id: `day-athlete-${tue}`,
      trackId: 'track-athlete',
      dateISO: tue,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${tue}-1`,
          trackId: 'track-athlete',
          dateISO: tue,
          title: 'Upper Body Push',
          movements: [
            {
              id: `mov-athlete-${tue}-1`,
              exerciseId: 'ex-bench-press',
              targetText: '5x5 @ 75%',
              order: 1,
            },
            {
              id: `mov-athlete-${tue}-2`,
              exerciseId: 'ex-overhead-press',
              targetText: '4x6 @ 70%',
              order: 2,
            },
            {
              id: `mov-athlete-${tue}-3`,
              exerciseId: 'ex-push-ups',
              targetText: '3xAMRAP',
              order: 3,
            },
          ],
        },
      ],
    },

    // Wednesday: Active Recovery
    {
      id: `day-athlete-${wed}`,
      trackId: 'track-athlete',
      dateISO: wed,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${wed}-1`,
          trackId: 'track-athlete',
          dateISO: wed,
          title: 'Active Recovery',
          movements: [
            {
              id: `mov-athlete-${wed}-1`,
              exerciseId: 'ex-rowing',
              targetText: '3x500m easy pace',
              notes: 'Focus on form and breathing',
              order: 1,
            },
          ],
        },
      ],
    },

    // Thursday: Lower Body Power
    {
      id: `day-athlete-${thu}`,
      trackId: 'track-athlete',
      dateISO: thu,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${thu}-1`,
          trackId: 'track-athlete',
          dateISO: thu,
          title: 'Lower Body Power',
          movements: [
            {
              id: `mov-athlete-${thu}-1`,
              exerciseId: 'ex-power-clean',
              targetText: '5x3 @ 75%',
              order: 1,
            },
            {
              id: `mov-athlete-${thu}-2`,
              exerciseId: 'ex-front-squat',
              targetText: '4x6 @ 70%',
              order: 2,
            },
          ],
        },
      ],
    },

    // Friday: Upper Body Pull
    {
      id: `day-athlete-${fri}`,
      trackId: 'track-athlete',
      dateISO: fri,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${fri}-1`,
          trackId: 'track-athlete',
          dateISO: fri,
          title: 'Upper Body Pull',
          movements: [
            {
              id: `mov-athlete-${fri}-1`,
              exerciseId: 'ex-deadlift',
              targetText: '5x3 @ 80%',
              order: 1,
            },
            {
              id: `mov-athlete-${fri}-2`,
              exerciseId: 'ex-pull-ups',
              targetText: '5xAMRAP',
              order: 2,
            },
          ],
        },
      ],
    },

    // Saturday: Optional Conditioning
    {
      id: `day-athlete-${sat}`,
      trackId: 'track-athlete',
      dateISO: sat,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-athlete-${sat}-1`,
          trackId: 'track-athlete',
          dateISO: sat,
          title: 'Optional Conditioning',
          movements: [
            {
              id: `mov-athlete-${sat}-1`,
              exerciseId: 'ex-running',
              targetText: '5K steady pace',
              notes: 'Optional - prioritize recovery',
              order: 1,
            },
          ],
        },
      ],
    },

    // Sunday: Rest
    {
      id: `day-athlete-${sun}`,
      trackId: 'track-athlete',
      dateISO: sun,
      weekStartISO: weekStart,
      workouts: [],
    },
  ];
}

// ========== Functional Fitness Track Programming ==========

function generateFunctionalTrackWeek(dates: string[], weekStart: string): TrainingDay[] {
  const [mon, tue, wed, thu, fri, sat, sun] = dates;

  return [
    // Monday: Strength + MetCon
    {
      id: `day-functional-${mon}`,
      trackId: 'track-functional',
      dateISO: mon,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${mon}-1`,
          trackId: 'track-functional',
          dateISO: mon,
          title: 'Strength',
          movements: [
            {
              id: `mov-functional-${mon}-1`,
              exerciseId: 'ex-back-squat',
              targetText: '3x8 @ 70%',
              order: 1,
            },
          ],
        },
        {
          id: `workout-functional-${mon}-2`,
          trackId: 'track-functional',
          dateISO: mon,
          title: 'MetCon',
          movements: [
            {
              id: `mov-functional-${mon}-2`,
              exerciseId: 'ex-burpees',
              targetText: 'AMRAP 10min',
              notes: '10 burpees + 200m run, repeat',
              order: 1,
            },
          ],
        },
      ],
    },

    // Tuesday: Upper Body + Core
    {
      id: `day-functional-${tue}`,
      trackId: 'track-functional',
      dateISO: tue,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${tue}-1`,
          trackId: 'track-functional',
          dateISO: tue,
          title: 'Upper Body',
          movements: [
            {
              id: `mov-functional-${tue}-1`,
              exerciseId: 'ex-bench-press',
              targetText: '4x8',
              order: 1,
            },
            {
              id: `mov-functional-${tue}-2`,
              exerciseId: 'ex-pull-ups',
              targetText: '4xAMRAP',
              order: 2,
            },
            {
              id: `mov-functional-${tue}-3`,
              exerciseId: 'ex-push-ups',
              targetText: '3x20',
              order: 3,
            },
          ],
        },
      ],
    },

    // Wednesday: Cardio + Mobility
    {
      id: `day-functional-${wed}`,
      trackId: 'track-functional',
      dateISO: wed,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${wed}-1`,
          trackId: 'track-functional',
          dateISO: wed,
          title: 'Cardio',
          movements: [
            {
              id: `mov-functional-${wed}-1`,
              exerciseId: 'ex-rowing',
              targetText: '4x500m @ 90% effort',
              notes: 'Rest 2min between rounds',
              order: 1,
            },
          ],
        },
      ],
    },

    // Thursday: Lower Body + MetCon
    {
      id: `day-functional-${thu}`,
      trackId: 'track-functional',
      dateISO: thu,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${thu}-1`,
          trackId: 'track-functional',
          dateISO: thu,
          title: 'Lower Body',
          movements: [
            {
              id: `mov-functional-${thu}-1`,
              exerciseId: 'ex-deadlift',
              targetText: '4x6 @ 75%',
              order: 1,
            },
            {
              id: `mov-functional-${thu}-2`,
              exerciseId: 'ex-box-jumps',
              targetText: '4x12',
              order: 2,
            },
          ],
        },
      ],
    },

    // Friday: Full Body Circuit
    {
      id: `day-functional-${fri}`,
      trackId: 'track-functional',
      dateISO: fri,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${fri}-1`,
          trackId: 'track-functional',
          dateISO: fri,
          title: 'Full Body Circuit',
          movements: [
            {
              id: `mov-functional-${fri}-1`,
              exerciseId: 'ex-front-squat',
              targetText: '3 rounds: 10 reps',
              order: 1,
            },
            {
              id: `mov-functional-${fri}-2`,
              exerciseId: 'ex-overhead-press',
              targetText: '3 rounds: 10 reps',
              order: 2,
            },
            {
              id: `mov-functional-${fri}-3`,
              exerciseId: 'ex-pull-ups',
              targetText: '3 rounds: 10 reps',
              order: 3,
            },
          ],
        },
      ],
    },

    // Saturday: Optional Active Recovery
    {
      id: `day-functional-${sat}`,
      trackId: 'track-functional',
      dateISO: sat,
      weekStartISO: weekStart,
      workouts: [
        {
          id: `workout-functional-${sat}-1`,
          trackId: 'track-functional',
          dateISO: sat,
          title: 'Active Recovery',
          movements: [
            {
              id: `mov-functional-${sat}-1`,
              exerciseId: 'ex-running',
              targetText: '30min easy pace',
              notes: 'Optional - listen to your body',
              order: 1,
            },
          ],
        },
      ],
    },

    // Sunday: Rest
    {
      id: `day-functional-${sun}`,
      trackId: 'track-functional',
      dateISO: sun,
      weekStartISO: weekStart,
      workouts: [],
    },
  ];
}
