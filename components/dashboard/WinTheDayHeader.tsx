import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { tokens } from '@/design/tokens';

export function WinTheDayHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.day}>Today</Text>
        <Text style={styles.status}>Winning the day</Text>
      </View>
      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.avatarButton}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>Y</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  avatarButton: {
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: tokens.colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
});
