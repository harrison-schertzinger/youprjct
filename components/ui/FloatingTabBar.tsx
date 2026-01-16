// FloatingTabBar: Premium floating dock-style navigation
// Apple-inspired design with pill shape and subtle backdrop

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab bar dimensions
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_MARGIN = 16;
const TAB_BAR_WIDTH = Math.min(SCREEN_WIDTH - TAB_BAR_MARGIN * 2, 360);

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Filter out hidden tabs (those with href: null)
  // Note: href is an Expo Router-specific option not in base types
  const visibleRoutes = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    const expoOptions = options as { href?: string | null };
    return expoOptions.href !== null;
  });

  return (
    <View
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, TAB_BAR_MARGIN) },
      ]}
    >
      <View style={styles.tabBar}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index].key === route.key;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get the icon from options
          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? tokens.colors.text : tokens.colors.muted,
            size: 24,
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                {icon}
              </View>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  tabBar: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: tokens.colors.card,
    borderRadius: TAB_BAR_HEIGHT / 2,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    // Premium shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
    }),
    // Subtle border for definition
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: tokens.colors.bg,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.text,
  },
});
