import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function TodayScoreCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isDark ? '#121212' : '#F2F2F2' },
      ]}
    >
      <Text style={styles.label}>Days Won</Text>
      <Text style={styles.value}>7</Text>
      <Text style={styles.subtext}>Current streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 6,
  },
  value: {
    fontSize: 36,
    fontWeight: '800',
  },
  subtext: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.6,
  },
});
