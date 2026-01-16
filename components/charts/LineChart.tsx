// LineChart: Whoop-inspired line chart with data points
// Pure View-based rendering (no SVG dependency)

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { tokens } from '@/design/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type DataPoint = {
  label: string;
  value: number;
  color?: string; // Optional color override for this point
};

export type DataSeries = {
  data: DataPoint[];
  color: string;
  label: string;
};

type Props = {
  series: DataSeries[];
  height?: number;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  yAxisMax?: number;
};

const CHART_PADDING_LEFT = 8;
const CHART_PADDING_RIGHT = 8;
const CHART_PADDING_TOP = 12;
const CHART_PADDING_BOTTOM = 24;

export function LineChart({
  series,
  height = 160,
  showValues = true,
  valueFormatter = (v) => String(v),
  yAxisMax,
}: Props) {
  const chartWidth = SCREEN_WIDTH - tokens.spacing.lg * 2 - CHART_PADDING_LEFT - CHART_PADDING_RIGHT - tokens.spacing.md * 2;
  const chartHeight = height - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  // Find max value across all series for scaling
  const allValues = series.flatMap((s) => s.data.map((d) => d.value));
  const maxValue = yAxisMax ?? Math.max(...allValues, 1);

  // Get x-axis labels from first series
  const labels = series[0]?.data.map((d) => d.label) ?? [];
  const pointCount = labels.length;

  if (pointCount === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noData}>No data</Text>
      </View>
    );
  }

  const xStep = chartWidth / Math.max(pointCount - 1, 1);

  // Convert data point to position
  const getX = (index: number) => CHART_PADDING_LEFT + index * xStep;
  const getY = (value: number) =>
    CHART_PADDING_TOP + chartHeight - (value / maxValue) * chartHeight;

  // Generate line segments between points
  const renderLineSegments = (data: DataPoint[], color: string) => {
    const segments = [];
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i].value);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1].value);

      // Calculate length and angle
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      segments.push(
        <View
          key={`line-${i}`}
          style={[
            styles.lineSegment,
            {
              left: x1,
              top: y1,
              width: length,
              backgroundColor: color,
              transform: [{ rotate: `${angle}deg` }],
            },
          ]}
        />
      );
    }
    return segments;
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => (
          <View
            key={`grid-${i}`}
            style={[
              styles.gridLine,
              {
                top: CHART_PADDING_TOP + chartHeight * (1 - ratio),
                left: CHART_PADDING_LEFT,
                width: chartWidth,
              },
            ]}
          />
        ))}

        {/* Lines and points for each series */}
        {series.map((s, seriesIndex) => (
          <View key={seriesIndex} style={StyleSheet.absoluteFill}>
            {/* Line segments */}
            {renderLineSegments(s.data, s.color)}

            {/* Points */}
            {s.data.map((point, pointIndex) => (
              <View
                key={`point-${pointIndex}`}
                style={[
                  styles.point,
                  {
                    left: getX(pointIndex) - 5,
                    top: getY(point.value) - 5,
                    backgroundColor: point.color ?? s.color,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxisContainer}>
        {labels.map((label, index) => (
          <Text
            key={index}
            style={[
              styles.xAxisLabel,
              {
                left: getX(index) - 20,
                width: 40,
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  noData: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: tokens.colors.border,
    opacity: 0.3,
  },
  lineSegment: {
    position: 'absolute',
    height: 2.5,
    borderRadius: 1.25,
    transformOrigin: 'left center',
  },
  point: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: tokens.colors.card,
  },
  xAxisContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CHART_PADDING_BOTTOM,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
    textAlign: 'center',
    top: 4,
  },
});
