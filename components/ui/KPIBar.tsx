// KPIBar: Unified stat display bar for page headers
// Shows 3 key metrics in a consistent, premium format

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { tokens } from '@/design/tokens';

export type KPIStat = {
  label: string;
  value: string | number;
  color?: string;
};

type Props = {
  stats: [KPIStat, KPIStat, KPIStat];
};

export function KPIBar({ stats }: Props) {
  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <View style={styles.statBlock}>
              <Text style={styles.label}>{stat.label}</Text>
              <Text style={[styles.value, stat.color ? { color: stat.color } : null]}>
                {stat.value}
              </Text>
            </View>
            {index < 2 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: tokens.colors.border,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: tokens.colors.text,
  },
});
