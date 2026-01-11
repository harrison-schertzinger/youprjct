// Body feature components
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';

// Placeholder for future body components
export function BodyPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Body components coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.lg,
  },
  text: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
});
