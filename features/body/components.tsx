// Body feature components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { tokens } from '@/design/tokens';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Modal } from '@/components/ui/Modal';
import type {
  MajorMovement,
  Track,
  Workout,
  WorkoutItem,
  Result,
  ScoreValue,
} from './types';
import type { LeaderboardEntry } from '@/lib/repositories/ResultsRepo';
import type { Exercise, ScoreType, SortDirection } from '@/lib/training/types';

// ============================================
// PROFILE VIEW COMPONENTS (ATHLETE STATS)
// ============================================

// Helper to format duration
function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

type TrainingStatsProps = {
  totalSessions: number;
  sessionsThisWeek: number;
  totalTimeSeconds: number;
  avgSessionSeconds: number;
};

export function TrainingStatsSection({
  totalSessions,
  sessionsThisWeek,
  totalTimeSeconds,
  avgSessionSeconds,
}: TrainingStatsProps) {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.statsSectionTitle}>TRAINING OVERVIEW</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{totalSessions}</Text>
          <Text style={styles.statCardLabel}>TOTAL SESSIONS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statCardValue, { color: tokens.colors.tint }]}>
            {sessionsThisWeek}
          </Text>
          <Text style={styles.statCardLabel}>THIS WEEK</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{formatDuration(totalTimeSeconds)}</Text>
          <Text style={styles.statCardLabel}>TOTAL TIME</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{formatDuration(avgSessionSeconds)}</Text>
          <Text style={styles.statCardLabel}>AVG SESSION</Text>
        </View>
      </View>
    </View>
  );
}

type MovementTileProps = {
  movement: MajorMovement;
  onPress: () => void;
};

// Round to nearest 5 lbs (common in weightlifting)
function roundToFive(value: number): number {
  return Math.round(value / 5) * 5;
}

// Generate percentage breakdown for a PR weight
function getPercentages(maxWeight: number): { percent: number; weight: number }[] {
  const percentages = [95, 90, 85, 80, 75, 70, 65];
  return percentages.map((p) => ({
    percent: p,
    weight: roundToFive(maxWeight * (p / 100)),
  }));
}

export function MovementTile({ movement, onPress }: MovementTileProps) {
  const [expanded, setExpanded] = useState(false);
  const hasValue = movement.bestWeight !== undefined;

  const handlePress = () => {
    if (hasValue) {
      setExpanded(!expanded);
    } else {
      onPress();
    }
  };

  const percentages = hasValue ? getPercentages(movement.bestWeight!) : [];

  return (
    <Pressable
      style={[styles.prTile, expanded && styles.prTileExpanded]}
      onPress={handlePress}
    >
      <View style={styles.prTileHeader}>
        <Text style={styles.prMovementName}>{movement.name}</Text>
        {hasValue && (
          <Text style={styles.prExpandIcon}>{expanded ? '▾' : '▸'}</Text>
        )}
      </View>
      {hasValue ? (
        <>
          <View style={styles.prValueRow}>
            <Text style={styles.prValue}>{movement.bestWeight}</Text>
            <Text style={styles.prUnit}>lbs</Text>
          </View>
          {!expanded && movement.lastLogged && (
            <Text style={styles.prLastLogged}>{movement.lastLogged}</Text>
          )}
          {expanded && (
            <View style={styles.prPercentageSection}>
              <View style={styles.prPercentageGrid}>
                {percentages.map(({ percent, weight }) => (
                  <View key={percent} style={styles.prPercentageRow}>
                    <Text style={styles.prPercentageLabel}>{percent}%</Text>
                    <Text style={styles.prPercentageValue}>{weight}</Text>
                  </View>
                ))}
              </View>
              <Pressable style={styles.prEditButton} onPress={onPress}>
                <Text style={styles.prEditButtonText}>Edit PR</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.prAddText}>+ Add</Text>
      )}
    </Pressable>
  );
}

type MajorMovementsTilesProps = {
  movements: MajorMovement[];
  onMovementPress: (movement: MajorMovement) => void;
};

export function MajorMovementsTiles({ movements, onMovementPress }: MajorMovementsTilesProps) {
  return (
    <View style={styles.prSection}>
      <Text style={styles.statsSectionTitle}>PERSONAL RECORDS</Text>
      <View style={styles.prGrid}>
        {movements.map((movement) => (
          <MovementTile
            key={movement.id}
            movement={movement}
            onPress={() => onMovementPress(movement)}
          />
        ))}
      </View>
      {movements.length === 0 && (
        <Text style={styles.emptyPRText}>No major movements configured</Text>
      )}
    </View>
  );
}

// ============================================
// PR INPUT MODAL
// ============================================

type PRInputModalProps = {
  visible: boolean;
  movementName: string;
  currentValue?: number;
  onClose: () => void;
  onSubmit: (value: number) => void;
};

export function PRInputModal({
  visible,
  movementName,
  currentValue,
  onClose,
  onSubmit,
}: PRInputModalProps) {
  const [value, setValue] = useState('');

  // Reset value when modal opens or currentValue changes
  useEffect(() => {
    if (visible) {
      setValue(currentValue?.toString() || '');
    }
  }, [visible, currentValue]);

  const handleSubmit = () => {
    const numValue = parseInt(value) || 0;
    if (numValue > 0) {
      onSubmit(numValue);
    }
    setValue('');
    onClose();
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={movementName}
      footer={
        <PrimaryButton label={currentValue ? 'Update PR' : 'Save PR'} onPress={handleSubmit} />
      }
    >
      <View style={styles.formContainer}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Personal Record (lbs)</Text>
          <TextInput
            style={styles.formInput}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholder={currentValue?.toString() || '225'}
            placeholderTextColor={tokens.colors.muted}
            autoFocus
          />
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// SESSION TIMER (Premium inline timer)
// ============================================

export type TimerState = 'idle' | 'running' | 'paused';

type SessionTimerProps = {
  state: TimerState;
  duration: number;
  workoutTitle?: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onAddTime?: () => void;
};

export function SessionTimer({
  state,
  duration,
  workoutTitle,
  onStart,
  onPause,
  onResume,
  onFinish,
  onAddTime,
}: SessionTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = state === 'running' || state === 'paused';

  return (
    <View style={[styles.sessionTimer, isActive && styles.sessionTimerActive]}>
      <View style={styles.sessionTimerContent}>
        <View style={styles.sessionTimerLeft}>
          {workoutTitle && state !== 'idle' && (
            <Text style={styles.sessionTimerWorkout}>{workoutTitle}</Text>
          )}
          <Text style={[styles.sessionTimerTime, isActive && styles.sessionTimerTimeActive]}>
            {formatTime(duration)}
          </Text>
        </View>
        <View style={styles.sessionTimerButtons}>
          {state === 'idle' && (
            <Pressable style={styles.sessionTimerButton} onPress={onStart}>
              <Text style={styles.sessionTimerButtonText}>Start</Text>
            </Pressable>
          )}
          {state === 'running' && (
            <>
              {onAddTime && (
                <Pressable style={styles.sessionTimerAddTime} onPress={onAddTime}>
                  <Text style={styles.sessionTimerAddTimeText}>+Time</Text>
                </Pressable>
              )}
              <Pressable style={styles.sessionTimerButtonSecondary} onPress={onPause}>
                <Text style={styles.sessionTimerButtonSecondaryText}>Pause</Text>
              </Pressable>
              <Pressable style={styles.sessionTimerButton} onPress={onFinish}>
                <Text style={styles.sessionTimerButtonText}>Finish</Text>
              </Pressable>
            </>
          )}
          {state === 'paused' && (
            <>
              {onAddTime && (
                <Pressable style={styles.sessionTimerAddTime} onPress={onAddTime}>
                  <Text style={styles.sessionTimerAddTimeText}>+Time</Text>
                </Pressable>
              )}
              <Pressable style={styles.sessionTimerButtonSecondary} onPress={onResume}>
                <Text style={styles.sessionTimerButtonSecondaryText}>Resume</Text>
              </Pressable>
              <Pressable style={styles.sessionTimerButton} onPress={onFinish}>
                <Text style={styles.sessionTimerButtonText}>Finish</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// ============================================
// INLINE MOVEMENT CARD (Always expanded)
// ============================================

// Color mapping for score types
const SCORE_TYPE_COLORS: Record<string, string> = {
  weight: '#3B82F6', // Blue
  time: '#22C55E', // Green
  reps: '#F59E0B', // Amber
};

type MovementCardProps = {
  exerciseTitle: string;
  targetText?: string;
  notes?: string;
  scoreType: ScoreType;
  onLog: () => void;
  onViewResults: () => void;
};

export function MovementCard({
  exerciseTitle,
  targetText,
  notes,
  scoreType,
  onLog,
  onViewResults,
}: MovementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const accentColor = SCORE_TYPE_COLORS[scoreType] || tokens.colors.muted;

  return (
    <View style={styles.movementCard}>
      <View style={[styles.movementCardAccent, { backgroundColor: accentColor }]} />
      <View style={styles.movementCardContent}>
        {/* Collapsed Header - Always visible */}
        <Pressable
          style={styles.movementCardHeader}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.movementCardTitle}>{exerciseTitle}</Text>
          <Text style={styles.movementCardChevron}>{expanded ? '▾' : '▸'}</Text>
        </Pressable>

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.movementCardBody}>
            {(targetText || notes) && (
              <View style={styles.movementCardDetails}>
                {targetText && (
                  <Text style={styles.movementCardTarget}>{targetText}</Text>
                )}
                {notes && (
                  <Text style={styles.movementCardNotes}>{notes}</Text>
                )}
              </View>
            )}
            <View style={styles.movementCardButtons}>
              <Pressable
                style={styles.movementCardResultsButton}
                onPress={onViewResults}
              >
                <Text style={styles.movementCardResultsButtonText}>Results</Text>
              </Pressable>
              <Pressable
                style={[styles.movementCardLogButton, { backgroundColor: accentColor }]}
                onPress={onLog}
              >
                <Text style={styles.movementCardLogButtonText}>Log</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ============================================
// INLINE LOG MODAL
// ============================================

type InlineLogModalProps = {
  visible: boolean;
  exerciseTitle: string;
  scoreType: ScoreType;
  onClose: () => void;
  onSubmit: (value: { valueNumber?: number; valueTimeSeconds?: number }) => void;
};

export function InlineLogModal({
  visible,
  exerciseTitle,
  scoreType,
  onClose,
  onSubmit,
}: InlineLogModalProps) {
  const [value, setValue] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSubmit = () => {
    if (scoreType === 'time') {
      const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (totalSeconds > 0) {
        onSubmit({ valueTimeSeconds: totalSeconds });
      }
    } else {
      const numValue = parseInt(value) || 0;
      if (numValue > 0) {
        onSubmit({ valueNumber: numValue });
      }
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setValue('');
    setMinutes('');
    setSeconds('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getLabel = (): string => {
    switch (scoreType) {
      case 'weight':
        return 'Weight (lbs)';
      case 'reps':
        return 'Reps';
      case 'time':
        return 'Time';
      default:
        return 'Value';
    }
  };

  const getPlaceholder = (): string => {
    switch (scoreType) {
      case 'weight':
        return '225';
      case 'reps':
        return '12';
      default:
        return '0';
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={exerciseTitle}
      footer={
        <PrimaryButton label="Log Result" onPress={handleSubmit} />
      }
    >
      <View style={styles.formContainer}>
        {scoreType === 'time' ? (
          <View style={styles.formRow}>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Minutes</Text>
              <TextInput
                style={styles.formInput}
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={tokens.colors.muted}
                autoFocus
              />
            </View>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Seconds</Text>
              <TextInput
                style={styles.formInput}
                value={seconds}
                onChangeText={setSeconds}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
          </View>
        ) : (
          <View style={styles.formField}>
            <Text style={styles.formLabel}>{getLabel()}</Text>
            <TextInput
              style={styles.formInput}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder={getPlaceholder()}
              placeholderTextColor={tokens.colors.muted}
              autoFocus
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

// ============================================
// TRAINING VIEW COMPONENTS
// ============================================

type TrackPickerButtonProps = {
  activeTrack: Track | null;
  onPress: () => void;
};

export function TrackPickerButton({ activeTrack, onPress }: TrackPickerButtonProps) {
  return (
    <Pressable style={styles.trackPickerButton} onPress={onPress}>
      <View>
        <Text style={styles.trackPickerLabel}>Active Track</Text>
        <Text style={styles.trackPickerValue}>
          {activeTrack ? activeTrack.name : 'Select a track'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

type TrackPickerModalProps = {
  visible: boolean;
  tracks: Track[];
  selectedTrackId: string | null;
  onSelect: (track: Track) => void;
  onClose: () => void;
};

export function TrackPickerModal({
  visible,
  tracks,
  selectedTrackId,
  onSelect,
  onClose,
}: TrackPickerModalProps) {
  return (
    <Modal visible={visible} onClose={onClose} title="Select Track">
      {tracks.map((track) => (
        <Pressable
          key={track.id}
          style={[
            styles.trackOption,
            selectedTrackId === track.id && styles.trackOptionSelected,
          ]}
          onPress={() => {
            onSelect(track);
            onClose();
          }}
        >
          <View style={styles.trackOptionContent}>
            <Text style={styles.trackOptionName}>{track.name}</Text>
            <Text style={styles.trackOptionDesc}>{track.description}</Text>
          </View>
          {selectedTrackId === track.id && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
      ))}
    </Modal>
  );
}

type WeekStripProps = {
  selectedDate: string;
  weekOffset: number;
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

export function WeekStrip({
  selectedDate,
  weekOffset,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: WeekStripProps) {
  const today = new Date();
  const startOfWeek = new Date(today);
  // Monday-first week: subtract days to get to Monday
  const dayOfWeek = today.getDay();
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  // Apply week offset
  startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayLabel = (date: Date) => {
    // Monday-first layout: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
      date.getDay() === 0 ? 6 : date.getDay() - 1
    ];
  };

  // Format week label (e.g., "Jan 6 - 12" or "This Week")
  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    if (weekOffset === 1) return 'Next Week';

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}`;
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
  };

  return (
    <View style={styles.weekStripContainer}>
      <View style={styles.weekStripHeader}>
        <Pressable style={styles.weekArrow} onPress={onPrevWeek}>
          <Text style={styles.weekArrowText}>‹</Text>
        </Pressable>
        <Text style={styles.weekLabel}>{getWeekLabel()}</Text>
        <Pressable style={styles.weekArrow} onPress={onNextWeek}>
          <Text style={styles.weekArrowText}>›</Text>
        </Pressable>
      </View>
      <View style={styles.weekStrip}>
        {days.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === formatDate(new Date());
          return (
            <Pressable
              key={dateStr}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
              onPress={() => onSelectDate(dateStr)}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {getDayLabel(date)}
              </Text>
              <Text style={[styles.dayDate, isSelected && styles.dayDateSelected]}>
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type LogResultModalProps = {
  visible: boolean;
  item: WorkoutItem | null;
  onClose: () => void;
  onSubmit: (score: ScoreValue) => void;
};

export function LogResultModal({
  visible,
  item,
  onClose,
  onSubmit,
}: LogResultModalProps) {
  const [weightValue, setWeightValue] = useState('');
  const [rounds, setRounds] = useState('');
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (!item) return;

    let score: ScoreValue;

    switch (item.scoreType) {
      case 'weight':
        score = { type: 'weight', value: parseInt(weightValue) || 0 };
        break;
      case 'rounds-reps':
        score = {
          type: 'rounds-reps',
          rounds: parseInt(rounds) || 0,
          reps: parseInt(reps) || 0,
        };
        break;
      case 'time':
        const totalSeconds =
          (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
        score = { type: 'time', seconds: totalSeconds };
        break;
      case 'completed':
        score = { type: 'completed', value: completed };
        break;
    }

    onSubmit(score);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setWeightValue('');
    setRounds('');
    setReps('');
    setMinutes('');
    setSeconds('');
    setCompleted(false);
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={`Log Result: ${item.name}`}
      footer={
        <PrimaryButton label="Submit" onPress={handleSubmit} />
      }
    >
      <View style={styles.formContainer}>
        {item.scoreType === 'weight' && (
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Weight (lbs)</Text>
            <TextInput
              style={styles.formInput}
              value={weightValue}
              onChangeText={setWeightValue}
              keyboardType="numeric"
              placeholder="Enter weight"
              placeholderTextColor={tokens.colors.muted}
            />
          </View>
        )}

        {item.scoreType === 'rounds-reps' && (
          <View style={styles.formRow}>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Rounds</Text>
              <TextInput
                style={styles.formInput}
                value={rounds}
                onChangeText={setRounds}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Reps</Text>
              <TextInput
                style={styles.formInput}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
          </View>
        )}

        {item.scoreType === 'time' && (
          <View style={styles.formRow}>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Minutes</Text>
              <TextInput
                style={styles.formInput}
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
            <View style={[styles.formField, styles.formFieldHalf]}>
              <Text style={styles.formLabel}>Seconds</Text>
              <TextInput
                style={styles.formInput}
                value={seconds}
                onChangeText={setSeconds}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
          </View>
        )}

        {item.scoreType === 'completed' && (
          <Pressable
            style={styles.completedToggle}
            onPress={() => setCompleted(!completed)}
          >
            <View
              style={[
                styles.completedCheckbox,
                completed && styles.completedCheckboxActive,
              ]}
            >
              {completed && <Text style={styles.completedCheckmark}>✓</Text>}
            </View>
            <Text style={styles.completedLabel}>Mark as completed</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}

type LeaderboardModalProps = {
  visible: boolean;
  item: WorkoutItem | null;
  results: Result[];
  onClose: () => void;
};

export function LeaderboardModal({
  visible,
  item,
  results,
  onClose,
}: LeaderboardModalProps) {
  if (!item) return null;

  const formatScore = (score: ScoreValue): string => {
    switch (score.type) {
      case 'weight':
        return `${score.value} lbs`;
      case 'rounds-reps':
        return `${score.rounds}+${score.reps}`;
      case 'time':
        const mins = Math.floor(score.seconds / 60);
        const secs = score.seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      case 'completed':
        return score.value ? 'Complete' : 'Incomplete';
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (item.scoreType === 'time') {
      return (a.score as any).seconds - (b.score as any).seconds;
    } else if (item.scoreType === 'weight') {
      return (b.score as any).value - (a.score as any).value;
    } else if (item.scoreType === 'rounds-reps') {
      const aTotal = (a.score as any).rounds * 100 + (a.score as any).reps;
      const bTotal = (b.score as any).rounds * 100 + (b.score as any).reps;
      return bTotal - aTotal;
    }
    return 0;
  });

  return (
    <Modal visible={visible} onClose={onClose} title={`Leaderboard: ${item.name}`}>
      <View style={styles.leaderboardContainer}>
        {sortedResults.map((result, index) => (
          <View key={result.id} style={styles.leaderboardRow}>
            <View style={styles.leaderboardRank}>
              <Text style={styles.leaderboardRankText}>{index + 1}</Text>
            </View>
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>{result.userName}</Text>
              <Text style={styles.leaderboardScore}>{formatScore(result.score)}</Text>
            </View>
            {result.isPR && (
              <View style={styles.prBadge}>
                <Text style={styles.prBadgeText}>PR</Text>
              </View>
            )}
          </View>
        ))}
        {sortedResults.length === 0 && (
          <Text style={styles.emptyLeaderboard}>No results yet</Text>
        )}
      </View>
    </Modal>
  );
}

// ============================================
// WORKOUT SESSION COMPONENTS
// ============================================

type CompactSessionTimerProps = {
  state: TimerState;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
};

export function CompactSessionTimer({
  state,
  duration,
  onStart,
  onPause,
  onResume,
  onFinish,
}: CompactSessionTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderButtons = () => {
    switch (state) {
      case 'idle':
        return (
          <Pressable style={styles.compactTimerButton} onPress={onStart}>
            <Text style={styles.compactTimerButtonText}>Start</Text>
          </Pressable>
        );
      case 'running':
        return (
          <View style={styles.compactTimerButtonRow}>
            <Pressable
              style={[styles.compactTimerButton, styles.compactTimerButtonSecondary]}
              onPress={onPause}
            >
              <Text style={styles.compactTimerButtonTextSecondary}>Pause</Text>
            </Pressable>
            <Pressable style={styles.compactTimerButton} onPress={onFinish}>
              <Text style={styles.compactTimerButtonText}>Finish</Text>
            </Pressable>
          </View>
        );
      case 'paused':
        return (
          <View style={styles.compactTimerButtonRow}>
            <Pressable
              style={[styles.compactTimerButton, styles.compactTimerButtonSecondary]}
              onPress={onResume}
            >
              <Text style={styles.compactTimerButtonTextSecondary}>Resume</Text>
            </Pressable>
            <Pressable style={styles.compactTimerButton} onPress={onFinish}>
              <Text style={styles.compactTimerButtonText}>Finish</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <View style={styles.compactTimer}>
      <View style={styles.compactTimerLeft}>
        <Text style={styles.compactTimerLabel}>Session</Text>
        <Text style={styles.compactTimerDuration}>{formatTime(duration)}</Text>
      </View>
      {renderButtons()}
    </View>
  );
}

type ExpandableMovementTileProps = {
  exerciseTitle: string;
  targetText?: string;
  notes?: string;
  scoreType: ScoreType;
  isExpanded: boolean;
  onToggle: () => void;
  onLogResult: () => void;
  onViewResults: () => void;
};

export function ExpandableMovementTile({
  exerciseTitle,
  targetText,
  notes,
  scoreType,
  isExpanded,
  onToggle,
  onLogResult,
  onViewResults,
}: ExpandableMovementTileProps) {
  const getScoreTypeLabel = (type: ScoreType): string => {
    switch (type) {
      case 'weight':
        return 'Weight';
      case 'reps':
        return 'Reps';
      case 'time':
        return 'Time';
      default:
        return '';
    }
  };

  return (
    <Card style={styles.expandableTile}>
      <Pressable style={styles.expandableTileHeader} onPress={onToggle}>
        <View style={styles.expandableTileHeaderContent}>
          <Text style={styles.expandableTileTitle}>{exerciseTitle}</Text>
          <Text style={styles.expandableTileSubtitle}>{getScoreTypeLabel(scoreType)}</Text>
        </View>
        <Text style={styles.expandableTileChevron}>{isExpanded ? '−' : '+'}</Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.expandableTileBody}>
          {targetText && (
            <View style={styles.expandableTileDetail}>
              <Text style={styles.expandableTileDetailLabel}>Target</Text>
              <Text style={styles.expandableTileDetailValue}>{targetText}</Text>
            </View>
          )}
          {notes && (
            <View style={styles.expandableTileDetail}>
              <Text style={styles.expandableTileDetailLabel}>Notes</Text>
              <Text style={styles.expandableTileDetailValue}>{notes}</Text>
            </View>
          )}
          <View style={styles.expandableTileActions}>
            <Pressable style={styles.expandableTileActionButton} onPress={onLogResult}>
              <Text style={styles.expandableTileActionButtonText}>Log Result</Text>
            </Pressable>
            <Pressable
              style={[styles.expandableTileActionButton, styles.expandableTileActionButtonSecondary]}
              onPress={onViewResults}
            >
              <Text style={styles.expandableTileActionButtonTextSecondary}>Results</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Card>
  );
}

type ExerciseLeaderboardModalProps = {
  visible: boolean;
  exerciseTitle: string;
  scoreType: ScoreType;
  sortDirection: SortDirection;
  entries: LeaderboardEntry[];
  onClose: () => void;
};

export function ExerciseLeaderboardModal({
  visible,
  exerciseTitle,
  scoreType,
  sortDirection,
  entries,
  onClose,
}: ExerciseLeaderboardModalProps) {
  const formatValue = (value: number): string => {
    if (scoreType === 'time') {
      const mins = Math.floor(value / 60);
      const secs = value % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else if (scoreType === 'weight') {
      return `${value} lbs`;
    } else {
      return `${value} reps`;
    }
  };

  const formatDate = (dateISO: string): string => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Modal visible={visible} onClose={onClose} title={exerciseTitle}>
      <View style={styles.exerciseLeaderboardContainer}>
        {entries.length === 0 ? (
          <Text style={styles.emptyLeaderboard}>No results logged yet</Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.exerciseLeaderboardRow}>
              <View style={styles.exerciseLeaderboardRank}>
                <Text style={styles.exerciseLeaderboardRankText}>{entry.rank}</Text>
              </View>
              <View style={styles.exerciseLeaderboardInfo}>
                <Text style={styles.exerciseLeaderboardName}>{entry.displayName}</Text>
                <Text style={styles.exerciseLeaderboardDate}>{formatDate(entry.dateISO)}</Text>
              </View>
              <View style={styles.exerciseLeaderboardValueContainer}>
                <Text style={styles.exerciseLeaderboardValue}>{formatValue(entry.value)}</Text>
                {entry.isPR && (
                  <View style={styles.prBadge}>
                    <Text style={styles.prBadgeText}>PR</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </Modal>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Training Stats Section
  statsSection: {
    marginBottom: tokens.spacing.lg,
  },
  statsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.md,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: tokens.colors.muted,
    letterSpacing: 0.3,
  },

  // Personal Records Section
  prSection: {
    marginTop: tokens.spacing.md,
  },
  prGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  prTile: {
    width: '48%',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.md,
  },
  prTileExpanded: {
    width: '100%',
  },
  prTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prMovementName: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
  },
  prExpandIcon: {
    fontSize: 12,
    color: tokens.colors.muted,
  },
  prValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  prValue: {
    fontSize: 28,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  prUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  prLastLogged: {
    fontSize: 11,
    color: tokens.colors.muted,
    marginTop: tokens.spacing.xs,
  },
  prAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.tint,
    marginTop: tokens.spacing.sm,
  },
  prPercentageSection: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  prPercentageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
  },
  prPercentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 6,
    paddingHorizontal: tokens.spacing.sm,
    minWidth: 80,
  },
  prPercentageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.muted,
    width: 32,
  },
  prPercentageValue: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  prEditButton: {
    marginTop: tokens.spacing.md,
    alignSelf: 'flex-start',
  },
  prEditButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.tint,
  },
  emptyPRText: {
    fontSize: 14,
    color: tokens.colors.muted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
  },

  // Session Timer
  sessionTimer: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
  },
  sessionTimerActive: {
    borderColor: tokens.colors.tint,
  },
  sessionTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
  },
  sessionTimerLeft: {
    flex: 1,
  },
  sessionTimerWorkout: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  sessionTimerTime: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.muted,
    fontVariant: ['tabular-nums'],
  },
  sessionTimerTimeActive: {
    color: tokens.colors.text,
  },
  sessionTimerButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  sessionTimerButton: {
    backgroundColor: tokens.colors.tint,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
  },
  sessionTimerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionTimerButtonSecondary: {
    backgroundColor: tokens.colors.bg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  sessionTimerButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  sessionTimerAddTime: {
    backgroundColor: tokens.colors.bg,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  sessionTimerAddTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
  },

  // Movement Card (Expandable)
  movementCard: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  movementCardAccent: {
    width: 3,
  },
  movementCardContent: {
    flex: 1,
    padding: tokens.spacing.md,
  },
  movementCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  movementCardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  movementCardChevron: {
    fontSize: 14,
    color: tokens.colors.muted,
  },
  movementCardBody: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  movementCardDetails: {
    marginBottom: tokens.spacing.md,
  },
  movementCardTarget: {
    fontSize: 14,
    color: tokens.colors.text,
  },
  movementCardNotes: {
    fontSize: 13,
    fontStyle: 'italic',
    color: tokens.colors.muted,
    marginTop: tokens.spacing.xs,
  },
  movementCardButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  movementCardResultsButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  movementCardResultsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  movementCardLogButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
  },
  movementCardLogButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Track Picker
  trackPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  trackPickerLabel: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  trackPickerValue: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  chevron: {
    fontSize: 24,
    color: tokens.colors.muted,
  },
  trackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  trackOptionSelected: {
    backgroundColor: tokens.colors.bg,
  },
  trackOptionContent: {
    flex: 1,
  },
  trackOptionName: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    marginBottom: 2,
  },
  trackOptionDesc: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  checkmark: {
    fontSize: 18,
    color: tokens.colors.tint,
    fontWeight: '700',
  },

  // Week Strip
  weekStripContainer: {
    marginBottom: tokens.spacing.md,
  },
  weekStripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  weekArrow: {
    padding: tokens.spacing.sm,
  },
  weekArrowText: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  weekStrip: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
  },
  dayCellSelected: {
    backgroundColor: tokens.colors.tint,
    borderColor: tokens.colors.tint,
  },
  dayCellToday: {
    borderColor: tokens.colors.tint,
  },
  dayLabel: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  dayLabelSelected: {
    color: '#FFFFFF',
  },
  dayDate: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  dayDateSelected: {
    color: '#FFFFFF',
  },

  // Workout Tiles
  workoutTile: {
    marginBottom: tokens.spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutHeaderContent: {
    flex: 1,
  },
  workoutTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: 2,
  },
  workoutDescription: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Log Result Form
  formContainer: {
    gap: tokens.spacing.md,
  },
  formField: {
    gap: tokens.spacing.xs,
  },
  formFieldHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  formLabel: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  formInput: {
    height: 48,
    backgroundColor: tokens.colors.bg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  completedCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    borderRadius: 6,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckboxActive: {
    backgroundColor: tokens.colors.tint,
    borderColor: tokens.colors.tint,
  },
  completedCheckmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  completedLabel: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },

  // Leaderboard
  leaderboardContainer: {
    gap: tokens.spacing.sm,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  leaderboardRankText: {
    ...tokens.typography.small,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    marginBottom: 2,
  },
  leaderboardScore: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  prBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    backgroundColor: tokens.colors.action,
    borderRadius: tokens.radius.pill,
  },
  prBadgeText: {
    ...tokens.typography.tiny,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyLeaderboard: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.xl,
  },

  // Compact Session Timer
  compactTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  compactTimerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: tokens.spacing.sm,
  },
  compactTimerLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  compactTimerDuration: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  compactTimerButtonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  compactTimerButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.tint,
    borderRadius: tokens.radius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  compactTimerButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  compactTimerButtonText: {
    ...tokens.typography.small,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  compactTimerButtonTextSecondary: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    fontWeight: '600',
  },

  // Expandable Movement Tile
  expandableTile: {
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  expandableTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandableTileHeaderContent: {
    flex: 1,
  },
  expandableTileTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  expandableTileSubtitle: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  expandableTileChevron: {
    fontSize: 20,
    color: tokens.colors.muted,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  expandableTileBody: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  expandableTileDetail: {
    marginBottom: tokens.spacing.sm,
  },
  expandableTileDetailLabel: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  expandableTileDetailValue: {
    ...tokens.typography.small,
    color: tokens.colors.text,
  },
  expandableTileActions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  expandableTileActionButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.tint,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
  },
  expandableTileActionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  expandableTileActionButtonText: {
    ...tokens.typography.small,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  expandableTileActionButtonTextSecondary: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    fontWeight: '600',
  },

  // Exercise Leaderboard Modal
  exerciseLeaderboardContainer: {
    gap: tokens.spacing.xs,
  },
  exerciseLeaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  exerciseLeaderboardRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  exerciseLeaderboardRankText: {
    ...tokens.typography.small,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  exerciseLeaderboardInfo: {
    flex: 1,
  },
  exerciseLeaderboardName: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  exerciseLeaderboardDate: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  exerciseLeaderboardValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  exerciseLeaderboardValue: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
});
