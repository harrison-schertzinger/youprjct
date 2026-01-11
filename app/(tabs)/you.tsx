import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import { WinTheDayHeader } from '@/components/dashboard/WinTheDayHeader';
import { WinLossSlider } from '@/components/dashboard/WinLossSlider';
import { MonthGrid } from '@/components/dashboard/MonthGrid';


export default function YouScreen() {
  const [morning, setMorning] = useState([false, false, false]);
const [tasks, setTasks] = useState([false, false, false, false]);
const [evening, setEvening] = useState([false, false]);

const [selectedDay, setSelectedDay] = useState(10);
const [winLossByDay, setWinLossByDay] = useState<Record<number, 'win' | 'loss' | null>>({
  10: 'win',
});

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <WinTheDayHeader />

        {/* Calendar Card (placeholder structure) */}
       <Card>
  <MonthGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} />
</Card>

        {/* Streak Row Card */}
        <Card style={{ marginTop: tokens.spacing.md }}>
          <View style={styles.streakRow}>
            <View>
              <Text style={styles.streakLabel}>Days Won</Text>
              <Text style={styles.streakValue}>7</Text>
            </View>
            <View>
              <Text style={styles.streakLabel}>Consistency</Text>
              <Text style={styles.streakValue}>82%</Text>
            </View>
            <View>
              <Text style={styles.streakLabel}>This Week</Text>
              <Text style={styles.streakValue}>5/7</Text>
            </View>
          </View>
        </Card>
<View style={{ marginTop: 12 }}>
  <WinLossSlider
    value={winLossByDay[selectedDay] ?? null}
    onChange={(v) => {
      setWinLossByDay((prev) => ({ ...prev, [selectedDay]: v }));
    }}
  />
</View>

        <SectionHeader title="Daily Routines" />

        {/* Morning */}
        <Card>
          <Text style={styles.blockTitle}>Morning</Text>
          <View style={styles.divider} />
          <ListRow
            title="Prayer"
            checked={morning[0]}
            onToggle={() => setMorning([!morning[0], morning[1], morning[2]])}
          />
          <ListRow
            title="Read"
            checked={morning[1]}
            chipLabel="10 min"
            onToggle={() => setMorning([morning[0], !morning[1], morning[2]])}
          />
          <ListRow
            title="Plan the day"
            checked={morning[2]}
            onToggle={() => setMorning([morning[0], morning[1], !morning[2]])}
          />
        </Card>

        {/* Tasks */}
        <Card style={{ marginTop: tokens.spacing.md }}>
          <Text style={styles.blockTitle}>Tasks</Text>
          <View style={styles.divider} />
          <ListRow
  title="First deep work block"
  checked={tasks[0]}
  onToggle={() => setTasks([!tasks[0], tasks[1], tasks[2], tasks[3]])}
  rightChipText="Goal: Build YouPrjct"
/>

<ListRow
  title="Train"
  checked={tasks[1]}
  onToggle={() => setTasks([tasks[0], !tasks[1], tasks[2], tasks[3]])}
  rightChipText="Body"
/>
          <ListRow
            title="Nutrition"
            checked={tasks[2]}
            onToggle={() => setTasks([tasks[0], tasks[1], !tasks[2], tasks[3]])}
          />
          <ListRow
            title="Reach out to 1 person"
            checked={tasks[3]}
            onToggle={() => setTasks([tasks[0], tasks[1], tasks[2], !tasks[3]])}
          />

          <View style={{ marginTop: tokens.spacing.md }}>
            <PrimaryButton label="Add Task" onPress={() => {}} />
          </View>
        </Card>

        {/* Evening */}
        <Card style={{ marginTop: tokens.spacing.md }}>
          <Text style={styles.blockTitle}>Evening</Text>
          <View style={styles.divider} />
          <ListRow
            title="Reflection"
            checked={evening[0]}
            onToggle={() => setEvening([!evening[0], evening[1]])}
          />
          <ListRow
            title="Plan tomorrow"
            checked={evening[1]}
            onToggle={() => setEvening([evening[0], !evening[1]])}
          />

          <View style={{ marginTop: tokens.spacing.md }}>
            <PrimaryButton label="Win the Day" onPress={() => {}} />
          </View>
        </Card>

        <View style={{ height: tokens.spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: tokens.spacing.xl,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: 6,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
});

