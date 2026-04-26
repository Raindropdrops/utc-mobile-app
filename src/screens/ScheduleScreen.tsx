import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';

import { AppIcon } from '../components/AppIcon';
import { DaySection } from '../components/DaySection';
import { useScheduleState } from '../hooks/useScheduleState';
import { palette, radii, shadows, spacing, typography } from '../theme/tokens';
import type { GroupedScheduleDay } from '../types/schedule';

const DAY_SECTION_ESTIMATED_HEIGHT = 240;
const WEB_LAYOUT_A_MAX_WIDTH = 880;
const WEB_DESKTOP_BREAKPOINT = 1040;

const renderDaySection = ({ item }: { item: GroupedScheduleDay }) => {
  return <DaySection section={item} />;
};

const getDaySectionLayout = (_: ArrayLike<GroupedScheduleDay> | null | undefined, index: number) => {
  return {
    length: DAY_SECTION_ESTIMATED_HEIGHT,
    offset: DAY_SECTION_ESTIMATED_HEIGHT * index,
    index,
  };
};

export const ScheduleScreen = () => {
  const {
    schedule,
    widgetSnapshot,
    isBootstrapping,
    isRefreshing,
    source,
    errorMessage,
    autoRefreshMinutes,
    refreshSchedule,
  } = useScheduleState();

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWebDesktop = isWeb && width >= WEB_DESKTOP_BREAKPOINT;

  const listStyle = useMemo(() => [styles.list, isWebDesktop ? styles.listWebDesktop : null], [isWebDesktop]);
  const listContentStyle = useMemo(
    () => [styles.listContent, isWeb ? styles.listContentWeb : null],
    [isWeb],
  );
  const heroPanelStyle = useMemo(
    () => [styles.heroPanel, isWebDesktop ? styles.heroPanelWebDesktop : null],
    [isWebDesktop],
  );

  const keyExtractor = useCallback((item: GroupedScheduleDay) => item.dateKey, []);

  if (isBootstrapping && !schedule) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        <View style={styles.centerState}>
          <ActivityIndicator color={palette.accentStrong} size="large" />
          <Text style={styles.centerTitle}>Đang tải lịch từ UTC Sync</Text>
          <Text style={styles.centerSubtitle}>Chuẩn bị dữ liệu học tập của bạn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!schedule && errorMessage) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        <View style={styles.centerState}>
          <Text style={styles.centerTitle}>Không tải được dữ liệu</Text>
          <Text style={styles.centerSubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            id="button-retry-fetch"
            onPress={() => {
              void refreshSchedule();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        contentContainerStyle={listContentStyle}
        style={listStyle}
        data={schedule?.groupedDays ?? []}
        getItemLayout={getDaySectionLayout}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <View style={styles.centerState}>
            <Text style={styles.centerTitle}>Chưa có lịch nào</Text>
            <Text style={styles.centerSubtitle}>Kéo để đồng bộ dữ liệu mới nhất.</Text>
          </View>
        }
        ListHeaderComponent={
          <LinearGradient
            colors={[palette.gradientStart, palette.gradientMid, palette.gradientEnd]}
            end={{ x: 0.9, y: 0.1 }}
            start={{ x: 0, y: 0.9 }}
            style={heroPanelStyle}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroCopyWrap}>
                <Text style={styles.heroTitle}>UTC Schedule</Text>
                <Text style={styles.heroSubtitle}>iOS-first · Offline Ready · Widget Ready</Text>
              </View>
              <View style={styles.heroIconContainer}>
                <AppIcon color={palette.accentStrong} name="spark" size={20} />
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricPill}>
                <Text style={styles.metricLabel}>Tổng sự kiện</Text>
                <Text style={styles.metricValue}>{schedule?.metadata.total_events ?? 0}</Text>
              </View>
              <View style={styles.metricPill}>
                <Text style={styles.metricLabel}>Học</Text>
                <Text style={styles.metricValue}>{schedule?.metadata.total_study_events ?? 0}</Text>
              </View>
              <View style={styles.metricPill}>
                <Text style={styles.metricLabel}>Thi</Text>
                <Text style={[styles.metricValue, { color: palette.exam }]}> 
                  {schedule?.metadata.total_exam_events ?? 0}
                </Text>
              </View>
            </View>

            <View style={styles.syncInfoRow}>
              <Text style={styles.syncText}>
                {source === 'cache' ? 'Đang hiển thị cache gần nhất' : 'Đã đồng bộ từ API'}
              </Text>
              <Text style={styles.syncText}>
                {new Date(schedule?.lastSyncedAt ?? Date.now()).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <View style={styles.widgetRow}>
              <View style={styles.widgetBadge}>
                <Text style={styles.widgetBadgeText}>
                  Widget: {widgetSnapshot?.nextEvent ? 'Sẵn sàng dữ liệu' : 'Đang chờ snapshot'}
                </Text>
              </View>
              <Text style={styles.widgetInfoText}>
                {widgetSnapshot?.nextEvent
                  ? `Tiếp theo: ${widgetSnapshot.nextEvent.title}`
                  : 'Đồng bộ để tạo digest cho màn hình Home/Lock iOS'}
              </Text>
            </View>

            <Text style={styles.autoSyncText}>Tự làm mới nền mỗi {autoRefreshMinutes} phút khi app active</Text>

            {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}
          </LinearGradient>
        }
        removeClippedSubviews
        renderItem={renderDaySection}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void refreshSchedule();
            }}
            tintColor={palette.accentStrong}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
  },
  listWebDesktop: {
    width: '100%',
    maxWidth: WEB_LAYOUT_A_MAX_WIDTH,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  listContentWeb: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroPanel: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.surfaceOutline,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
    ...shadows.panel,
  },
  heroPanelWebDesktop: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  heroCopyWrap: {
    flex: 1,
    gap: spacing.xxs,
  },
  heroTitle: {
    color: palette.textPrimary,
    ...typography.hero,
  },
  heroSubtitle: {
    color: palette.textSecondary,
    ...typography.body,
  },
  heroIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(43, 178, 164, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.surfaceOutline,
    borderRadius: radii.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(15, 24, 36, 0.8)',
    minHeight: 56,
  },
  metricLabel: {
    color: palette.textTertiary,
    ...typography.caption,
  },
  metricValue: {
    color: palette.textPrimary,
    marginTop: spacing.xs,
    ...typography.subtitle,
  },
  syncInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  syncText: {
    color: palette.textSecondary,
    ...typography.bodySmall,
  },
  widgetRow: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  widgetBadge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(24, 208, 190, 0.4)',
    backgroundColor: 'rgba(24, 208, 190, 0.16)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    minHeight: 30,
    justifyContent: 'center',
  },
  widgetBadgeText: {
    color: palette.textPrimary,
    ...typography.caption,
  },
  widgetInfoText: {
    color: palette.textSecondary,
    ...typography.bodySmall,
  },
  autoSyncText: {
    marginTop: spacing.xs,
    color: palette.textTertiary,
    ...typography.caption,
  },
  inlineError: {
    marginTop: spacing.sm,
    color: palette.danger,
    ...typography.bodySmall,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  centerTitle: {
    color: palette.textPrimary,
    textAlign: 'center',
    ...typography.subtitle,
  },
  centerSubtitle: {
    color: palette.textSecondary,
    textAlign: 'center',
    ...typography.body,
  },
  retryButton: {
    marginTop: spacing.md,
    minHeight: 44,
    minWidth: 132,
    borderRadius: radii.pill,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  retryButtonText: {
    color: palette.textPrimary,
    ...typography.headline,
  },
});

