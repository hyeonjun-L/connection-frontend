import { calculateFinalDates } from '@/utils/scheduleDateUtils';
import {
  IDaySchedule,
  IRegularClassSchedule,
  IRegularScheduleData,
  IClassSchedule,
} from '@/types/class';

export const filteredAddedSchedules = (
  originSchedule: IClassSchedule[],
  newSchedules: IDaySchedule[],
  startDate: string,
  newEndDate: string,
  holidays: Date[],
) => {
  const originDates = originSchedule.map(
    (date) => new Date(date.startDateTime),
  );
  const newSchedulesDates = calculateFinalDates(
    startDate,
    newEndDate,
    newSchedules,
    holidays,
  );

  const datesInclude = (arr: Date[], date: Date) => {
    return arr.some((d) => d.getTime() === date.getTime());
  };

  const filteredNewSchedules = newSchedulesDates.filter(
    (date) => !datesInclude(originDates, date),
  );

  return filteredNewSchedules;
};

export const getNewRegularSchedule = (
  originalSchedules: IRegularClassSchedule[],
  newSchedules: IRegularScheduleData[],
) => {
  const originScheduleSet = new Set(
    originalSchedules.map((item) =>
      JSON.stringify({ day: item.day, dateTime: item.dateTime }),
    ),
  );

  const newScheduleData = newSchedules.filter((item) => {
    return !originScheduleSet.has(
      JSON.stringify({ day: item.day, dateTime: item.dateTime }),
    );
  });

  return newScheduleData;
};
