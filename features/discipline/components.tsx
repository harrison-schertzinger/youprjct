// Discipline feature components
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';
import { Card } from '@/components/ui/Card';
import {
  type Rule,
  type Challenge,
  type ChallengeColor,
  type ChallengeDuration,
  type DailyRequirementStatus,
  type RulesAdherenceHistory,
  type TodayRulesCheckIn,
  CHALLENGE_GRADIENTS,
  CHALLENGE_COLOR_NAMES,
  CHALLENGE_DURATIONS,
  RULES_GRADIENT,
} from './types';
import {
  getTodayISO,
  getDateISO,
  addDays,
  getDayNumber,
  isDateInPast,
  isDateToday,
  getLast30DaysAdherence,
} from './storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tile sizes for grids
const RULES_TILE_SIZE = (SCREEN_WIDTH - 32 - 36) / 10; // 30-day grid (3 rows of 10)

// ============================================================
// Segmented Control
// ============================================================

type SegmentedControlProps = {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export function SegmentedControl({ segments, selectedIndex, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.segmentedControl}>
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          style={[
            styles.segment,
            index === 0 && styles.segmentFirst,
            index === segments.length - 1 && styles.segmentLast,
            selectedIndex === index && styles.segmentActive,
          ]}
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && styles.segmentTextActive,
            ]}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================================
// Rules Adherence Card (Redesigned with gradient bar)
// ============================================================

type RulesAdherenceCardProps = {
  todayPercentage: number;
  currentStreak: number;
  bestStreak: number;
  hasCheckedInToday: boolean;
};

export function RulesAdherenceCard({
  todayPercentage,
  currentStreak,
  bestStreak,
  hasCheckedInToday,
}: RulesAdherenceCardProps) {
  return (
    <Card style={styles.adherenceCard}>
      {/* Header with gradient bar */}
      <LinearGradient
        colors={[RULES_GRADIENT.start, RULES_GRADIENT.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rulesColorBar}
      />
      <Text style={styles.cardTitle}>Rules Adherence</Text>

      {/* Today's progress bar */}
      <View style={styles.todayProgressSection}>
        <View style={styles.todayProgressHeader}>
          <Text style={styles.todayProgressLabel}>Today</Text>
          <Text style={styles.todayProgressValue}>
            {hasCheckedInToday ? `${todayPercentage}%` : 'Not checked in'}
          </Text>
        </View>
        <View style={styles.todayProgressBar}>
          <LinearGradient
            colors={[RULES_GRADIENT.start, RULES_GRADIENT.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.todayProgressFill,
              { width: hasCheckedInToday ? `${todayPercentage}%` : '0%' },
            ]}
          />
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.adherenceStats}>
        <View style={styles.adherenceStat}>
          <Text style={styles.adherenceValue}>{currentStreak}</Text>
          <Text style={styles.adherenceLabel}>Current Streak</Text>
        </View>
        <View style={styles.adherenceStat}>
          <Text style={styles.adherenceValue}>{bestStreak}</Text>
          <Text style={styles.adherenceLabel}>Best Streak</Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================
// Rules Calendar Grid (30-day view with gradient tiles)
// ============================================================

type RulesCalendarTileProps = {
  dayLabel: string;
  percentage: number; // -1 means no data
  isToday: boolean;
};

function RulesCalendarTile({ dayLabel, percentage, isToday }: RulesCalendarTileProps) {
  const hasData = percentage >= 0;

  // Calculate opacity based on adherence percentage
  const getOpacity = () => {
    if (!hasData) return 0.3;
    if (percentage === 100) return 1;
    if (percentage >= 80) return 0.85;
    if (percentage >= 50) return 0.65;
    if (percentage > 0) return 0.45;
    return 0.3;
  };

  return (
    <View style={[styles.rulesCalendarTile, isToday && styles.rulesCalendarTileToday]}>
      {hasData && percentage > 0 ? (
        <LinearGradient
          colors={[RULES_GRADIENT.start, RULES_GRADIENT.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.rulesCalendarTileGradient, { opacity: getOpacity() }]}
        >
          <Text style={styles.rulesCalendarTileText}>{dayLabel}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.rulesCalendarTileEmpty}>
          <Text style={[styles.rulesCalendarTileTextEmpty, isToday && styles.rulesCalendarTileTextToday]}>
            {dayLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

type RulesCalendarGridProps = {
  history: RulesAdherenceHistory;
};

export function RulesCalendarGrid({ history }: RulesCalendarGridProps) {
  const last30Days = getLast30DaysAdherence(history);
  const today = getTodayISO();

  return (
    <View style={styles.rulesCalendarGrid}>
      {last30Days.map(({ date, percentage }, index) => {
        const dayNumber = new Date(date).getDate();
        const isToday = date === today;
        return (
          <RulesCalendarTile
            key={date}
            dayLabel={dayNumber.toString()}
            percentage={percentage}
            isToday={isToday}
          />
        );
      })}
    </View>
  );
}

// ============================================================
// Rules Check-In Card
// ============================================================

type RulesCheckInCardProps = {
  rules: Rule[];
  checkIn: TodayRulesCheckIn | null;
  onToggleRule: (ruleId: string) => void;
  onCompleteCheckIn: () => void;
};

export function RulesCheckInCard({
  rules,
  checkIn,
  onToggleRule,
  onCompleteCheckIn,
}: RulesCheckInCardProps) {
  const hasCheckedIn = checkIn?.hasCheckedIn ?? false;
  const checkedCount = checkIn?.checkedRules.length ?? 0;
  const allChecked = checkedCount === rules.length && rules.length > 0;

  if (rules.length === 0) {
    return null;
  }

  return (
    <Card style={styles.checkInCard}>
      <View style={styles.checkInHeader}>
        <Text style={styles.checkInTitle}>Daily Check-In</Text>
        {hasCheckedIn ? (
          <View style={styles.checkInBadge}>
            <Text style={styles.checkInBadgeText}>Done</Text>
          </View>
        ) : (
          <Text style={styles.checkInSubtitle}>
            {checkedCount}/{rules.length} rules followed
          </Text>
        )}
      </View>

      {!hasCheckedIn && (
        <>
          <View style={styles.checkInRulesList}>
            {rules.map((rule) => {
              const isChecked = checkIn?.checkedRules.includes(rule.id) ?? false;
              return (
                <TouchableOpacity
                  key={rule.id}
                  style={styles.checkInRuleItem}
                  onPress={() => onToggleRule(rule.id)}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkInRuleText, isChecked && styles.checkInRuleTextChecked]}>
                    {rule.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.checkInButton, !allChecked && styles.checkInButtonDisabled]}
            onPress={onCompleteCheckIn}
            disabled={!allChecked}
          >
            <LinearGradient
              colors={allChecked ? [RULES_GRADIENT.start, RULES_GRADIENT.end] : [tokens.colors.border, tokens.colors.border]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkInButtonGradient}
            >
              <Text style={[styles.checkInButtonText, !allChecked && styles.checkInButtonTextDisabled]}>
                Complete Check-In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {hasCheckedIn && (
        <View style={styles.checkInCompleteMessage}>
          <Text style={styles.checkInCompleteText}>
            {checkedCount === rules.length ? 'Perfect adherence today!' : `${checkedCount}/${rules.length} rules followed`}
          </Text>
          <Text style={styles.checkInCompleteSubtext}>Come back tomorrow</Text>
        </View>
      )}
    </Card>
  );
}

// ============================================================
// Add New Rule Button
// ============================================================

type AddNewRuleButtonProps = {
  onPress: () => void;
};

export function AddNewRuleButton({ onPress }: AddNewRuleButtonProps) {
  return (
    <TouchableOpacity style={styles.addRuleButton} onPress={onPress}>
      <Text style={styles.addRuleIcon}>+</Text>
      <Text style={styles.addRuleText}>Add New Rule</Text>
    </TouchableOpacity>
  );
}

// ============================================================
// Rule List Item
// ============================================================

type RuleListItemProps = {
  rule: Rule;
  onDelete: (id: string) => void;
};

export function RuleListItem({ rule, onDelete }: RuleListItemProps) {
  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleAccentBar} />
      <Text style={styles.ruleTitle}>{rule.title}</Text>
      <TouchableOpacity onPress={() => onDelete(rule.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================
// Calendar Day Tile (with animation)
// ============================================================

type CalendarDayTileProps = {
  dayNumber: number;
  date: string;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  color: ChallengeColor;
  onComplete?: () => void;
};

function CalendarDayTile({
  dayNumber,
  isCompleted,
  isToday,
  isPast,
  isFuture,
  color,
  onComplete,
}: CalendarDayTileProps) {
  const scaleAnim = useRef(new Animated.Value(isCompleted ? 1 : 0.95)).current;
  const opacityAnim = useRef(new Animated.Value(isCompleted ? 1 : 0.4)).current;
  const gradient = CHALLENGE_GRADIENTS[color];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isCompleted ? 1 : 0.95,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isCompleted ? 1 : isFuture ? 0.3 : 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isCompleted, isFuture, scaleAnim, opacityAnim]);

  const handlePress = () => {
    if (isToday && onComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onComplete();
    }
  };

  const tileContent = (
    <Animated.View
      style={[
        styles.calendarTile,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {isCompleted ? (
        <LinearGradient
          colors={[gradient.start, gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.calendarTileGradient}
        >
          <Text style={styles.calendarTileDayCompleted}>{dayNumber}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.calendarTileEmpty,
            isToday && styles.calendarTileToday,
          ]}
        >
          <Text
            style={[
              styles.calendarTileDay,
              isToday && styles.calendarTileDayToday,
            ]}
          >
            {dayNumber}
          </Text>
        </View>
      )}
    </Animated.View>
  );

  // Only today is pressable
  if (isToday && !isCompleted) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {tileContent}
      </TouchableOpacity>
    );
  }

  return tileContent;
}

// ============================================================
// Challenge Calendar Grid
// ============================================================

type ChallengeCalendarGridProps = {
  challenge: Challenge;
  onCompleteToday?: () => void;
};

export function ChallengeCalendarGrid({ challenge, onCompleteToday }: ChallengeCalendarGridProps) {
  const startDate = new Date(challenge.startDate);
  const tiles: React.ReactNode[] = [];

  for (let i = 0; i < challenge.totalDays; i++) {
    const dayNumber = i + 1;
    const tileDate = getDateISO(addDays(startDate, i));
    const isCompleted = challenge.completedDays.includes(tileDate);
    const isPast = isDateInPast(tileDate);
    const isTodayTile = isDateToday(tileDate);
    const isFuture = !isPast && !isTodayTile;

    tiles.push(
      <CalendarDayTile
        key={dayNumber}
        dayNumber={dayNumber}
        date={tileDate}
        isCompleted={isCompleted}
        isToday={isTodayTile}
        isPast={isPast}
        isFuture={isFuture}
        color={challenge.color}
        onComplete={isTodayTile ? onCompleteToday : undefined}
      />
    );
  }

  return (
    <View style={styles.calendarGrid}>
      {tiles}
    </View>
  );
}

// ============================================================
// Challenge Card (Redesigned)
// ============================================================

type ChallengeCardProps = {
  challenge: Challenge;
  dailyStatus: DailyRequirementStatus | null;
  onToggleRequirement: (requirementId: string) => void;
  onCompleteDay: () => void;
  onDelete?: () => void;
};

export function ChallengeCard({
  challenge,
  dailyStatus,
  onToggleRequirement,
  onCompleteDay,
  onDelete,
}: ChallengeCardProps) {
  const gradient = CHALLENGE_GRADIENTS[challenge.color];
  const today = getTodayISO();
  const currentDayNumber = getDayNumber(challenge.startDate, today);
  const completedCount = challenge.completedDays.length;
  const isTodayCompleted = challenge.completedDays.includes(today);

  // Check if all requirements are done for today
  const allRequirementsDone = challenge.requirements.every(
    (req) => dailyStatus?.completedRequirements.includes(req.id)
  );

  // Calculate progress percentage
  const progressPercent = Math.round((completedCount / challenge.totalDays) * 100);

  return (
    <Card style={styles.challengeCard}>
      {/* Header with gradient accent */}
      <View style={styles.challengeHeader}>
        <LinearGradient
          colors={[gradient.start, gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.challengeColorBar}
        />
        <View style={styles.challengeHeaderContent}>
          <View style={styles.challengeTitleRow}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.challengeSubtitle}>
            Day {Math.min(currentDayNumber, challenge.totalDays)} of {challenge.totalDays} • {completedCount} completed
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.challengeProgressContainer}>
        <View style={styles.challengeProgressBar}>
          <LinearGradient
            colors={[gradient.start, gradient.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.challengeProgressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.challengeProgressText}>{progressPercent}%</Text>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarSection}>
        <Text style={styles.sectionLabel}>Progress Calendar</Text>
        <ChallengeCalendarGrid
          challenge={challenge}
          onCompleteToday={allRequirementsDone && !isTodayCompleted ? onCompleteDay : undefined}
        />
      </View>

      {/* Today's Requirements */}
      {!isTodayCompleted && currentDayNumber <= challenge.totalDays && (
        <View style={styles.requirementsSection}>
          <Text style={styles.sectionLabel}>Today&apos;s Requirements</Text>
          {challenge.requirements.map((req) => {
            const isChecked = dailyStatus?.completedRequirements.includes(req.id) ?? false;
            return (
              <TouchableOpacity
                key={req.id}
                style={styles.requirementItem}
                onPress={() => onToggleRequirement(req.id)}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.requirementText, isChecked && styles.requirementTextChecked]}>
                  {req.text}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Complete Day Button */}
          {allRequirementsDone && (
            <TouchableOpacity
              style={styles.completeDayButton}
              onPress={onCompleteDay}
            >
              <LinearGradient
                colors={[gradient.start, gradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completeDayGradient}
              >
                <Text style={styles.completeDayText}>Complete Day {currentDayNumber}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Today Completed Message */}
      {isTodayCompleted && currentDayNumber <= challenge.totalDays && (
        <View style={styles.todayCompletedSection}>
          <Text style={styles.todayCompletedText}>Day {currentDayNumber} Complete</Text>
          <Text style={styles.todayCompletedSubtext}>Come back tomorrow for Day {currentDayNumber + 1}</Text>
        </View>
      )}

      {/* Challenge Complete Message */}
      {completedCount >= challenge.totalDays && (
        <View style={styles.challengeCompleteSection}>
          <Text style={styles.challengeCompleteText}>Challenge Complete!</Text>
          <Text style={styles.challengeCompleteSubtext}>
            You completed all {challenge.totalDays} days
          </Text>
        </View>
      )}
    </Card>
  );
}

// ============================================================
// Challenge Color Picker
// ============================================================

const COLORS: ChallengeColor[] = [
  'ocean', 'ember', 'forest', 'violet',
  'sunset', 'midnight', 'rose', 'slate',
];

type ChallengeColorPickerProps = {
  selectedColor: ChallengeColor;
  onSelectColor: (color: ChallengeColor) => void;
};

export function ChallengeColorPicker({ selectedColor, onSelectColor }: ChallengeColorPickerProps) {
  return (
    <View style={styles.colorPickerContainer}>
      <Text style={styles.inputLabel}>Choose Color</Text>
      <View style={styles.colorGrid}>
        {COLORS.map((color) => {
          const gradient = CHALLENGE_GRADIENTS[color];
          const isSelected = selectedColor === color;

          return (
            <Pressable
              key={color}
              style={[styles.colorOption, isSelected && styles.colorSelected]}
              onPress={() => onSelectColor(color)}
            >
              <LinearGradient
                colors={[gradient.start, gradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.colorSwatch}
              >
                {isSelected && <Text style={styles.colorCheckmark}>✓</Text>}
              </LinearGradient>
              <Text style={[styles.colorName, isSelected && styles.colorNameSelected]}>
                {CHALLENGE_COLOR_NAMES[color]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// Duration Picker
// ============================================================

type DurationPickerProps = {
  selectedDuration: ChallengeDuration;
  onSelectDuration: (duration: ChallengeDuration) => void;
};

export function DurationPicker({ selectedDuration, onSelectDuration }: DurationPickerProps) {
  return (
    <View style={styles.durationPickerContainer}>
      <Text style={styles.inputLabel}>Challenge Duration</Text>
      <View style={styles.durationOptions}>
        {CHALLENGE_DURATIONS.map(({ value, label }) => (
          <Pressable
            key={value}
            style={[
              styles.durationOption,
              selectedDuration === value && styles.durationOptionSelected,
            ]}
            onPress={() => onSelectDuration(value)}
          >
            <Text
              style={[
                styles.durationOptionText,
                selectedDuration === value && styles.durationOptionTextSelected,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// Create Challenge Modal
// ============================================================

type CreateChallengeModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    color: ChallengeColor,
    duration: ChallengeDuration,
    requirements: string[]
  ) => void;
};

export function CreateChallengeModal({ visible, onClose, onCreate }: CreateChallengeModalProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<ChallengeColor>('ocean');
  const [duration, setDuration] = useState<ChallengeDuration>(40);
  const [requirements, setRequirements] = useState<string[]>(['', '', '']);

  const handleCreate = () => {
    if (!title.trim()) return;

    const validRequirements = requirements.filter((r) => r.trim());
    if (validRequirements.length === 0) return;

    onCreate(title.trim(), color, duration, validRequirements);

    // Reset form
    setTitle('');
    setColor('ocean');
    setDuration(40);
    setRequirements(['', '', '']);
    onClose();
  };

  const updateRequirement = (index: number, text: string) => {
    const updated = [...requirements];
    updated[index] = text;
    setRequirements(updated);
  };

  const addRequirement = () => {
    if (requirements.length < 6) {
      setRequirements([...requirements, '']);
    }
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const isValid = title.trim() && requirements.some((r) => r.trim());

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Challenge</Text>
          <TouchableOpacity onPress={handleCreate} disabled={!isValid}>
            <Text style={[styles.modalCreate, !isValid && styles.modalCreateDisabled]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.modalScrollContent}
        >
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Challenge Name</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., 75 Hard Challenge"
              placeholderTextColor={tokens.colors.muted}
            />
          </View>

          {/* Color Picker */}
          <ChallengeColorPicker selectedColor={color} onSelectColor={setColor} />

          {/* Duration Picker */}
          <DurationPicker selectedDuration={duration} onSelectDuration={setDuration} />

          {/* Requirements */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daily Requirements</Text>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirementInputRow}>
                <TextInput
                  style={styles.requirementInput}
                  value={req}
                  onChangeText={(text) => updateRequirement(index, text)}
                  placeholder={`Requirement ${index + 1}`}
                  placeholderTextColor={tokens.colors.muted}
                />
                {requirements.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeRequirement(index)}
                    style={styles.removeRequirementButton}
                  >
                    <Text style={styles.removeRequirementText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {requirements.length < 6 && (
              <TouchableOpacity onPress={addRequirement} style={styles.addRequirementButton}>
                <Text style={styles.addRequirementText}>+ Add Requirement</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ============================================================
// Unified Rules Card (Month Calendar + Check-In)
// ============================================================

import { generateMonthData, isSameDay, formatDateKey } from '@/utils/calendar';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type RulesCardProps = {
  rules: Rule[];
  history: RulesAdherenceHistory;
  checkIn: TodayRulesCheckIn | null;
  onToggleRule: (ruleId: string) => void;
  onCompleteCheckIn: () => void;
};

export function RulesCard({
  rules,
  history,
  checkIn,
  onToggleRule,
  onCompleteCheckIn,
}: RulesCardProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const monthData = React.useMemo(
    () => generateMonthData(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const todayISO = getTodayISO();

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayPress = (dateKey: string, isFuture: boolean) => {
    if (!isFuture) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedDate(dateKey);
    }
  };

  // Get adherence data for selected day
  const selectedAdherence = history[selectedDate];
  const isSelectedToday = selectedDate === todayISO;
  const hasCheckedInToday = checkIn?.hasCheckedIn ?? false;

  // Check-in state for today
  const checkedCount = checkIn?.checkedRules.length ?? 0;
  const allChecked = checkedCount === rules.length && rules.length > 0;

  return (
    <View style={rulesCardStyles.card}>
      {/* Spectrum gradient header - serves as adherence legend */}
      <LinearGradient
        colors={['#10B981', '#84CC16', '#EAB308', '#F97316', '#EF4444']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={rulesCardStyles.gradientHeader}
      >
        <View style={rulesCardStyles.headerRow}>
          <Text style={rulesCardStyles.headerLabel}>100%</Text>
          <Text style={rulesCardStyles.headerTitle}>RULES</Text>
          <Text style={rulesCardStyles.headerLabel}>0%</Text>
        </View>
      </LinearGradient>

      {/* Month navigation */}
      <View style={rulesCardStyles.monthNav}>
        <Pressable onPress={goToPrevMonth} style={rulesCardStyles.navArrow}>
          <Text style={rulesCardStyles.navArrowText}>←</Text>
        </Pressable>
        <Text style={rulesCardStyles.monthTitle}>
          {monthData.monthName} {viewYear !== today.getFullYear() ? viewYear : ''}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          style={[rulesCardStyles.navArrow, isCurrentMonth && rulesCardStyles.navArrowDisabled]}
        >
          <Text style={[rulesCardStyles.navArrowText, isCurrentMonth && rulesCardStyles.navArrowTextDisabled]}>
            →
          </Text>
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={rulesCardStyles.weekdays}>
        {WEEKDAYS.map((day, idx) => (
          <Text key={`${day}-${idx}`} style={rulesCardStyles.weekdayText}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={rulesCardStyles.calendarGrid}>
        {monthData.cells.map((cell, idx) => {
          if (cell.type === 'blank') {
            return <View key={`blank-${idx}`} style={rulesCardStyles.dayCell} />;
          }

          const dateKey = cell.dateKey;
          const isToday = dateKey === todayISO;
          const isPast = dateKey < todayISO;
          const isFuture = dateKey > todayISO;
          const isSelected = dateKey === selectedDate;
          const adherence = history[dateKey];

          // Calculate adherence percentage
          let adherencePercent = -1;
          if (adherence && adherence.totalRules > 0) {
            adherencePercent = Math.round(
              (adherence.followedRules.length / adherence.totalRules) * 100
            );
          }

          // Determine tile style
          const getOpacity = () => {
            if (isFuture) return 0.3;
            if (adherencePercent === 100) return 1;
            if (adherencePercent >= 80) return 0.85;
            if (adherencePercent >= 50) return 0.65;
            if (adherencePercent > 0) return 0.45;
            return 0;
          };

          const showGradient = adherencePercent > 0 && !isFuture;

          return (
            <Pressable
              key={dateKey}
              style={rulesCardStyles.dayCell}
              onPress={() => handleDayPress(dateKey, isFuture)}
              disabled={isFuture}
            >
              <View
                style={[
                  rulesCardStyles.dayTile,
                  isSelected && rulesCardStyles.dayTileSelected,
                  isToday && !isSelected && rulesCardStyles.dayTileToday,
                ]}
              >
                {showGradient ? (
                  <LinearGradient
                    colors={[RULES_GRADIENT.start, RULES_GRADIENT.end]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[rulesCardStyles.dayTileGradient, { opacity: getOpacity() }]}
                  >
                    <Text style={rulesCardStyles.dayTextGradient}>{cell.value}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[rulesCardStyles.dayTileEmpty, isFuture && rulesCardStyles.dayTileFuture]}>
                    <Text
                      style={[
                        rulesCardStyles.dayTextEmpty,
                        isFuture && rulesCardStyles.dayTextFuture,
                        isToday && rulesCardStyles.dayTextToday,
                        isSelected && rulesCardStyles.dayTextSelected,
                      ]}
                    >
                      {cell.value}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Check-in section */}
      {rules.length > 0 && (
        <View style={rulesCardStyles.checkInSection}>
          <View style={rulesCardStyles.checkInHeader}>
            <Text style={rulesCardStyles.checkInTitle}>
              {isSelectedToday ? "Today's Check-In" : formatDateDisplay(selectedDate)}
            </Text>
            {isSelectedToday && hasCheckedInToday && (
              <View style={rulesCardStyles.checkInBadge}>
                <Text style={rulesCardStyles.checkInBadgeText}>Done</Text>
              </View>
            )}
            {isSelectedToday && !hasCheckedInToday && (
              <Text style={rulesCardStyles.checkInProgress}>
                {checkedCount}/{rules.length}
              </Text>
            )}
            {!isSelectedToday && selectedAdherence && (
              <Text style={rulesCardStyles.checkInProgress}>
                {selectedAdherence.followedRules.length}/{selectedAdherence.totalRules}
              </Text>
            )}
          </View>

          {/* Today: editable check-in */}
          {isSelectedToday && !hasCheckedInToday && (
            <>
              <View style={rulesCardStyles.rulesList}>
                {rules.map((rule) => {
                  const isChecked = checkIn?.checkedRules.includes(rule.id) ?? false;
                  return (
                    <TouchableOpacity
                      key={rule.id}
                      style={rulesCardStyles.ruleItem}
                      onPress={() => onToggleRule(rule.id)}
                    >
                      <View style={[rulesCardStyles.ruleCheckbox, isChecked && rulesCardStyles.ruleCheckboxChecked]}>
                        {isChecked && <Text style={rulesCardStyles.ruleCheckmark}>✓</Text>}
                      </View>
                      <Text style={[rulesCardStyles.ruleText, isChecked && rulesCardStyles.ruleTextChecked]}>
                        {rule.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[rulesCardStyles.completeButton, !allChecked && rulesCardStyles.completeButtonDisabled]}
                onPress={onCompleteCheckIn}
                disabled={!allChecked}
              >
                <LinearGradient
                  colors={allChecked ? [RULES_GRADIENT.start, RULES_GRADIENT.end] : [tokens.colors.border, tokens.colors.border]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={rulesCardStyles.completeButtonGradient}
                >
                  <Text style={[rulesCardStyles.completeButtonText, !allChecked && rulesCardStyles.completeButtonTextDisabled]}>
                    Complete Check-In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Today: already checked in - show rules with strikethrough (tappable to undo) */}
          {isSelectedToday && hasCheckedInToday && (
            <>
              <View style={rulesCardStyles.rulesList}>
                {rules.map((rule) => {
                  const wasChecked = checkIn?.checkedRules.includes(rule.id) ?? false;
                  return (
                    <TouchableOpacity
                      key={rule.id}
                      style={rulesCardStyles.ruleItemCompleted}
                      onPress={() => onToggleRule(rule.id)}
                    >
                      <View style={[rulesCardStyles.ruleCheckbox, wasChecked && rulesCardStyles.ruleCheckboxChecked]}>
                        {wasChecked && <Text style={rulesCardStyles.ruleCheckmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          rulesCardStyles.ruleText,
                          wasChecked && rulesCardStyles.ruleTextCompleted,
                          !wasChecked && rulesCardStyles.ruleTextMissed,
                        ]}
                      >
                        {rule.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={rulesCardStyles.completedSubtext}>Tap a rule to undo</Text>
            </>
          )}

          {/* Past day: read-only view */}
          {!isSelectedToday && selectedAdherence && (
            <View style={rulesCardStyles.pastDayView}>
              <Text style={rulesCardStyles.pastDayText}>
                {selectedAdherence.followedRules.length === selectedAdherence.totalRules
                  ? 'Perfect adherence this day'
                  : `${selectedAdherence.followedRules.length} of ${selectedAdherence.totalRules} rules followed`}
              </Text>
            </View>
          )}

          {/* Past day: no data */}
          {!isSelectedToday && !selectedAdherence && (
            <View style={rulesCardStyles.pastDayView}>
              <Text style={rulesCardStyles.pastDayTextEmpty}>No check-in recorded</Text>
            </View>
          )}
        </View>
      )}

      {/* No rules message */}
      {rules.length === 0 && (
        <View style={rulesCardStyles.noRulesMessage}>
          <Text style={rulesCardStyles.noRulesText}>Add rules below to start tracking</Text>
        </View>
      )}
    </View>
  );
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// RulesCard styles
const RULES_DAY_SIZE = (SCREEN_WIDTH - 32 - 16 - 48) / 7; // Account for card padding and gaps

const rulesCardStyles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginHorizontal: 8,
    marginBottom: tokens.spacing.lg,
    overflow: 'hidden',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientHeader: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xs,
  },
  navArrow: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  navArrowText: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  navArrowTextDisabled: {
    color: tokens.colors.muted,
  },
  monthTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  weekdays: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xs,
  },
  weekdayText: {
    width: RULES_DAY_SIZE,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  dayCell: {
    width: RULES_DAY_SIZE,
    height: RULES_DAY_SIZE,
    padding: 2,
  },
  dayTile: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayTileSelected: {
    borderWidth: 2,
    borderColor: tokens.colors.text,
  },
  dayTileToday: {
    borderWidth: 2,
    borderColor: RULES_GRADIENT.start,
  },
  dayTileGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  dayTileEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.border,
    borderRadius: 6,
  },
  dayTileFuture: {
    backgroundColor: tokens.colors.bg,
  },
  dayTextGradient: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayTextEmpty: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  dayTextFuture: {
    color: tokens.colors.border,
  },
  dayTextToday: {
    color: RULES_GRADIENT.start,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: tokens.colors.text,
    fontWeight: '700',
  },
  checkInSection: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  checkInTitle: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
  },
  checkInBadge: {
    backgroundColor: tokens.colors.action,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: tokens.radius.pill,
  },
  checkInBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkInProgress: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    fontWeight: '600',
  },
  rulesList: {
    marginBottom: tokens.spacing.md,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  ruleCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    borderRadius: 6,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleCheckboxChecked: {
    backgroundColor: tokens.colors.action,
    borderColor: tokens.colors.action,
  },
  ruleCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ruleText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  ruleTextChecked: {
    color: tokens.colors.muted,
  },
  ruleItemCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
  },
  ruleTextCompleted: {
    color: tokens.colors.muted,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  ruleTextMissed: {
    color: tokens.colors.danger,
    textDecorationLine: 'line-through',
  },
  completeButton: {
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  completeButtonDisabled: {},
  completeButtonGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  completeButtonText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completeButtonTextDisabled: {
    color: tokens.colors.muted,
  },
  completedMessage: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  completedText: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.action,
  },
  completedSubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
  },
  pastDayView: {
    paddingVertical: tokens.spacing.sm,
  },
  pastDayText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  pastDayTextEmpty: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontStyle: 'italic',
  },
  noRulesMessage: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
  noRulesText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
});

// ============================================================
// Styles
// ============================================================

const TILE_SIZE = (SCREEN_WIDTH - 32 - 36) / 10; // Account for padding and gaps

const styles = StyleSheet.create({
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    padding: 2,
    marginBottom: tokens.spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFirst: {
    borderTopLeftRadius: tokens.radius.sm,
    borderBottomLeftRadius: tokens.radius.sm,
  },
  segmentLast: {
    borderTopRightRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
  segmentActive: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.sm,
  },
  segmentText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  segmentTextActive: {
    color: tokens.colors.text,
  },

  // Adherence Card
  adherenceCard: {
    marginBottom: tokens.spacing.lg,
    overflow: 'hidden',
  },
  rulesColorBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: tokens.spacing.md,
  },
  cardTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  todayProgressSection: {
    marginBottom: tokens.spacing.lg,
  },
  todayProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  todayProgressLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  todayProgressValue: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    fontWeight: '700',
  },
  todayProgressBar: {
    height: 8,
    backgroundColor: tokens.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  todayProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  adherenceStats: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
  },
  adherenceStat: {
    alignItems: 'center',
  },
  adherenceValue: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  adherenceLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Rules Calendar Grid
  rulesCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: tokens.spacing.lg,
  },
  rulesCalendarTile: {
    width: RULES_TILE_SIZE,
    height: RULES_TILE_SIZE,
  },
  rulesCalendarTileToday: {
    borderWidth: 2,
    borderColor: tokens.colors.text,
    borderRadius: 6,
  },
  rulesCalendarTileGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rulesCalendarTileEmpty: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rulesCalendarTileText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rulesCalendarTileTextEmpty: {
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  rulesCalendarTileTextToday: {
    color: tokens.colors.text,
    fontWeight: '700',
  },

  // Check-In Card
  checkInCard: {
    marginBottom: tokens.spacing.lg,
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  checkInTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  checkInSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  checkInBadge: {
    backgroundColor: tokens.colors.action,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
  },
  checkInBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkInRulesList: {
    marginBottom: tokens.spacing.md,
  },
  checkInRuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  checkInRuleText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  checkInRuleTextChecked: {
    color: tokens.colors.muted,
  },
  checkInButton: {
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  checkInButtonDisabled: {},
  checkInButtonGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  checkInButtonText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkInButtonTextDisabled: {
    color: tokens.colors.muted,
  },
  checkInCompleteMessage: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  checkInCompleteText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.action,
    marginBottom: 4,
  },
  checkInCompleteSubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Add Rule Button
  addRuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  addRuleIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text,
    marginRight: tokens.spacing.sm,
  },
  addRuleText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },

  // Rule Item
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  ruleAccentBar: {
    width: 4,
    backgroundColor: '#10B981',
  },
  ruleTitle: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    paddingLeft: tokens.spacing.md,
  },
  deleteIcon: {
    fontSize: 22,
    fontWeight: '400',
    color: tokens.colors.muted,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },

  // Calendar Tile
  calendarTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    marginBottom: 4,
  },
  calendarTileGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTileEmpty: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTileToday: {
    borderWidth: 2,
    borderColor: tokens.colors.text,
  },
  calendarTileDay: {
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  calendarTileDayToday: {
    color: tokens.colors.text,
  },
  calendarTileDayCompleted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarSection: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },

  // Challenge Card
  challengeCard: {
    marginTop: tokens.spacing.lg,
    overflow: 'hidden',
  },
  challengeHeader: {
    marginBottom: tokens.spacing.md,
  },
  challengeColorBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: tokens.spacing.md,
  },
  challengeHeaderContent: {},
  challengeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  challengeTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: tokens.spacing.xs,
    marginLeft: tokens.spacing.sm,
    marginTop: -4,
  },
  deleteButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: tokens.colors.muted,
  },
  challengeSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  challengeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: tokens.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: tokens.spacing.sm,
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengeProgressText: {
    ...tokens.typography.tiny,
    color: tokens.colors.muted,
    width: 36,
    textAlign: 'right',
  },

  // Section Label
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Requirements
  requirementsSection: {
    marginTop: tokens.spacing.sm,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    borderRadius: 6,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.action,
    borderColor: tokens.colors.action,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  requirementText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  requirementTextChecked: {
    color: tokens.colors.muted,
  },

  // Complete Day Button
  completeDayButton: {
    marginTop: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  completeDayGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  completeDayText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Today Completed
  todayCompletedSection: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  todayCompletedText: {
    ...tokens.typography.h2,
    color: tokens.colors.action,
    marginBottom: 4,
  },
  todayCompletedSubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Challenge Complete
  challengeCompleteSection: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  challengeCompleteText: {
    ...tokens.typography.h1,
    color: tokens.colors.action,
    marginBottom: 4,
  },
  challengeCompleteSubtext: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },

  // Color Picker
  colorPickerContainer: {
    marginVertical: tokens.spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  colorOption: {
    alignItems: 'center',
    width: 70,
  },
  colorSelected: {},
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCheckmark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  colorName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  colorNameSelected: {
    color: tokens.colors.text,
    fontWeight: '700',
  },

  // Duration Picker
  durationPickerContainer: {
    marginVertical: tokens.spacing.sm,
  },
  durationOptions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  durationOption: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
  },
  durationOptionSelected: {
    backgroundColor: tokens.colors.text,
  },
  durationOptionText: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  durationOptionTextSelected: {
    color: tokens.colors.card,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  modalCancel: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  modalTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  modalCreate: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.tint,
  },
  modalCreateDisabled: {
    color: tokens.colors.muted,
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    padding: tokens.spacing.md,
    paddingBottom: 100, // Extra padding for keyboard
  },

  // Form Inputs
  inputGroup: {
    marginBottom: tokens.spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  requirementInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  requirementInput: {
    flex: 1,
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  removeRequirementButton: {
    marginLeft: tokens.spacing.sm,
    padding: tokens.spacing.xs,
  },
  removeRequirementText: {
    fontSize: 24,
    fontWeight: '300',
    color: tokens.colors.danger,
  },
  addRequirementButton: {
    paddingVertical: tokens.spacing.sm,
  },
  addRequirementText: {
    ...tokens.typography.body,
    color: tokens.colors.tint,
  },
});
