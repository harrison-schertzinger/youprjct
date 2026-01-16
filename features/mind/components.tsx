// Mind feature components
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { tokens } from '@/design/tokens';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Modal } from '@/components/ui/Modal';
import type { Book, ReadingSession, InsightStats } from './types';

// ========== Mind Accent Color ==========
const MIND_ACCENT = '#6366F1'; // Indigo

// ========== Timer Card ==========

type TimerCardProps = {
  isActive: boolean;
  duration: number; // seconds
  selectedBook: Book | null;
  onStart: () => void;
  onEnd: () => void;
  onSelectBook: () => void;
};

export function TimerCard({
  isActive,
  duration,
  selectedBook,
  onStart,
  onEnd,
  onSelectBook,
}: TimerCardProps) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={[styles.timerCard, isActive && styles.timerCardActive]}>
      {/* Active indicator */}
      {isActive && (
        <View style={styles.activeIndicator}>
          <View style={styles.activeDot} />
          <Text style={styles.activeLabel}>Reading</Text>
        </View>
      )}

      {/* Timer Display */}
      <View style={styles.timerDisplay}>
        <Text style={[styles.timerText, isActive && styles.timerTextActive]}>
          {formattedTime}
        </Text>
      </View>

      {/* Book Info */}
      <Pressable onPress={onSelectBook} style={styles.bookSelector}>
        {selectedBook ? (
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{selectedBook.title}</Text>
            {selectedBook.author && (
              <Text style={styles.bookAuthor}>by {selectedBook.author}</Text>
            )}
          </View>
        ) : (
          <Text style={styles.bookPlaceholder}>Tap to select a book</Text>
        )}
        <Text style={styles.bookChevron}>›</Text>
      </Pressable>

      {/* Action Button */}
      <Pressable
        style={[styles.timerButton, isActive && styles.timerButtonActive]}
        onPress={isActive ? onEnd : onStart}
      >
        <Text style={[styles.timerButtonText, isActive && styles.timerButtonTextActive]}>
          {isActive ? 'End Session' : 'Start Reading'}
        </Text>
      </Pressable>
    </View>
  );
}

// ========== Book Picker Modal ==========

type BookPickerModalProps = {
  visible: boolean;
  books: Book[];
  selectedBookId: string | null;
  onSelect: (book: Book) => void;
  onAddNew: (title: string, author: string) => void;
  onClose: () => void;
};

export function BookPickerModal({
  visible,
  books,
  selectedBookId,
  onSelect,
  onAddNew,
  onClose,
}: BookPickerModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handleAddBook = () => {
    if (newTitle.trim()) {
      onAddNew(newTitle.trim(), newAuthor.trim());
      setNewTitle('');
      setNewAuthor('');
      setShowAddForm(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    onSelect(book);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Select Book">
      <View style={styles.modalContent}>
        {!showAddForm ? (
          <>
            <Pressable
              style={styles.addBookButton}
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.addBookText}>+ Add New Book</Text>
            </Pressable>

            {books.length > 0 ? (
              books.map((book) => (
                <Pressable
                  key={book.id}
                  style={[
                    styles.bookOption,
                    book.id === selectedBookId && styles.bookOptionSelected,
                  ]}
                  onPress={() => handleSelectBook(book)}
                >
                  <View style={styles.bookOptionContent}>
                    <Text style={styles.bookOptionTitle}>{book.title}</Text>
                    {book.author && (
                      <Text style={styles.bookOptionAuthor}>{book.author}</Text>
                    )}
                  </View>
                  {book.id === selectedBookId && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>No books yet. Add one above!</Text>
            )}
          </>
        ) : (
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              placeholderTextColor={tokens.colors.muted}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Author (optional)"
              placeholderTextColor={tokens.colors.muted}
              value={newAuthor}
              onChangeText={setNewAuthor}
            />
            <View style={styles.addFormButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <PrimaryButton
                label="Add Book"
                onPress={handleAddBook}
                style={styles.addButton}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ========== End Session Modal ==========

type EndSessionModalProps = {
  visible: boolean;
  duration: number; // seconds
  onSave: (reflection: string) => void;
  onClose: () => void;
};

export function EndSessionModal({
  visible,
  duration,
  onSave,
  onClose,
}: EndSessionModalProps) {
  const [reflection, setReflection] = useState('');

  const handleSave = () => {
    onSave(reflection.trim());
    setReflection('');
  };

  const minutes = Math.round(duration / 60);

  return (
    <Modal visible={visible} onClose={onClose} title="End & Reflect">
      <View style={styles.modalContent}>
        <View style={styles.sessionSummary}>
          <Text style={styles.sessionSummaryLabel}>Session Duration:</Text>
          <Text style={styles.sessionSummaryValue}>{minutes} minutes</Text>
        </View>

        <Text style={styles.reflectionLabel}>Reflection (optional):</Text>
        <TextInput
          style={styles.reflectionInput}
          placeholder="What did you learn or think about?"
          placeholderTextColor={tokens.colors.muted}
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <PrimaryButton
          label="Save Session"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </Modal>
  );
}

// ========== Book List View ==========

type BookListViewProps = {
  books: Book[];
  onAddBook: () => void;
  onToggleComplete: (bookId: string, isCompleting: boolean) => void;
  onDeleteBook: (bookId: string) => void;
};

export function BookListView({
  books,
  onAddBook,
  onToggleComplete,
  onDeleteBook,
}: BookListViewProps) {
  const activeBooks = books.filter((b) => b.isActive);
  const completedBooks = books.filter((b) => !b.isActive);

  return (
    <View style={styles.listView}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Reading List</Text>
        <Pressable onPress={onAddBook} hitSlop={10}>
          <Text style={styles.addAction}>+</Text>
        </Pressable>
      </View>

      {activeBooks.length > 0 && (
        <Card style={styles.listCard}>
          <Text style={styles.sectionLabel}>Currently Reading</Text>
          {activeBooks.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onToggleComplete={() => onToggleComplete(book.id, true)}
              onDelete={() => onDeleteBook(book.id)}
            />
          ))}
        </Card>
      )}

      {completedBooks.length > 0 && (
        <Card style={styles.listCard}>
          <Text style={styles.sectionLabel}>Completed</Text>
          {completedBooks.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onToggleComplete={() => onToggleComplete(book.id, false)}
              onDelete={() => onDeleteBook(book.id)}
            />
          ))}
        </Card>
      )}

      {books.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No books yet.</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first book</Text>
        </Card>
      )}
    </View>
  );
}

function BookRow({
  book,
  onToggleComplete,
  onDelete,
}: {
  book: Book;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.bookRow}>
      <Pressable onPress={onToggleComplete} style={styles.bookRowContent}>
        <View
          style={[styles.checkbox, !book.isActive && styles.checkboxChecked]}
        />
        <View style={styles.bookRowText}>
          <Text style={styles.bookRowTitle}>{book.title}</Text>
          {book.author && (
            <Text style={styles.bookRowAuthor}>{book.author}</Text>
          )}
        </View>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

// ========== History View ==========

type HistoryViewProps = {
  sessions: ReadingSession[];
  onDeleteSession: (sessionId: string) => void;
};

export function HistoryView({ sessions, onDeleteSession }: HistoryViewProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => b.startTime - a.startTime
  );

  return (
    <View style={styles.listView}>
      <Text style={styles.listTitle}>Session History</Text>

      {sortedSessions.length > 0 ? (
        <Card style={styles.listCard}>
          {sortedSessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onDelete={() => onDeleteSession(session.id)}
            />
          ))}
        </Card>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No reading sessions yet.</Text>
          <Text style={styles.emptySubtext}>
            Start a session to track your reading
          </Text>
        </Card>
      )}
    </View>
  );
}

function SessionRow({
  session,
  onDelete,
}: {
  session: ReadingSession;
  onDelete: () => void;
}) {
  const minutes = Math.round(session.durationSeconds / 60);
  const date = new Date(session.startTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.sessionRow}>
      <View style={styles.sessionRowContent}>
        <View style={styles.sessionRowLeft}>
          <Text style={styles.sessionRowDate}>{date}</Text>
          {session.bookTitle && (
            <Text style={styles.sessionRowBook}>{session.bookTitle}</Text>
          )}
          {session.reflection && (
            <Text style={styles.sessionRowReflection} numberOfLines={2}>
              {session.reflection}
            </Text>
          )}
        </View>
        <View style={styles.sessionRowRight}>
          <View style={styles.durationChip}>
            <Text style={styles.durationText}>{minutes}m</Text>
          </View>
        </View>
      </View>
      <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

// ========== Insights View ==========

type InsightsViewProps = {
  stats: InsightStats;
};

export function InsightsView({ stats }: InsightsViewProps) {
  return (
    <View style={styles.listView}>
      <Text style={styles.listTitle}>Reading Insights</Text>

      <Card style={styles.insightsCard}>
        <Text style={styles.insightsSectionTitle}>Last 7 Days</Text>
        <View style={styles.statsRow}>
          <StatTile
            label="Total Minutes"
            value={stats.totalMinutes7Days.toString()}
          />
          <StatTile label="Sessions" value={stats.sessions7Days.toString()} />
        </View>
      </Card>

      <Card style={styles.insightsCard}>
        <Text style={styles.insightsSectionTitle}>All Time</Text>
        <View style={styles.statsRow}>
          <StatTile
            label="Total Minutes"
            value={stats.totalMinutesAllTime.toString()}
          />
          <StatTile
            label="Sessions"
            value={stats.sessionsAllTime.toString()}
          />
        </View>
        <View style={styles.statsRow}>
          <StatTile
            label="Avg Session"
            value={`${stats.avgSessionLength}m`}
          />
          <StatTile
            label="Books Done"
            value={stats.booksCompleted.toString()}
          />
        </View>
      </Card>

      {stats.sessionsAllTime === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No data yet.</Text>
          <Text style={styles.emptySubtext}>
            Complete reading sessions to see insights
          </Text>
        </Card>
      )}
    </View>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ========== Styles ==========

const styles = StyleSheet.create({
  // Timer Card
  timerCard: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timerCardActive: {
    borderColor: MIND_ACCENT,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MIND_ACCENT,
    marginRight: tokens.spacing.xs,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MIND_ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerDisplay: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '400',
    color: tokens.colors.text,
    fontVariant: ['tabular-nums'],
  },
  timerTextActive: {
    color: MIND_ACCENT,
  },
  bookSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.lg,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  bookAuthor: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  bookPlaceholder: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    flex: 1,
  },
  bookChevron: {
    fontSize: 20,
    color: tokens.colors.muted,
    marginLeft: tokens.spacing.sm,
  },
  timerButton: {
    backgroundColor: MIND_ACCENT,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: MIND_ACCENT,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timerButtonTextActive: {
    color: MIND_ACCENT,
  },

  // Modals
  modalContent: {
    paddingBottom: tokens.spacing.md,
  },
  addBookButton: {
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.md,
    alignItems: 'center',
  },
  addBookText: {
    ...tokens.typography.body,
    color: MIND_ACCENT,
    fontWeight: '700',
  },
  bookOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  bookOptionSelected: {
    borderColor: MIND_ACCENT,
    backgroundColor: `${MIND_ACCENT}10`,
  },
  bookOptionContent: {
    flex: 1,
  },
  bookOptionTitle: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  bookOptionAuthor: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: MIND_ACCENT,
    marginLeft: tokens.spacing.sm,
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.xl,
  },

  // Add Form
  addForm: {
    gap: tokens.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  addFormButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    height: 54,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  cancelButtonText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '700',
  },
  addButton: {
    flex: 1,
  },

  // End Session Modal
  sessionSummary: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
  },
  sessionSummaryLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
  },
  sessionSummaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  reflectionLabel: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  reflectionInput: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
    minHeight: 100,
    marginBottom: tokens.spacing.lg,
  },
  saveButton: {
    marginTop: tokens.spacing.sm,
  },

  // List Views
  listView: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  listTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  addAction: {
    fontSize: 28,
    fontWeight: '300',
    color: MIND_ACCENT,
  },
  listCard: {
    marginBottom: tokens.spacing.lg,
  },
  sectionLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },

  // Book Row
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  bookRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 26,
    width: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    marginRight: tokens.spacing.md,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.text,
    borderColor: tokens.colors.text,
  },
  bookRowText: {
    flex: 1,
  },
  bookRowTitle: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  bookRowAuthor: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  deleteBtn: {
    marginLeft: tokens.spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.muted,
    lineHeight: 22,
  },

  // Session Row
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  sessionRowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionRowLeft: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  sessionRowDate: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    fontWeight: '700',
    marginBottom: 2,
  },
  sessionRowBook: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionRowReflection: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: 4,
  },
  sessionRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  durationChip: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.pill,
    backgroundColor: `${MIND_ACCENT}15`,
  },
  durationText: {
    ...tokens.typography.tiny,
    color: MIND_ACCENT,
    fontWeight: '600',
  },

  // Insights
  insightsCard: {
    marginBottom: tokens.spacing.lg,
  },
  insightsSectionTitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  statTile: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    padding: tokens.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: MIND_ACCENT,
    marginBottom: 4,
  },
  statLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textAlign: 'center',
  },

  // Empty States
  emptyCard: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
  },
  emptySubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: tokens.spacing.xs,
  },
});
