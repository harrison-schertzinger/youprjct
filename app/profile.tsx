import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { tokens } from '@/design/tokens';

export default function ProfileScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>Y</Text>
          </View>
          <Text style={styles.name}>You</Text>
          <Text style={styles.email}>you@example.com</Text>

          <View style={styles.placeholderSection}>
            <Text style={styles.placeholderText}>Profile settings coming soon</Text>
          </View>
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: tokens.spacing.xl * 2,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  avatarTextLarge: {
    color: tokens.colors.card,
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  email: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xl,
  },
  placeholderSection: {
    marginTop: tokens.spacing.xl * 2,
    padding: tokens.spacing.xl,
  },
  placeholderText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
});
