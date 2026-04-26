import AsyncStorage from '@react-native-async-storage/async-storage';

import { getScheduleSnapshot } from '../services/api';
import type {
  CachedSchedulePayload,
  ScheduleViewModel,
  SnapshotData,
} from '../types/schedule';
import type { WidgetSnapshot } from '../types/widget';
import { groupEventsByDay } from '../utils/date';
import { createWidgetSnapshot } from '../utils/widget';

const CACHE_KEY = 'utc.schedule.snapshot.v1';
const CACHE_VERSION = 1;
const WIDGET_CACHE_KEY = 'utc.widget.snapshot.v1';

export interface ScheduleLoadResult {
  viewModel: ScheduleViewModel;
  source: 'cache' | 'network';
}

const toViewModel = (snapshot: SnapshotData, isStale: boolean): ScheduleViewModel => {
  return {
    groupedDays: groupEventsByDay(snapshot.events),
    metadata: snapshot.metadata,
    isStale,
    lastSyncedAt: snapshot.metadata.generated_at,
  };
};

const readCachedSnapshot = async (): Promise<CachedSchedulePayload | null> => {
  const rawValue = await AsyncStorage.getItem(CACHE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as CachedSchedulePayload;

    if (parsed.version !== CACHE_VERSION) {
      return null;
    }

    if (!parsed.snapshot || !parsed.snapshot.events || !parsed.snapshot.metadata) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const readWidgetSnapshot = async (): Promise<WidgetSnapshot | null> => {
  const rawValue = await AsyncStorage.getItem(WIDGET_CACHE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as WidgetSnapshot;
  } catch {
    return null;
  }
};

const persistSnapshot = async (snapshot: SnapshotData): Promise<void> => {
  const payload: CachedSchedulePayload = {
    version: CACHE_VERSION,
    cachedAt: new Date().toISOString(),
    snapshot,
  };

  const widgetSnapshot = createWidgetSnapshot(snapshot);

  await Promise.all([
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload)),
    AsyncStorage.setItem(WIDGET_CACHE_KEY, JSON.stringify(widgetSnapshot)),
  ]);
};

export const scheduleRepository = {
  async loadInitialSchedule(): Promise<ScheduleLoadResult> {
    const cachedPayload = await readCachedSnapshot();

    if (cachedPayload) {
      return {
        viewModel: toViewModel(cachedPayload.snapshot, true),
        source: 'cache',
      };
    }

    const liveSnapshot = await getScheduleSnapshot();
    await persistSnapshot(liveSnapshot);

    return {
      viewModel: toViewModel(liveSnapshot, false),
      source: 'network',
    };
  },

  async refreshSchedule(): Promise<ScheduleLoadResult> {
    const liveSnapshot = await getScheduleSnapshot();
    await persistSnapshot(liveSnapshot);

    return {
      viewModel: toViewModel(liveSnapshot, false),
      source: 'network',
    };
  },

  async getWidgetSnapshot(): Promise<WidgetSnapshot | null> {
    return await readWidgetSnapshot();
  },
};
