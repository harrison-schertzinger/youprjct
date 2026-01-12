// Mock data for Body feature

import type { Track, WorkoutDay, MajorMovement, Result } from './types';

export const mockTracks: Track[] = [
  {
    id: 'track-1',
    name: 'Strength Foundations',
    description: 'Build base strength with compound movements',
  },
  {
    id: 'track-2',
    name: 'Metcon Mastery',
    description: 'High-intensity metabolic conditioning',
  },
];

export const mockWorkoutDays: WorkoutDay[] = [
  {
    date: '2026-01-12', // Sunday
    trackId: 'track-1',
    workouts: [
      {
        id: 'wo-1',
        title: 'Lower Body Power',
        description: 'Focus on explosive strength',
        items: [
          { id: 'item-1', name: 'Back Squat', scoreType: 'weight', description: '5x5' },
          { id: 'item-2', name: 'Box Jumps', scoreType: 'completed', description: '4x10' },
          { id: 'item-3', name: 'Bulgarian Split Squat', scoreType: 'weight', description: '3x8 each leg' },
        ],
      },
      {
        id: 'wo-2',
        title: 'Core Finisher',
        items: [
          { id: 'item-4', name: 'Plank Hold', scoreType: 'time', description: 'Max time' },
          { id: 'item-5', name: 'Hollow Rocks', scoreType: 'rounds-reps', description: 'AMRAP 5min' },
        ],
      },
    ],
  },
  {
    date: '2026-01-13', // Monday
    trackId: 'track-1',
    workouts: [
      {
        id: 'wo-3',
        title: 'Upper Body Push',
        items: [
          { id: 'item-6', name: 'Bench Press', scoreType: 'weight', description: '5x5' },
          { id: 'item-7', name: 'Overhead Press', scoreType: 'weight', description: '4x6' },
          { id: 'item-8', name: 'Dips', scoreType: 'rounds-reps', description: '3 sets to failure' },
        ],
      },
    ],
  },
  {
    date: '2026-01-14', // Tuesday
    trackId: 'track-2',
    workouts: [
      {
        id: 'wo-4',
        title: 'Metcon - Fran',
        description: '21-15-9 for time',
        items: [
          { id: 'item-9', name: 'Fran', scoreType: 'time', description: 'Thrusters (95/65) + Pull-ups' },
        ],
      },
      {
        id: 'wo-5',
        title: 'Skill Work',
        items: [
          { id: 'item-10', name: 'Double Unders', scoreType: 'rounds-reps', description: '5x50 unbroken' },
        ],
      },
    ],
  },
  {
    date: '2026-01-15', // Wednesday
    trackId: 'track-1',
    workouts: [
      {
        id: 'wo-6',
        title: 'Olympic Lifting',
        items: [
          { id: 'item-11', name: 'Clean', scoreType: 'weight', description: '5x3' },
          { id: 'item-12', name: 'Snatch', scoreType: 'weight', description: '5x2' },
        ],
      },
    ],
  },
  {
    date: '2026-01-16', // Thursday
    trackId: 'track-1',
    workouts: [
      {
        id: 'wo-7',
        title: 'Upper Body Pull',
        items: [
          { id: 'item-13', name: 'Deadlift', scoreType: 'weight', description: '5x5' },
          { id: 'item-14', name: 'Weighted Pull-ups', scoreType: 'weight', description: '4x6' },
          { id: 'item-15', name: 'Barbell Rows', scoreType: 'weight', description: '3x8' },
        ],
      },
    ],
  },
  {
    date: '2026-01-17', // Friday
    trackId: 'track-2',
    workouts: [
      {
        id: 'wo-8',
        title: 'Metcon - Cindy',
        description: 'AMRAP 20 minutes',
        items: [
          { id: 'item-16', name: 'Cindy', scoreType: 'rounds-reps', description: '5 Pull-ups, 10 Push-ups, 15 Squats' },
        ],
      },
    ],
  },
  {
    date: '2026-01-18', // Saturday
    trackId: 'track-1',
    workouts: [
      {
        id: 'wo-9',
        title: 'Recovery Day',
        items: [
          { id: 'item-17', name: 'Light Stretching', scoreType: 'completed', description: '30 min' },
          { id: 'item-18', name: 'Zone 2 Cardio', scoreType: 'time', description: 'Easy pace' },
        ],
      },
    ],
  },
];

export const mockMajorMovements: MajorMovement[] = [
  {
    id: 'mm-1',
    name: 'Back Squat',
    lastLogged: '2026-01-10',
    bestWeight: 315,
    trend: 'up',
  },
  {
    id: 'mm-2',
    name: 'Deadlift',
    lastLogged: '2026-01-09',
    bestWeight: 405,
    trend: 'stable',
  },
  {
    id: 'mm-3',
    name: 'Bench',
    lastLogged: '2026-01-08',
    bestWeight: 225,
    trend: 'up',
  },
  {
    id: 'mm-4',
    name: 'Clean',
    lastLogged: '2026-01-05',
    bestWeight: 185,
    trend: 'stable',
  },
  {
    id: 'mm-5',
    name: 'Snatch',
    lastLogged: '2026-01-05',
    bestWeight: 145,
    trend: 'down',
  },
  {
    id: 'mm-6',
    name: 'Strict Press',
    lastLogged: '2026-01-07',
    bestWeight: 135,
    trend: 'up',
  },
];

// Mock leaderboard results for sample workout items
export const mockResults: Result[] = [
  {
    id: 'result-1',
    workoutItemId: 'item-1',
    userId: 'user-1',
    userName: 'Alex Chen',
    score: { type: 'weight', value: 315 },
    createdAt: '2026-01-12T10:30:00Z',
    isPR: true,
  },
  {
    id: 'result-2',
    workoutItemId: 'item-1',
    userId: 'user-2',
    userName: 'Jordan Blake',
    score: { type: 'weight', value: 295 },
    createdAt: '2026-01-12T11:00:00Z',
    isPR: false,
  },
  {
    id: 'result-3',
    workoutItemId: 'item-1',
    userId: 'user-3',
    userName: 'Sam Rivera',
    score: { type: 'weight', value: 275 },
    createdAt: '2026-01-12T09:45:00Z',
    isPR: false,
  },
  {
    id: 'result-4',
    workoutItemId: 'item-9',
    userId: 'user-1',
    userName: 'Alex Chen',
    score: { type: 'time', seconds: 245 },
    createdAt: '2026-01-14T14:20:00Z',
    isPR: false,
  },
  {
    id: 'result-5',
    workoutItemId: 'item-9',
    userId: 'user-2',
    userName: 'Jordan Blake',
    score: { type: 'time', seconds: 312 },
    createdAt: '2026-01-14T14:35:00Z',
    isPR: true,
  },
  {
    id: 'result-6',
    workoutItemId: 'item-16',
    userId: 'user-1',
    userName: 'Alex Chen',
    score: { type: 'rounds-reps', rounds: 18, reps: 12 },
    createdAt: '2026-01-17T16:00:00Z',
    isPR: true,
  },
  {
    id: 'result-7',
    workoutItemId: 'item-16',
    userId: 'user-3',
    userName: 'Sam Rivera',
    score: { type: 'rounds-reps', rounds: 16, reps: 8 },
    createdAt: '2026-01-17T16:15:00Z',
    isPR: false,
  },
];
