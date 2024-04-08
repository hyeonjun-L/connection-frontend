import { useMemo, memo } from 'react';
import AddSchedules from './AddSchedules';
import DayClass from './DayClass';
import { getInitialSchedules } from '../../../_lib/editScheduleUtils';
import {
  IRegularClassSchedule,
  IDaySchedule,
  IClassSchedule,
  IEditScheduleList,
  IDayTimeList,
  IRegularScheduleData,
} from '@/types/class';
import { useClassScheduleStore } from '@/store';
import {
  calculateRegularFinalClass,
  calculateFinalDates,
} from '@/utils/scheduleDateUtils';

interface IEditSchedulesProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: Date[] | IDayTimeList[] | IRegularScheduleData[]) => void;
  defaultValue: {
    schedules?: IClassSchedule[];
    daySchedules?: IDaySchedule[];
    regularLectureStatus?: IRegularClassSchedule[];
  };
}

const EditSchedules = (props: IEditSchedulesProps) => {
  const { onChange, defaultValue } = props;
  const { schedules, daySchedules, regularLectureStatus } = defaultValue;
  const { classRange, setRegularClassDates, setClassDates } =
    useClassScheduleStore();
  const isSpecificDayClass = !daySchedules && schedules;
  const initialSchedules = useMemo(
    () => getInitialSchedules(regularLectureStatus, daySchedules),
    [regularLectureStatus, daySchedules],
  );

  const handleUpdateSchedules = (newSchedules: IEditScheduleList[]) => {
    if (!classRange) return;
    const { from, to } = classRange;
    if (regularLectureStatus) {
      const newRegularSchedules = calculateRegularFinalClass(
        from?.toDateString() || '',
        to?.toDateString() || '',
        newSchedules,
        [],
      );
      setRegularClassDates(newRegularSchedules);
      const newRegularScheduleDates = newRegularSchedules.flatMap(
        (schedule) => schedule.startDateTime,
      );

      setClassDates(newRegularScheduleDates);
      onChange(newRegularSchedules);
    }
    if (daySchedules) {
      const newDayClassDates = calculateFinalDates(
        from?.toDateString() || '',
        to?.toDateString() || '',
        newSchedules,
        [],
      );
      setClassDates(newDayClassDates);

      const newDaySchedule = newSchedules.map((item) => {
        const newItem = { ...item };
        delete newItem.totalClass;
        return newItem;
      });
      onChange(newDaySchedule);
    }
  };

  return isSpecificDayClass ? (
    <AddSchedules onChange={onChange} schedules={schedules} />
  ) : (
    <DayClass
      initialSchedules={initialSchedules}
      isRegularClass={!!regularLectureStatus}
      handleUpdateSchedules={handleUpdateSchedules}
    />
  );
};

export default memo(EditSchedules);
