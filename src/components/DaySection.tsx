import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScheduleCard } from './ScheduleCard';
import { palette, radii, spacing, typography } from '../theme/tokens';
import type { GroupedScheduleDay } from '../types/schedule';

interface DaySectionProps {
  section: GroupedScheduleDay;
}

const DaySectionBase = ({ section }: DaySectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.weekdayText}>{section.weekdayLabel}</Text>
        <Text style={styles.dateText}>{section.dateLabel}</Text>
      </View>

      <View style={styles.cardStack}>
        {section.events.map((event) => (
          <ScheduleCard event={event} key={event.signature} />
        ))}
      </View>
    </View>
  );
};

export const DaySection = memo(DaySectionBase);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    backgroundColor: 'rgba(8, 14, 22, 0.45)',
    padding: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  weekdayText: {
    color: palette.textPrimary,
    textTransform: 'capitalize',
    ...typography.subtitle,
  },
  dateText: {
    color: palette.textSecondary,
    ...typography.bodySmall,
  },
  cardStack: {
    gap: spacing.xs,
  },
});
