export interface WidgetEventDigest {
  signature: string;
  title: string;
  location: string;
  startsAt: string;
  endsAt: string;
  isExam: boolean;
  minutesUntilStart: number;
}

export interface WidgetSnapshot {
  version: number;
  generatedAt: string;
  sourceFingerprint: string;
  nextEvent: WidgetEventDigest | null;
  upcoming: WidgetEventDigest[];
  todayCount: number;
  examCount: number;
}
