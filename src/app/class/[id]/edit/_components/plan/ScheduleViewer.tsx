import { CLASS_EDIT_STYLE } from '@/constants/constants';
import { useClassScheduleStore } from '@/store';
import ScheduleView from '@/components/ScheduleView/ScheduleView';
import { IClassSchedule, IRegularClassSchedule } from '@/types/class';

interface ScheduleViewerProps {
  schedules?: IClassSchedule[];
  regularLectureStatus?: IRegularClassSchedule[];
  maxCapacity: number;
  duration: number;
}

const ScheduleViewer = (props: ScheduleViewerProps) => {
  const { maxCapacity, duration } = props;
  const { finalDates } = useClassScheduleStore();

  return (
    <section className={`${CLASS_EDIT_STYLE.border} py-6`}>
      <h2 className={CLASS_EDIT_STYLE.h2}>
        총 클래스 횟수
        <span className="ml-10">{finalDates?.length}회</span>
      </h2>

      <div className="mt-4 max-w-[40rem]">
        {finalDates && (
          <ScheduleView
            maxCapacity={maxCapacity || 1}
            duration={duration}
            lectureSchedule={finalDates}
          />
        )}
        {/* {regularLectureStatus && (
          <RegularScheduleView
            duration={duration}
            lectureSchedule={regularClassDates || []}
            maxCapacity={maxCapacity || 1}
          />
        )} */}
      </div>
    </section>
  );
};

export default ScheduleViewer;
