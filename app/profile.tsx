import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import {
  getSupabaseProfile,
  upsertDisplayName,
  getProfile,
  type SupabaseProfile,
} from '@/lib/repositories/ProfileRepo';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useMembership } from '@/hooks/useMembership';
import type { Profile } from '@/lib/training/types';

export default function ProfileScreen() {
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { isPremium, isLoading: membershipLoading } = useMembership();

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sbProfile, localProf] = await Promise.all([
        getSupabaseProfile(),
        getProfile(),
      ]);
      setSupabaseProfile(sbProfile);
      setLocalProfile(localProf);
      if (sbProfile) {
        setDisplayNameInput(sbProfile.display_name);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleSaveDisplayName = async () => {
    const trimmed = displayNameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      return;
    }

    Keyboard.dismiss();
    setIsSaving(true);
    try {
      const result = await upsertDisplayName(trimmed);
      if (result) {
        setSupabaseProfile(result);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving display name:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = supabaseProfile?.display_name ?? localProfile?.displayName ?? 'Athlete';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const hasSupabaseProfile = supabaseProfile !== null;
  const supabaseAvailable = isSupabaseConfigured();

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
          {/* Avatar */}
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{avatarInitial}</Text>
          </View>

          {/* Display Name */}
          <Text style={styles.name}>{displayName}</Text>

          {/* Streak Info */}
          {localProfile && (
            <Text style={styles.streakText}>
              {localProfile.onAppStreakDays} day streak
            </Text>
          )}

          {/* Pro Membership Card */}
          {!membershipLoading && (
            <Card style={styles.membershipCard}>
              {isPremium ? (
                <>
                  <View style={styles.proHeader}>
                    <Text style={styles.proIcon}>★</Text>
                    <Text style={styles.proTitle}>Pro Member</Text>
                  </View>
                  <Text style={styles.proSubtitle}>
                    Thank you for your support
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/premium')}
                  activeOpacity={0.7}
                >
                  <View style={styles.upgradeHeader}>
                    <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                    <Text style={styles.upgradeArrow}>→</Text>
                  </View>
                  <Text style={styles.upgradeSubtitle}>
                    Unlock all features
                  </Text>
                </TouchableOpacity>
              )}
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tokens.colors.muted} />
            </View>
          )}

          {/* Display Name Setup / Edit Section */}
          {!isLoading && supabaseAvailable && (
            <Card style={styles.profileCard}>
              {!hasSupabaseProfile || isEditing ? (
                <>
                  <Text style={styles.cardTitle}>
                    {hasSupabaseProfile ? 'Edit Display Name' : 'Set Display Name'}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Your name on leaderboards
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={displayNameInput}
                    onChangeText={setDisplayNameInput}
                    placeholder="Enter display name"
                    placeholderTextColor={tokens.colors.muted}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={30}
                    editable={!isSaving}
                  />
                  <View style={styles.buttonRow}>
                    {isEditing && (
                      <PrimaryButton
                        label="Cancel"
                        onPress={() => {
                          setIsEditing(false);
                          setDisplayNameInput(supabaseProfile?.display_name ?? '');
                        }}
                        style={styles.cancelButton}
                      />
                    )}
                    <PrimaryButton
                      label={isSaving ? 'Saving...' : 'Save'}
                      onPress={handleSaveDisplayName}
                      style={isEditing ? { ...styles.saveButton, ...styles.saveButtonSmall } : styles.saveButton}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Display Name</Text>
                  <Text style={styles.displayNameValue}>{supabaseProfile.display_name}</Text>
                  <PrimaryButton
                    label="Edit"
                    onPress={() => setIsEditing(true)}
                    style={styles.editButton}
                  />
                </>
              )}
            </Card>
          )}

          {/* Offline / No Supabase Message */}
          {!isLoading && !supabaseAvailable && (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>
                Connect to set up your profile for leaderboards
              </Text>
            </View>
          )}
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
  streakText: {
    ...tokens.typography.body,
    color: tokens.colors.action,
    marginBottom: tokens.spacing.xl,
  },
  membershipCard: {
    width: '100%',
    marginBottom: tokens.spacing.lg,
  },
  proHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  proIcon: {
    fontSize: 20,
    color: tokens.colors.tint,
    marginRight: tokens.spacing.sm,
  },
  proTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.tint,
  },
  proSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xs,
  },
  upgradeTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  upgradeArrow: {
    fontSize: 20,
    color: tokens.colors.tint,
    fontWeight: '600',
  },
  upgradeSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  loadingContainer: {
    marginTop: tokens.spacing.xl,
  },
  profileCard: {
    width: '100%',
    marginTop: tokens.spacing.lg,
  },
  cardTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  cardSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.md,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
    backgroundColor: tokens.colors.bg,
    marginBottom: tokens.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  saveButton: {
    flex: 1,
  },
  saveButtonSmall: {
    flex: 2,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: tokens.colors.muted,
  },
  displayNameValue: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  editButton: {
    backgroundColor: tokens.colors.muted,
  },
  offlineContainer: {
    marginTop: tokens.spacing.xl * 2,
    paddingHorizontal: tokens.spacing.xl,
  },
  offlineText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
});
