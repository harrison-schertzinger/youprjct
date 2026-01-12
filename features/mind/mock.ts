// Mock data for Mind feature
import type { Book, ReadingSession } from './types';

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    isActive: true,
  },
  {
    id: 'book-2',
    title: 'Deep Work',
    author: 'Cal Newport',
    isActive: false,
    completedDate: '2026-01-05',
  },
  {
    id: 'book-3',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    isActive: false,
    completedDate: '2025-12-20',
  },
];

export const mockSessions: ReadingSession[] = [
  {
    id: 'session-1',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    startTime: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    endTime: Date.now() - 8 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
    durationSeconds: 2700, // 45 min
    reflection: 'Great chapter on habit stacking',
    date: '2026-01-04',
  },
  {
    id: 'session-2',
    bookId: 'book-2',
    bookTitle: 'Deep Work',
    startTime: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    endTime: Date.now() - 6 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
    durationSeconds: 1800, // 30 min
    date: '2026-01-06',
  },
  {
    id: 'session-3',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    startTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    endTime: Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    durationSeconds: 3600, // 60 min
    reflection: 'Finished part 2',
    date: '2026-01-09',
  },
  {
    id: 'session-4',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    startTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    endTime: Date.now() - 1 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000,
    durationSeconds: 1500, // 25 min
    date: '2026-01-11',
  },
];
