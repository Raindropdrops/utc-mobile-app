import type { GroupedScheduleDay, ScheduleEvent } from '../types/schedule';

const DAY_LABEL = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' });
const DATE_LABEL = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const TIME_LABEL = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const DAY_ORDER_FORMAT = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDayLabel = (isoDate: string): string => {
  const value = new Date(isoDate);
  return DAY_LABEL.format(value);
};

export const formatDateLabel = (isoDate: string): string => {
  const value = new Date(isoDate);
  return DATE_LABEL.format(value);
};

export const formatTimeRange = (startIso: string, endIso: string): string => {
  const start = TIME_LABEL.format(new Date(startIso));
  const end = TIME_LABEL.format(new Date(endIso));
  return `${start} - ${end}`;
};

export const buildDateKey = (isoDate: string): string => DAY_ORDER_FORMAT.format(new Date(isoDate));

export const groupEventsByDay = (events: ScheduleEvent[]): GroupedScheduleDay[] => {
  const sortedEvents = [...events].sort((left, right) => {
    return new Date(left.start).getTime() - new Date(right.start).getTime();
  });

  const groupedByKey = new Map<string, ScheduleEvent[]>();

  for (const event of sortedEvents) {
    const dateKey = buildDateKey(event.start);
    const dayEvents = groupedByKey.get(dateKey);

    if (dayEvents) {
      dayEvents.push(event);
    } else {
      groupedByKey.set(dateKey, [event]);
    }
  }

  return Array.from(groupedByKey.entries()).map(([dateKey, dayEvents]) => {
    const representativeDate = dayEvents[0]?.start ?? new Date().toISOString();

    return {
      dateKey,
      weekdayLabel: formatDayLabel(representativeDate),
      dateLabel: formatDateLabel(representativeDate),
      events: dayEvents,
    };
  });
};
