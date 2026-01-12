// Body feature components
import React, { useState } from 'react';
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

// ============================================
// PROFILE VIEW COMPONENTS
// ============================================

type ProfileHeaderProps = {
  name: string;
  streak: number;
};

export function ProfileHeader({ name, streak }: ProfileHeaderProps) {
  return (
    <Card style={styles.profileHeader}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      <Text style={styles.profileName}>{name}</Text>
      <View style={styles.streakContainer}>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>
    </Card>
  );
}

type MovementTileProps = {
  movement: MajorMovement;
};

export function MovementTile({ movement }: MovementTileProps) {
  const trendIcon = movement.trend === 'up' ? '↗' : movement.trend === 'down' ? '↘' : '→';
  const trendColor =
    movement.trend === 'up'
      ? tokens.colors.action
      : movement.trend === 'down'
      ? tokens.colors.danger
      : tokens.colors.muted;

  return (
    <Card style={styles.movementTile}>
      <Text style={styles.movementName}>{movement.name}</Text>
      <View style={styles.movementStats}>
        <View>
          <Text style={styles.movementLabel}>Last Logged</Text>
          <Text style={styles.movementValue}>
            {movement.lastLogged || 'Never'}
          </Text>
        </View>
        <View>
          <Text style={styles.movementLabel}>PR</Text>
          <Text style={styles.movementValue}>
            {movement.bestWeight ? `${movement.bestWeight} lbs` : '—'}
          </Text>
        </View>
      </View>
      <View style={styles.trendContainer}>
        <Text style={[styles.trendIcon, { color: trendColor }]}>{trendIcon}</Text>
      </View>
    </Card>
  );
}

type MajorMovementsTilesProps = {
  movements: MajorMovement[];
};

export function MajorMovementsTiles({ movements }: MajorMovementsTilesProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Major Movements</Text>
      <View style={styles.tilesGrid}>
        {movements.map((movement) => (
          <MovementTile key={movement.id} movement={movement} />
        ))}
      </View>
    </View>
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
  onSelectDate: (date: string) => void;
};

export function WeekStrip({ selectedDate, onSelectDate }: WeekStripProps) {
  const today = new Date();
  const startOfWeek = new Date(today);
  // Monday-first week: subtract days to get to Monday
  const dayOfWeek = today.getDay();
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

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

  return (
    <View style={styles.weekStrip}>
      {days.map((date) => {
        const dateStr = formatDate(date);
        const isSelected = dateStr === selectedDate;
        return (
          <Pressable
            key={dateStr}
            style={[styles.dayCell, isSelected && styles.dayCellSelected]}
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
  );
}

type WorkoutSessionTimerProps = {
  isActive: boolean;
  duration: number;
  onStart: () => void;
  onEnd: () => void;
};

export function WorkoutSessionTimer({
  isActive,
  duration,
  onStart,
  onEnd,
}: WorkoutSessionTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card style={styles.sessionTimer}>
      <View style={styles.sessionTimerContent}>
        <View>
          <Text style={styles.sessionTimerLabel}>Workout Session</Text>
          {isActive && (
            <Text style={styles.sessionTimerDuration}>{formatTime(duration)}</Text>
          )}
        </View>
        <PrimaryButton
          label={isActive ? 'End' : 'Start'}
          onPress={isActive ? onEnd : onStart}
          style={styles.sessionTimerButton}
        />
      </View>
    </Card>
  );
}

type WorkoutTileProps = {
  workout: Workout;
  onPress: () => void;
};

export function WorkoutTile({ workout, onPress }: WorkoutTileProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.workoutTile}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutHeaderContent}>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            {workout.description && (
              <Text style={styles.workoutDescription}>{workout.description}</Text>
            )}
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Card>
    </Pressable>
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
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    ...tokens.typography.h1,
    color: tokens.colors.action,
  },
  streakLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Major Movements
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  tilesGrid: {
    gap: tokens.spacing.md,
  },
  movementTile: {
    position: 'relative',
  },
  movementName: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  movementStats: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
  },
  movementLabel: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  movementValue: {
    ...tokens.typography.small,
    color: tokens.colors.text,
  },
  trendContainer: {
    position: 'absolute',
    top: tokens.spacing.lg,
    right: tokens.spacing.lg,
  },
  trendIcon: {
    fontSize: 20,
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
  weekStrip: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
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

  // Session Timer
  sessionTimer: {
    marginBottom: tokens.spacing.md,
  },
  sessionTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionTimerLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  sessionTimerDuration: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
  },
  sessionTimerButton: {
    width: 100,
    height: 44,
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
});
