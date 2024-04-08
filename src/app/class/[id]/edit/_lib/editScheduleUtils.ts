import {
  IDaySchedule,
  IRegularClassSchedule,
  IEditScheduleList,
} from '@/types/class';

export const getInitialSchedules = (
  regularSchedule?: IRegularClassSchedule[],
  oneDaySchedule?: IDaySchedule[],
): IEditScheduleList[] => {
  if (regularSchedule) {
    const map = new Map();

    regularSchedule?.map((item) => {
      const days = item.day.join(',');
      const newValue =
        (map.get(days) ? map.get(days) + ', ' : '') + item.dateTime;
      map.set(days, newValue);
    });

    return Array.from(map).map(([days, times]) => {
      const lectures = regularSchedule?.filter(
        (item) => item.day.join(',') === days,
      );

      return {
        day: days.split(','),
        dateTime: times.split(', '),
        totalClass: lectures[0].regularLectureSchedule.length,
      };
    });
  }

  if (oneDaySchedule) {
    return oneDaySchedule.map((schedule) => ({
      day: schedule.day,
      dateTime: schedule.dateTime,
      totalClass: 1,
    }));
  }

  return [];
};
