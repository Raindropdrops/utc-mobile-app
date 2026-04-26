import { memo, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { palette, radii, shadows, spacing, typography } from '../theme/tokens';
import type { ScheduleEvent } from '../types/schedule';
import { formatTimeRange } from '../utils/date';

interface ScheduleCardProps {
  event: ScheduleEvent;
}

const ScheduleCardBase = ({ event }: ScheduleCardProps) => {
  const cardScale = useMemo(() => new Animated.Value(1), []);
  const cardGlow = useMemo(() => new Animated.Value(0), []);

  const eventLabel = event.is_exam ? 'Thi' : 'Học';

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 30,
        bounciness: 3,
      }),
      Animated.timing(cardGlow, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 8,
      }),
      Animated.timing(cardGlow, {
        toValue: 0,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glowOpacity = cardGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: cardScale }] }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.cardGlow, { opacity: glowOpacity }, event.is_exam ? styles.cardGlowExam : null]}
      />
      <Pressable
        accessibilityHint="Chạm để xem nhanh chi tiết buổi học"
        accessibilityLabel={`Sự kiện ${event.name}, ${eventLabel}, ${event.location}`}
        accessibilityRole="button"
        accessibilityState={{ selected: false }}
        id={`event-${event.signature}`}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, event.is_exam && styles.examCard]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, event.is_exam ? styles.typeBadgeExam : styles.typeBadgeStudy]}>
            <Text style={styles.typeBadgeText}>{eventLabel}</Text>
          </View>
          <Text style={styles.timeLabel}>{formatTimeRange(event.start, event.end)}</Text>
        </View>

        <Text numberOfLines={2} style={styles.title}>
          {event.name}
        </Text>

        <View style={styles.locationRow}>
          <AppIcon color={palette.textSecondary} name="spark" size={16} />
          <Text numberOfLines={1} style={styles.locationText}>
            {event.location}
          </Text>
        </View>

        <Text numberOfLines={2} style={styles.descriptionText}>
          {event.description.replace(/\n/g, ' · ')}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const ScheduleCard = memo(ScheduleCardBase);

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: spacing.md,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.accentGlow,
    borderRadius: radii.lg,
    ...shadows.glow,
  },
  cardGlowExam: {
    backgroundColor: 'rgba(242, 140, 72, 0.2)',
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.surfaceOutline,
    backgroundColor: palette.surface,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 132,
    ...shadows.card,
  },
  examCard: {
    borderColor: 'rgba(242, 140, 72, 0.55)',
  },
  cardPressed: {
    borderColor: palette.accentSoft,
    backgroundColor: palette.surfaceMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  typeBadge: {
    minHeight: 30,
    minWidth: 64,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  typeBadgeStudy: {
    backgroundColor: 'rgba(43, 178, 164, 0.18)',
  },
  typeBadgeExam: {
    backgroundColor: 'rgba(242, 140, 72, 0.24)',
  },
  typeBadgeText: {
    color: palette.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    ...typography.label,
  },
  timeLabel: {
    color: palette.textSecondary,
    ...typography.bodySmall,
  },
  title: {
    color: palette.textPrimary,
    ...typography.subtitle,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    flex: 1,
    color: palette.textSecondary,
    ...typography.bodySmall,
  },
  descriptionText: {
    color: palette.textTertiary,
    ...typography.bodySmall,
  },
});
