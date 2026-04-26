import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, radii, spacing, typography } from '../theme/tokens';

const WEB_LAYOUT_A_MAX_WIDTH = 880;
const WEB_DESKTOP_BREAKPOINT = 1040;

export const SettingsScreen = () => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width >= WEB_DESKTOP_BREAKPOINT;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={[styles.card, isWebDesktop ? styles.cardWebDesktop : null]}>
        <Text style={styles.title}>Cài đặt & Release</Text>
        <Text style={styles.body}>
          Phase 4 tập trung polish trải nghiệm iOS và chuẩn bị dữ liệu widget. Các tuỳ chỉnh người dùng sẽ được
          mở rộng ngay sau khi khóa build đầu tiên.
        </Text>

        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>Màu hệ thống</Text>
          <Text style={styles.itemValue}>Đang theo giao diện thiết bị</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>Widget contract</Text>
          <Text style={styles.itemValue}>Đã ánh xạ dữ liệu nền</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>Build iOS cloud</Text>
          <Text style={styles.itemValue}>Sẵn sàng EAS</Text>
        </View>
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
  itemRow: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: palette.backgroundElevated,
    minHeight: 52,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  itemTitle: {
    color: palette.textTertiary,
    ...typography.bodySmall,
  },
  itemValue: {
    color: palette.textPrimary,
    ...typography.headline,
  },
});
