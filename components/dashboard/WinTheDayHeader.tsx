import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function WinTheDayHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.day}>Today</Text>
      <Text style={styles.status}>Winning the day</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  day: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    opacity: 0.7,
  },
});
