import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  value?: 'win' | 'loss' | null;
  onChange: (v: 'win' | 'loss') => void;
};

export function WinLossSlider({ value = null, onChange }: Props) {
  const [internal, setInternal] = useState<'win' | 'loss' | null>(value);

  const current = useMemo(() => value ?? internal, [value, internal]);

  const set = (v: 'win' | 'loss') => {
    if (value === null) setInternal(v);
    onChange?.(v);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Today is a…</Text>

      <View style={styles.pill}>
        <Pressable
          onPress={() => set('win')}
          style={[styles.option, current === 'win' && styles.optionActive]}
        >
          <Text style={[styles.optionText, current === 'win' && styles.optionTextActive]}>
            Win
          </Text>
        </Pressable>

        <Pressable
          onPress={() => set('loss')}
          style={[styles.option, current === 'loss' && styles.optionActive]}
        >
          <Text style={[styles.optionText, current === 'loss' && styles.optionTextActive]}>
            Loss
          </Text>
        </Pressable>
      </View>

      <Text style={styles.helper}>
        Tap one. We’ll use this to power streaks + consistency.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  label: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: tokens.colors.text,
  },
  optionText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  optionTextActive: {
    color: '#fff',
  },
  helper: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginTop: tokens.spacing.xs,
  },
});
