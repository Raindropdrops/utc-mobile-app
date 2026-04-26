import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as Haptics from 'expo-haptics';
import { AppState } from 'react-native';

import { scheduleRepository } from '../storage/scheduleRepository';
import type { ScheduleViewModel } from '../types/schedule';
import type { WidgetSnapshot } from '../types/widget';

const AUTO_REFRESH_INTERVAL_MINUTES = 5;
const AUTO_REFRESH_INTERVAL_MS = AUTO_REFRESH_INTERVAL_MINUTES * 60 * 1000;

interface UseScheduleStateResult {
  schedule: ScheduleViewModel | null;
  widgetSnapshot: WidgetSnapshot | null;
  isBootstrapping: boolean;
  isRefreshing: boolean;
  source: 'cache' | 'network' | null;
  errorMessage: string | null;
  autoRefreshMinutes: number;
  refreshSchedule: () => Promise<void>;
}

interface RefreshOptions {
  userInitiated: boolean;
  exposeError: boolean;
}

const toErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

export const useScheduleState = (): UseScheduleStateResult => {
  const [schedule, setSchedule] = useState<ScheduleViewModel | null>(null);
  const [widgetSnapshot, setWidgetSnapshot] = useState<WidgetSnapshot | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [source, setSource] = useState<'cache' | 'network' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const syncInFlightRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const hydrateWidgetSnapshot = useCallback(async () => {
    try {
      const nextWidgetSnapshot = await scheduleRepository.getWidgetSnapshot();

      if (isMountedRef.current) {
        setWidgetSnapshot(nextWidgetSnapshot);
      }
    } catch {
      if (isMountedRef.current) {
        setWidgetSnapshot(null);
      }
    }
  }, []);

  const applySnapshot = useCallback((viewModel: ScheduleViewModel, snapshotSource: 'cache' | 'network') => {
    if (!isMountedRef.current) {
      return;
    }

    setSchedule(viewModel);
    setSource(snapshotSource);
    setErrorMessage(null);
  }, []);

  const runRefresh = useCallback(
    async ({ userInitiated, exposeError }: RefreshOptions): Promise<void> => {
      if (syncInFlightRef.current) {
        return;
      }

      syncInFlightRef.current = true;

      if (userInitiated) {
        setIsRefreshing(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      try {
        const result = await scheduleRepository.refreshSchedule();
        applySnapshot(result.viewModel, result.source);
        await hydrateWidgetSnapshot();

        if (userInitiated) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        if (exposeError && isMountedRef.current) {
          setErrorMessage(toErrorMessage(error, 'Không thể đồng bộ lịch ngay lúc này.'));
        }

        if (userInitiated) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } finally {
        syncInFlightRef.current = false;

        if (userInitiated && isMountedRef.current) {
          setIsRefreshing(false);
        }
      }
    },
    [applySnapshot, hydrateWidgetSnapshot],
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const result = await scheduleRepository.loadInitialSchedule();
        applySnapshot(result.viewModel, result.source);
        await hydrateWidgetSnapshot();
      } catch (error) {
        if (isMountedRef.current) {
          setErrorMessage(toErrorMessage(error, 'Không thể tải lịch học.'));
        }
      } finally {
        if (isMountedRef.current) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();
  }, [applySnapshot, hydrateWidgetSnapshot]);

  useEffect(() => {
    const syncWhenActive = async () => {
      if (AppState.currentState !== 'active') {
        return;
      }

      await runRefresh({ userInitiated: false, exposeError: false });
    };

    const intervalId = setInterval(() => {
      void syncWhenActive();
    }, AUTO_REFRESH_INTERVAL_MS);

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void syncWhenActive();
      }
    });

    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, [runRefresh]);

  const refreshSchedule = useCallback(async () => {
    await runRefresh({ userInitiated: true, exposeError: true });
  }, [runRefresh]);

  return useMemo(
    () => ({
      schedule,
      widgetSnapshot,
      isBootstrapping,
      isRefreshing,
      source,
      errorMessage,
      autoRefreshMinutes: AUTO_REFRESH_INTERVAL_MINUTES,
      refreshSchedule,
    }),
    [errorMessage, isBootstrapping, isRefreshing, refreshSchedule, schedule, source, widgetSnapshot],
  );
};
