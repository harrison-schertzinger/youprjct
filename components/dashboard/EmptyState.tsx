import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
