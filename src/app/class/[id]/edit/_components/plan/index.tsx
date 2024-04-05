import { useEffect } from 'react';
import { Controller, FieldErrors, FieldValues } from 'react-hook-form';
import EditClassRange from './EditClassRange';
import EditDayoff from './EditDayoff';
import EditSchedules from './schedule';
import ScheduleViewer from './ScheduleViewer';
import { IClassEditPageData } from '@/types/class';
import { CLASS_EDIT_STYLE } from '@/constants/constants';
import { useClassScheduleStore } from '@/store';
import {
  formatDateWithHyphens,
  parseHyphenatedDate,
} from '@/utils/dateTimeUtils';

interface PlanSectionProps {
  control: any;
  data: IClassEditPageData;
  errors: FieldErrors<FieldValues>;
}

const PlanSection = (props: PlanSectionProps) => {
  const { control, data, errors } = props;
  const {
    duration,
    startDate,
    endDate,
    reservationDeadline,
    reservationComment,
    schedules,
    holidays,
    daySchedules,
    regularLectureStatus,
    maxCapacity,
  } = data;
  const holidayDates = holidays.map((holiday: string) => new Date(holiday));

  const {
    setClassRange,
    setClassType,
    setClassDuration,
    setClassDates,
    setFinalDate,
  } = useClassScheduleStore();

  useEffect(() => {
    setClassRange({ from: new Date(startDate), to: new Date(endDate) });
    setClassDuration(duration);

    if (schedules) {
      const classDates = schedules.map(
        (schedule) => new Date(schedule.startDateTime),
      );
      setFinalDate(classDates);
      setClassDates([...classDates, ...holidayDates]);
      setClassType('원데이');
    }
    if (regularLectureStatus) {
      const classDates = regularLectureStatus.flatMap((item) =>
        item.regularLectureSchedule.map(
          (schedule) => new Date(schedule.startDateTime),
        ),
      );
      setFinalDate(classDates);
      setClassDates([...classDates, ...holidayDates]);
      setClassType('정기');
    }
  }, []);

  return (
    <>
      <Controller
        name="endDate"
        control={control}
        defaultValue={{
          startDate: formatDateWithHyphens(startDate),
          endDate: formatDateWithHyphens(endDate),
        }}
        rules={{
          required: '전체 클래스 기간',
          validate: ({ _, endDate }) => {
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
            const isValidEndDate = dateFormat.test(endDate);
            const parsedEndDate = parseHyphenatedDate(endDate);

            if (
              !isValidEndDate ||
              !formatDateWithHyphens(parsedEndDate) === endDate
            ) {
              return '올바른 클래스 기간';
            }

            return true;
          },
        }}
        render={({ field }) => (
          <div className={`${CLASS_EDIT_STYLE.border} py-6`}>
            <h2
              id="classRange"
              className={`text-lg font-bold ${
                errors.endDate ? 'animate-vibration text-main-color' : ''
              }`}
            >
              전체 클래스 기간을 설정해주세요 <br />
            </h2>
            {regularLectureStatus && (
              <p className="mb-4 text-sm font-medium text-main-color">
                * 변경이 불가능한 항목입니다.
              </p>
            )}

            <EditClassRange
              isRegularClass={!!regularLectureStatus}
              duration={duration}
              defaultValue={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
            />
          </div>
        )}
      />

      <Controller
        name="schedules"
        control={control}
        defaultValue={schedules}
        render={({ field }) => (
          <div className={`${CLASS_EDIT_STYLE.border} py-6`}>
            <h2 className={CLASS_EDIT_STYLE.h2}>클래스 일정 및 시간</h2>
            <EditSchedules
              onChange={field.onChange}
              defaultValue={{
                schedules: schedules,
                daySchedules: daySchedules,
                regularLectureStatus: regularLectureStatus,
              }}
            />
          </div>
        )}
      />

      <Controller
        name="holidays"
        control={control}
        defaultValue={data.holidays}
        render={({ field }) => (
          <div className={`${CLASS_EDIT_STYLE.border} py-6`}>
            <h2 className={CLASS_EDIT_STYLE.h2}>휴무일이 있나요?</h2>
            <EditDayoff onChange={field.onChange} holidays={holidayDates} />
          </div>
        )}
      />
      {/* 클래스 횟수 */}
      <ScheduleViewer
        duration={duration}
        maxCapacity={maxCapacity || 1}
        schedules={schedules}
        regularLectureStatus={regularLectureStatus}
      />
      {/* 신청 마감 시간 */}
      <Controller
        name="reservationDeadline"
        control={control}
        defaultValue={reservationDeadline}
        rules={{
          required: '신청 마감 시간',
          min: { value: 1, message: '올바른 마감 시간' },
        }}
        render={({ field }) => (
          <div className={`${CLASS_EDIT_STYLE.border} py-6`}>
            <h2
              id="reservationDeadline"
              className={`${CLASS_EDIT_STYLE.h2} ${
                errors.reservationDeadline &&
                'animate-vibration text-main-color'
              }`}
            >
              신청 마감 시간을 설정해주세요
            </h2>
            <div className="ml-1.5 text-sm font-medium text-gray-100">
              <span>수업 시작</span>
              <input
                type="number"
                defaultValue={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                className="mx-1.5 h-8 w-12 rounded-md border border-solid border-gray-500 px-3.5 py-1 focus:outline-sub-color1"
                aria-label="신청 마감 시간"
              />
              <span>시간 전</span>
            </div>
          </div>
        )}
      />
      {/* 예약시 유의사항 */}
      <Controller
        name="reservationComment"
        control={control}
        defaultValue={reservationComment}
        rules={{
          required: '예약 시 유의사항',
        }}
        render={({ field }) => (
          <div className={`${CLASS_EDIT_STYLE.border} py-6`}>
            <h2
              id="reservationComment"
              className={`${CLASS_EDIT_STYLE.h2} ${
                errors.reservationComment && 'animate-vibration text-main-color'
              }`}
            >
              예약시 유의사항
            </h2>
            <textarea
              defaultValue={field.value}
              onChange={field.onChange}
              placeholder={`수강생이 클래스 신청시 예약 화면에서 보여지는 사항입니다. \n클래스를 시작하기 전 숙지해야 할 사항을 적어주세요`}
              className="h-32 w-full resize-none whitespace-pre-wrap break-keep rounded-md border border-solid border-gray-700 p-2"
            />
          </div>
        )}
      />
    </>
  );
};

export default PlanSection;
