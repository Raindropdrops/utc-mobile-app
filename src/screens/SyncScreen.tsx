import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useScheduleState } from '../hooks/useScheduleState';
import { palette, radii, spacing, typography } from '../theme/tokens';

const WEB_LAYOUT_A_MAX_WIDTH = 880;
const WEB_DESKTOP_BREAKPOINT = 1040;

export const SyncScreen = () => {
  const { source, errorMessage, autoRefreshMinutes, widgetSnapshot } = useScheduleState();
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width >= WEB_DESKTOP_BREAKPOINT;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={[styles.card, isWebDesktop ? styles.cardWebDesktop : null]}>
        <Text style={styles.title}>Trạng thái đồng bộ</Text>
        <Text style={styles.body}>
          Hệ thống hiện chạy cache-first + tự làm mới nền theo chu kỳ để giữ lịch ổn định khi chuyển app.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nguồn hiện tại</Text>
          <Text style={styles.value}>{source === 'cache' ? 'Cache local' : 'API realtime'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Chu kỳ nền</Text>
          <Text style={styles.value}>{autoRefreshMinutes} phút</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Widget digest</Text>
          <Text style={styles.value}>{widgetSnapshot ? 'Đã tạo snapshot' : 'Chưa có snapshot'}</Text>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: palette.surfaceOutline,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardWebDesktop: {
    width: '100%',
    maxWidth: WEB_LAYOUT_A_MAX_WIDTH,
    alignSelf: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: palette.textPrimary,
    ...typography.title,
  },
  body: {
    color: palette.textSecondary,
    ...typography.body,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: palette.backgroundElevated,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  label: {
    color: palette.textTertiary,
    ...typography.bodySmall,
  },
  value: {
    color: palette.textPrimary,
    ...typography.headline,
  },
  errorText: {
    color: palette.danger,
    ...typography.bodySmall,
  },
});
