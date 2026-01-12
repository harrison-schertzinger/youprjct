// Mind feature types

export type MindView = 'list' | 'history' | 'insights';

export type Book = {
  id: string;
  title: string;
  author?: string;
  completedDate?: string; // ISO date string when marked complete
  isActive: boolean; // Currently reading
};

export type ReadingSession = {
  id: string;
  bookId?: string;
  bookTitle?: string; // Cached for display
  startTime: number; // timestamp
  endTime?: number; // timestamp
  durationSeconds: number;
  reflection?: string;
  date: string; // YYYY-MM-DD
};

export type InsightStats = {
  totalMinutes7Days: number;
  totalMinutesAllTime: number;
  sessions7Days: number;
  sessionsAllTime: number;
  avgSessionLength: number; // in minutes
  booksCompleted: number;
};
