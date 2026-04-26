import type { ScheduleEvent, SnapshotData } from '../types/schedule';
import type { WidgetEventDigest, WidgetSnapshot } from '../types/widget';
import { buildDateKey } from './date';

const WIDGET_SNAPSHOT_VERSION = 1;
const MAX_UPCOMING_EVENTS = 4;

const toMinutesUntilStart = (startIso: string, nowMs: number): number => {
  const startMs = new Date(startIso).getTime();
  const diffMs = startMs - nowMs;

  return Math.max(0, Math.round(diffMs / 60000));
};

const toWidgetEventDigest = (event: ScheduleEvent, nowMs: number): WidgetEventDigest => {
  return {
    signature: event.signature,
    title: event.name,
    location: event.location,
    startsAt: event.start,
    endsAt: event.end,
    isExam: event.is_exam,
    minutesUntilStart: toMinutesUntilStart(event.start, nowMs),
  };
};

export const createWidgetSnapshot = (snapshot: SnapshotData, now = new Date()): WidgetSnapshot => {
  const nowMs = now.getTime();
  const nowDateKey = buildDateKey(now.toISOString());

  const orderedUpcoming = [...snapshot.events]
    .filter((event) => new Date(event.end).getTime() >= nowMs)
    .sort((left, right) => new Date(left.start).getTime() - new Date(right.start).getTime());

  const upcomingDigests = orderedUpcoming
    .slice(0, MAX_UPCOMING_EVENTS)
    .map((event) => toWidgetEventDigest(event, nowMs));

  const nextEvent = upcomingDigests[0] ?? null;

  const todayCount = snapshot.events.filter((event) => buildDateKey(event.start) === nowDateKey).length;
  const examCount = snapshot.events.filter((event) => event.is_exam).length;

  return {
    version: WIDGET_SNAPSHOT_VERSION,
    generatedAt: now.toISOString(),
    sourceFingerprint: snapshot.metadata.fingerprint,
    nextEvent,
    upcoming: upcomingDigests,
    todayCount,
    examCount,
  };
};
