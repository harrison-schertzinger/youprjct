import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

type Props = {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export function SegmentedControl({ segments, selectedIndex, onChange }: Props) {
  const [segmentWidth, setSegmentWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Animate pill position when selectedIndex changes
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [selectedIndex, segmentWidth, translateX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const newSegmentWidth = (width - 4) / segments.length; // Account for container padding
    setSegmentWidth(newSegmentWidth);
    // Set initial position without animation
    translateX.setValue(selectedIndex * newSegmentWidth);
  };

  const handlePress = (index: number) => {
    if (index !== selectedIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(index);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Animated pill background */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: segmentWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {/* Segment labels */}
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          style={styles.segment}
          onPress={() => handlePress(index)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && styles.segmentTextActive,
            ]}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    padding: 2,
    marginBottom: tokens.spacing.lg,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: 2,
    left: 2,
    bottom: 2,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md - 2,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: tokens.spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  segmentTextActive: {
    color: tokens.colors.text,
    fontWeight: '700',
  },
});
