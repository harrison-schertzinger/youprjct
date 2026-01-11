import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function ScreenShell({ title, subtitle = 'Screen is live ✅', children }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const text = isDark ? '#FFFFFF' : Colors.light.text;
  const sub = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: sub }]}>{subtitle}</Text>

        {children ? <View style={styles.body}>{children}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 120,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    width: '100%',
    marginTop: 28,
  },
});