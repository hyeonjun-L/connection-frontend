import { eachDayOfInterval, getDay } from 'date-fns';
import dynamic from 'next/dynamic';
import { useState, useMemo, useCallback, useRef, memo } from 'react';
import { toast } from 'react-toastify';
import { day, IEditScheduleList } from '@/types/class';
import { FILTER_WEEK } from '@/constants/constants';
import { useClassScheduleStore } from '@/store';
import {
  calculateRegularFinalClass,
  calculateFinalDates,
} from '@/utils/scheduleDateUtils';

const TimeList = dynamic(() => import('./TimeList'), {
  ssr: false,
});

interface DayClassProps {
  initialSchedules: IEditScheduleList[];
  isRegularClass: boolean;
  // eslint-disable-next-line no-unused-vars
  handleUpdateSchedules: (value: IEditScheduleList[]) => void;
}

const DayClass = (props: DayClassProps) => {
  const { initialSchedules, isRegularClass, handleUpdateSchedules } = props;
  const initialScheduleRef = useRef<IEditScheduleList[]>(initialSchedules);
  const [IDayTimeLists, setIDayTimeLists] =
    useState<IEditScheduleList[]>(initialSchedules);
  const initialCount = Array.from({ length: initialSchedules.length }, () => 0);
  const [selectedDaysCountList, setSelectedDaysCountList] =
    useState<number[]>(initialCount);

  const isEveryListHasDay = IDayTimeLists.every((list) => list.day.length > 0);
  const allSelectedDays = useMemo(
    () => IDayTimeLists.flatMap((list) => list.day),
    [IDayTimeLists],
  );

  const { classRange, classDuration, setClassDates, setRegularClassDates } =
    useClassScheduleStore();

  const updateClassDates = useCallback(
    (newClassLists: IEditScheduleList[]) => {
      if (!classRange || !classRange.from || !classRange.to) return;
      const startDate = classRange.from.toDateString();
      const endDate = classRange.to.toDateString();

      if (isRegularClass) {
        const regularClassDates = calculateRegularFinalClass(
          startDate,
          endDate,
          newClassLists,
          [],
        );
        setRegularClassDates(regularClassDates);

        const classDates = regularClassDates.flatMap(
          (list) => list.startDateTime,
        );
        setClassDates(classDates);
      } else {
        const classDates = calculateFinalDates(
          startDate,
          endDate,
          newClassLists,
          [],
        );
        setClassDates(classDates);
      }

      handleUpdateSchedules(newClassLists);
    },
    [
      classRange,
      isRegularClass,
      setRegularClassDates,
      setClassDates,
      handleUpdateSchedules,
    ],
  );

  const toggleDaySelection = useCallback(
    (day: string, listIndex: number) => {
      const newIDayTimeLists = [...IDayTimeLists];
      const prevValue = newIDayTimeLists[listIndex];

      newIDayTimeLists[listIndex] = {
        ...prevValue,
        day: prevValue.day.includes(day as day)
          ? prevValue.day.filter((d) => d !== (day as day))
          : [...prevValue.day, day as day],
      };
      setIDayTimeLists(newIDayTimeLists);
      updateClassDates(newIDayTimeLists);

      if (isRegularClass) {
        // 정기 클래스에서만 - 해당 요일에 맞는 날짜 개수 설정
        if (!classRange || !classRange.from || !classRange.to) return;

        const allDatesInRange = eachDayOfInterval({
          start: classRange.from,
          end: classRange.to,
        });

        const filteredDates = allDatesInRange.filter((date) => {
          const dayIndex = (getDay(date) + 6) % 7;
          const dayName = FILTER_WEEK[dayIndex];

          return newIDayTimeLists[listIndex].day.includes(dayName);
        });

        const newSelectedDaysCountList = [...selectedDaysCountList];
        newSelectedDaysCountList[listIndex] = filteredDates.length;
        setSelectedDaysCountList(newSelectedDaysCountList);
      }
    },
    [
      updateClassDates,
      classRange,
      IDayTimeLists,
      selectedDaysCountList,
      isRegularClass,
    ],
  );

  const handleDayClick = (day: day, listIndex: number) => {
    const dayIncludedInBothLists = !(
      allSelectedDays.includes(day) &&
      !IDayTimeLists[listIndex].day.includes(day)
    );
    if (dayIncludedInBothLists) {
      toggleDaySelection(day, listIndex);
    }
  };

  const addNewDayList = () => {
    if (IDayTimeLists.length < 7) {
      const newIDayTimeLists = [...IDayTimeLists, { day: [], dateTime: [''] }];
      setIDayTimeLists(newIDayTimeLists);
    } else {
      toast.error('모든 요일이 이미 선택되었습니다.');
    }
  };

  const updatestartDateTime = useCallback(
    (listIndex: number, timeSlotIndex: number, newStartTime: string) => {
      const newIDayTimeLists = [...IDayTimeLists];
      const prevValue = newIDayTimeLists[listIndex];

      newIDayTimeLists[listIndex] = {
        ...prevValue,
        dateTime: prevValue.dateTime.map((timeSlot, i) =>
          i === timeSlotIndex ? newStartTime : timeSlot,
        ),
      };
      setIDayTimeLists(newIDayTimeLists);
      updateClassDates(newIDayTimeLists);
    },
    [IDayTimeLists, updateClassDates],
  );

  const updateTimeSlots = useCallback(
    (listIndex: number, newTimeSlots: string[]) => {
      const newIDayTimeLists = [...IDayTimeLists];

      if (newTimeSlots.length === 0) {
        newIDayTimeLists.splice(listIndex, 1);
      } else {
        newIDayTimeLists[listIndex] = {
          ...newIDayTimeLists[listIndex],
          dateTime: newTimeSlots,
        };
      }

      setIDayTimeLists(newIDayTimeLists);
      updateClassDates(newIDayTimeLists);
    },
    [IDayTimeLists, updateClassDates],
  );

  const addNewTimeSlot = (listIndex: number) => {
    const newTimeSlot = '';
    const updatedTimeSlots = [
      ...IDayTimeLists[listIndex].dateTime,
      newTimeSlot,
    ];

    updateTimeSlots(listIndex, updatedTimeSlots);
  };

  const removeTimeSlot = useCallback(
    (listIndex: number, timeSlotIndex: number) => {
      const updatedTimeSlots = IDayTimeLists[listIndex].dateTime.filter(
        (_, i) => i !== timeSlotIndex,
      );

      if (listIndex !== 0 && updatedTimeSlots.length === 0) {
        const newIDayTimeLists = IDayTimeLists.filter(
          (_, index) => index !== listIndex,
        );
        setIDayTimeLists(newIDayTimeLists);

        if (isRegularClass) {
          const newSelectedDaysCountList = [...selectedDaysCountList];
          newSelectedDaysCountList[listIndex] = 0;
          setSelectedDaysCountList(newSelectedDaysCountList);
        }
      }

      updateTimeSlots(listIndex, updatedTimeSlots);
    },
    [IDayTimeLists, selectedDaysCountList, isRegularClass, updateTimeSlots],
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        {IDayTimeLists.map((list, listIndex) => (
          <div
            key={listIndex}
            className="flex w-full flex-col justify-between md:flex-row"
          >
            <div
              className={`flex w-fit flex-col gap-3 ${
                isRegularClass && 'md:mb-8'
              }`}
            >
              {isRegularClass && (
                <div className="flex h-7 items-center gap-3.5 text-lg font-medium">
                  <span>{list.day.join('')}</span>
                  {list.totalClass ? (
                    <span className="text-sub-color1">{list.totalClass}회</span>
                  ) : (
                    selectedDaysCountList[listIndex] > 0 && (
                      <span className="text-sub-color1">
                        {selectedDaysCountList[listIndex]}회
                      </span>
                    )
                  )}
                </div>
              )}
              <ul key={listIndex} className="flex gap-3">
                {FILTER_WEEK.map((day) => (
                  <li
                    key={listIndex + day}
                    onClick={
                      list.totalClass
                        ? undefined
                        : () => handleDayClick(day, listIndex)
                    }
                    className={getDayStyle(allSelectedDays, day, list)}
                  >
                    {day}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`mt-2.5 flex flex-col ${
                isRegularClass ? 'md:mt-8' : 'md:mt-0'
              }`}
            >
              <ul className="flex flex-col gap-2">
                {list.dateTime.map((timeSlot, timeSlotIndex) => (
                  <TimeList
                    key={timeSlotIndex + timeSlot}
                    duration={classDuration || 0}
                    startTime={{
                      time: timeSlot,
                      editable: (() => {
                        if (
                          list.totalClass &&
                          timeSlotIndex >=
                            initialScheduleRef.current[listIndex].dateTime
                              .length
                        ) {
                          return true;
                        }
                        return !list.totalClass;
                      })(),
                    }}
                    onChange={(newStartTime) =>
                      updatestartDateTime(
                        listIndex,
                        timeSlotIndex,
                        newStartTime,
                      )
                    }
                    onRemove={() => removeTimeSlot(listIndex, timeSlotIndex)}
                  />
                ))}
              </ul>

              <button
                onClick={() => addNewTimeSlot(listIndex)}
                className="mt-2 flex w-full justify-end whitespace-nowrap text-sm font-bold text-gray-500"
              >
                + 시간 추가
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={
          !isEveryListHasDay || FILTER_WEEK.length === allSelectedDays.length
        }
        onClick={addNewDayList}
        className={getButtonClass(isEveryListHasDay, allSelectedDays)}
        aria-disabled={FILTER_WEEK.length === allSelectedDays.length}
      >
        {isRegularClass ? '+ 새로운 일정 추가' : '+ 요일 추가'}
      </button>
    </>
  );
};

export default memo(DayClass);

const getButtonClass = (
  isEveryListHasDay: boolean,
  allSelectedDays: string[],
) => {
  const baseClass =
    'mt-3.5 flex h-10 w-full items-center justify-center rounded-md text-lg font-semibold shadow-float';

  const isDisabled =
    !isEveryListHasDay || FILTER_WEEK.length === allSelectedDays.length;
  const colorClass = isDisabled ? 'text-gray-500' : 'black';

  return `${baseClass} ${colorClass}`;
};

const getDayStyle = (
  allSelectedDays: day[],
  day: string,
  list: IEditScheduleList,
) => {
  const baseClass =
    'flex h-[34px] w-[34px] items-center justify-center rounded-full border border-solid text-sm text-gray-500';
  const isDaySelected = list.day.includes(day as day);
  const isClickable = !allSelectedDays.includes(day as day) || isDaySelected;

  const cursorStyle =
    isClickable && !list.totalClass ? 'cursor-pointer' : 'cursor-not-allowed';
  const textStyle = isDaySelected ? 'font-bold text-white' : 'font-medium';
  const backgroundColor = isDaySelected ? 'bg-sub-color1' : '';

  return `${baseClass} ${cursorStyle} ${textStyle} ${backgroundColor}`;
};
