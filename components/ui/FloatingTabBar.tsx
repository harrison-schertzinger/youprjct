// FloatingTabBar: Premium floating dock-style navigation
// Apple-inspired design with prominent center home button

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
const TAB_BAR_HEIGHT = 72;
const TAB_BAR_MARGIN = 16;
const TAB_BAR_WIDTH = Math.min(SCREEN_WIDTH - TAB_BAR_MARGIN * 2, 400);

// Icon sizes
const ICON_SIZE_REGULAR = 28;
const ICON_SIZE_CENTER = 44;

// Routes to hide from tab bar
const HIDDEN_ROUTES = ['index', 'explore'];

// Center tab name (home button)
const CENTER_TAB = 'you';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Filter out hidden tabs by route name
  const visibleRoutes = state.routes.filter(
    (route) => !HIDDEN_ROUTES.includes(route.name)
  );

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
          const isCenter = route.name === CENTER_TAB;

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

          // Get the icon - pass larger size for center tab
          const iconSize = isCenter ? ICON_SIZE_CENTER : ICON_SIZE_REGULAR;
          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? tokens.colors.text : tokens.colors.muted,
            size: iconSize,
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
              <View
                style={[
                  styles.iconContainer,
                  isCenter && styles.iconContainerCenter,
                  isFocused && !isCenter && styles.iconContainerActive,
                ]}
              >
                {icon}
              </View>
              {isFocused && !isCenter && <View style={styles.activeIndicator} />}
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // Premium shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 12,
      },
    }),
    // Subtle border for definition
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.bg,
    marginTop: -12, // Raise the center button
    // Add subtle shadow to center button
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainerActive: {
    backgroundColor: tokens.colors.bg,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.text,
  },
});
