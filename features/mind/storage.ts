// Mind feature storage (AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Book, ReadingSession, InsightStats } from './types';

const BOOKS_KEY = '@mind:books';
const SESSIONS_KEY = '@mind:sessions';

// ========== Books ==========

export async function getBooks(): Promise<Book[]> {
  try {
    const json = await AsyncStorage.getItem(BOOKS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load books:', error);
    return [];
  }
}

export async function saveBooks(books: Book[]): Promise<void> {
  try {
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Failed to save books:', error);
  }
}

export async function addBook(book: Book): Promise<void> {
  const books = await getBooks();
  books.push(book);
  await saveBooks(books);
}

export async function updateBook(bookId: string, updates: Partial<Book>): Promise<void> {
  const books = await getBooks();
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    await saveBooks(books);
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  const books = await getBooks();
  const filtered = books.filter((b) => b.id !== bookId);
  await saveBooks(filtered);
}

// ========== Reading Sessions ==========

export async function getSessions(): Promise<ReadingSession[]> {
  try {
    const json = await AsyncStorage.getItem(SESSIONS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
}

export async function saveSessions(sessions: ReadingSession[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}

export async function addSession(session: ReadingSession): Promise<void> {
  const sessions = await getSessions();
  sessions.push(session);
  await saveSessions(sessions);
}

export async function updateSession(
  sessionId: string,
  updates: Partial<ReadingSession>
): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    await saveSessions(sessions);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();
  const filtered = sessions.filter((s) => s.id !== sessionId);
  await saveSessions(filtered);
}

// ========== Insights Calculations ==========

export async function calculateInsights(): Promise<InsightStats> {
  const sessions = await getSessions();
  const books = await getBooks();

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const sessionsLast7Days = sessions.filter((s) => s.startTime >= sevenDaysAgo);

  const totalMinutes7Days = sessionsLast7Days.reduce(
    (sum, s) => sum + s.durationSeconds / 60,
    0
  );
  const totalMinutesAllTime = sessions.reduce(
    (sum, s) => sum + s.durationSeconds / 60,
    0
  );
  const sessions7Days = sessionsLast7Days.length;
  const sessionsAllTime = sessions.length;
  const avgSessionLength =
    sessionsAllTime > 0 ? totalMinutesAllTime / sessionsAllTime : 0;
  const booksCompleted = books.filter((b) => b.completedDate).length;

  return {
    totalMinutes7Days: Math.round(totalMinutes7Days),
    totalMinutesAllTime: Math.round(totalMinutesAllTime),
    sessions7Days,
    sessionsAllTime,
    avgSessionLength: Math.round(avgSessionLength),
    booksCompleted,
  };
}
