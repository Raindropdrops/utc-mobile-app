export interface ScheduleEvent {
  name: string;
  start: string;
  end: string;
  location: string;
  description: string;
  alarm_minutes: number;
  is_exam: boolean;
  signature: string;
}

export interface SnapshotMetadata {
  generated_at: string;
  from_date: string;
  to_date: string;
  total_events: number;
  total_study_events: number;
  total_exam_events: number;
  weeks_scanned: number;
  fingerprint: string;
  source: string;
}

export interface SnapshotData {
  metadata: SnapshotMetadata;
  events: ScheduleEvent[];
}

export interface ScheduleSnapshotResponse {
  success: boolean;
  data: SnapshotData;
  error?: {
    code: string;
    message: string;
    details?: string;
  } | null;
}

export interface GroupedScheduleDay {
  dateKey: string;
  weekdayLabel: string;
  dateLabel: string;
  events: ScheduleEvent[];
}

export interface ScheduleViewModel {
  groupedDays: GroupedScheduleDay[];
  metadata: SnapshotMetadata;
  isStale: boolean;
  lastSyncedAt: string;
}

export interface CachedSchedulePayload {
  version: number;
  cachedAt: string;
  snapshot: SnapshotData;
}
