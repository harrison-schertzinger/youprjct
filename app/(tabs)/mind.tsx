import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { KPIBar, type KPIStat } from '@/components/ui/KPIBar';
import { PageLabel } from '@/components/ui/PageLabel';
import { tokens } from '@/design/tokens';
import {
  TimerCard,
  BookPickerModal,
  EndSessionModal,
  BookListView,
  HistoryView,
  InsightsView,
} from '@/features/mind/components';
import {
  getBooks,
  getSessions,
  addBook,
  updateBook,
  deleteBook,
  addSession,
  deleteSession,
  calculateInsights,
} from '@/features/mind/storage';
import type { Book, ReadingSession, InsightStats, MindView } from '@/features/mind/types';

// Format minutes to display string
function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

const MIND_BENEFITS = [
  {
    title: 'Reading Timer',
    description: 'Track your reading sessions with a focused timer and automatic logging.',
  },
  {
    title: 'Book Library',
    description: 'Manage your reading list, track progress, and mark books as complete.',
  },
  {
    title: 'Reading Insights',
    description: 'See your reading patterns, streaks, and total time invested in learning.',
  },
];

export default function MindScreen() {
  const [view, setView] = useState<MindView>('list');
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [insights, setInsights] = useState<InsightStats>({
    totalMinutes7Days: 0,
    totalMinutesAllTime: 0,
    sessions7Days: 0,
    sessionsAllTime: 0,
    avgSessionLength: 0,
    booksCompleted: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Session timer state
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modals
  const [bookPickerVisible, setBookPickerVisible] = useState(false);
  const [endSessionVisible, setEndSessionVisible] = useState(false);

  const loadData = useCallback(async () => {
    const loadedBooks = await getBooks();
    const loadedSessions = await getSessions();
    const calculatedInsights = await calculateInsights();

    setBooks(loadedBooks);
    setSessions(loadedSessions);
    setInsights(calculatedInsights);

    // Auto-select first active book if available
    const activeBook = loadedBooks.find((b) => b.isActive);
    if (activeBook && !selectedBook) {
      setSelectedBook(activeBook);
    }
  }, [selectedBook]);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Timer effect
  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionActive]);

  const handleViewChange = (index: number) => {
    const views: MindView[] = ['list', 'history', 'insights'];
    setView(views[index]);
  };

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionDuration(0);
    setSessionStartTime(Date.now());
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setEndSessionVisible(true);
  };

  const handleSaveSession = async (reflection: string) => {
    const now = Date.now();
    const dateStr = new Date(now).toISOString().split('T')[0];

    const newSession: ReadingSession = {
      id: `session-${Date.now()}`,
      bookId: selectedBook?.id,
      bookTitle: selectedBook?.title,
      startTime: sessionStartTime,
      endTime: now,
      durationSeconds: sessionDuration,
      reflection: reflection || undefined,
      date: dateStr,
    };

    await addSession(newSession);
    await loadData();

    setEndSessionVisible(false);
    setSessionDuration(0);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleAddBook = async (title: string, author: string) => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      author: author || undefined,
      isActive: true,
    };

    await addBook(newBook);
    await loadData();

    // Auto-select the newly added book
    setSelectedBook(newBook);
  };

  const handleToggleComplete = async (bookId: string, isCompleting: boolean) => {
    const completedDate = isCompleting ? new Date().toISOString() : undefined;
    await updateBook(bookId, {
      isActive: !isCompleting,
      completedDate,
    });
    await loadData();

    // If we're completing the currently selected book, clear selection
    if (isCompleting && selectedBook?.id === bookId) {
      const activeBook = books.find((b) => b.isActive && b.id !== bookId);
      setSelectedBook(activeBook || null);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    await deleteBook(bookId);
    await loadData();

    // If we deleted the selected book, clear selection
    if (selectedBook?.id === bookId) {
      const activeBook = books.find((b) => b.isActive && b.id !== bookId);
      setSelectedBook(activeBook || null);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    await loadData();
  };

  // Calculate today's reading time
  const todayISO = new Date().toISOString().split('T')[0];
  const todayMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.date === todayISO)
      .reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);
  }, [sessions, todayISO]);

  // Calculate 7-day average
  const avgMinutes7Day = useMemo(() => {
    if (insights.sessions7Days === 0) return 0;
    return Math.round(insights.totalMinutes7Days / 7);
  }, [insights]);

  // Calculate KPI stats
  const kpiStats = useMemo((): [KPIStat, KPIStat, KPIStat] => {
    return [
      { label: 'TODAY', value: formatMinutes(todayMinutes), color: tokens.colors.action },
      { label: '7-DAY AVG', value: formatMinutes(avgMinutes7Day), color: tokens.colors.tint },
      { label: 'TOTAL', value: formatMinutes(insights.totalMinutesAllTime) },
    ];
  }, [todayMinutes, avgMinutes7Day, insights.totalMinutesAllTime]);

  return (
    <PremiumGate
      feature="Mind"
      tagline="Reading and reflection"
      benefits={MIND_BENEFITS}
    >
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tokens.colors.muted}
            />
          }
        >
          <PageLabel label="MIND" />
          <KPIBar stats={kpiStats} />

          <TimerCard
            isActive={sessionActive}
            duration={sessionDuration}
            selectedBook={selectedBook}
            onStart={handleStartSession}
            onEnd={handleEndSession}
            onSelectBook={() => setBookPickerVisible(true)}
          />

          <SegmentedControl
            segments={['List', 'History', 'Insights']}
            selectedIndex={view === 'list' ? 0 : view === 'history' ? 1 : 2}
            onChange={handleViewChange}
          />

          {view === 'list' && (
            <BookListView
              books={books}
              onAddBook={() => setBookPickerVisible(true)}
              onToggleComplete={handleToggleComplete}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {view === 'history' && (
            <HistoryView
              sessions={sessions}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {view === 'insights' && <InsightsView stats={insights} />}
        </ScrollView>

        {/* Modals */}
        <BookPickerModal
          visible={bookPickerVisible}
          books={books}
          selectedBookId={selectedBook?.id || null}
          onSelect={handleSelectBook}
          onAddNew={handleAddBook}
          onClose={() => setBookPickerVisible(false)}
        />

        <EndSessionModal
          visible={endSessionVisible}
          duration={sessionDuration}
          onSave={handleSaveSession}
          onClose={() => setEndSessionVisible(false)}
        />
      </ScreenContainer>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
});
