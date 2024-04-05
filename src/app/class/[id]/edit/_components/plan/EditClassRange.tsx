import { isAfter, isSameDay, isValid } from 'date-fns';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, ChangeEventHandler, memo } from 'react';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { toast } from 'react-toastify';
import { useClickAway } from 'react-use';
import { TimeSVG, BasicCalendarSVG } from '@/icons/svg';
import { useClassScheduleStore } from '@/store';
import {
  formatDateWithHyphens,
  parseHyphenatedDate,
} from '@/utils/dateTimeUtils';
import 'react-day-picker/dist/style.css';
import '@/styles/calendar.css';

const RangeCalendar = dynamic(
  () => import('@/components/Calendar/RangeCalendar'),
  {
    ssr: false,
  },
);

/* eslint-disable no-unused-vars */
interface EditClassRangeProps {
  onChange: (value: { startDate: string; endDate: string }) => void;
  defaultValue?: { startDate: string; endDate: string };
  isRegularClass?: boolean;
  duration: number;
}

/* eslint-enable no-unused-vars */
const EditClassRange = (props: EditClassRangeProps) => {
  const {
    defaultValue = { startDate: '', endDate: '' },
    isRegularClass = false,
    duration,
    onChange,
  } = props;
  const fromValue = defaultValue.startDate;
  const [toValue, setToValue] = useState<string>(defaultValue.endDate);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { setClassRange } = useClassScheduleStore();
  const calendarRef = useRef(null);
  const initialEndDateRef = useRef(defaultValue.endDate);

  useEffect(() => {
    if (toValue !== defaultValue.endDate) {
      onChange({ startDate: fromValue, endDate: toValue });
      setClassRange({ from: new Date(fromValue), to: new Date(toValue) });
    }
  }, [toValue, fromValue, defaultValue.endDate, onChange, setClassRange]);

  useClickAway(calendarRef, () => {
    setIsCalendarVisible(false);
  });

  const openCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseHyphenatedDate(e.target.value);

    if (isValid(date)) {
      setToValue(e.target.value);
    }
  };

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    if (!range || !range.to || isRegularClass) return;

    const initEndDate = initialEndDateRef.current;
    if (
      range.to &&
      !(
        isAfter(range.to, new Date(initEndDate)) ||
        isSameDay(range.to, new Date(initEndDate))
      )
    ) {
      toast.error(`${initEndDate} 이후 날짜로 선택할 수 있습니다!`);
      return;
    }

    setToValue(formatDateWithHyphens(range.to));
  };

  return (
    <div className="flex gap-x-4">
      <div ref={calendarRef}>
        <div className="relative flex h-7 w-full max-w-[20rem] items-center rounded-md border border-solid border-gray-500 pl-[0.69rem] text-base text-gray-100">
          <DateInput
            placeholder="시작 날짜"
            value={fromValue}
            openCalendar={openCalendar}
            disabled={true}
          />
          <span className="mx-1"> – </span>
          <DateInput
            placeholder="마지막 날짜"
            value={toValue}
            onChange={handleToChange}
            openCalendar={openCalendar}
            disabled={isRegularClass}
          />
          <span className="mr-2 flex w-full justify-end">
            <BasicCalendarSVG
              onClick={() => setIsCalendarVisible((prev) => !prev)}
              className="flex cursor-pointer fill-sub-color1"
            />
          </span>

          {isCalendarVisible && (
            <div className="absolute left-4 top-3 z-10 flex h-auto -translate-x-4 translate-y-5 rounded-md border border-solid border-gray-500 bg-white px-3 py-4">
              <RangeCalendar
                mode="class"
                selectedRange={{
                  from: new Date(fromValue),
                  to: new Date(toValue),
                }}
                handleRangeSelect={handleRangeSelect}
              />
            </div>
          )}
        </div>
      </div>
      <p className="flex items-center gap-x-2">
        <TimeSVG className="fill-sub-color1" /> {duration}분
      </p>
    </div>
  );
};

export default memo(EditClassRange);

interface IDateInputProps {
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  openCalendar: () => void;
}

const DateInput = ({
  placeholder,
  value,
  onChange,
  openCalendar,
  disabled = false,
}: IDateInputProps) => (
  <input
    disabled={disabled}
    size={10}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onFocus={openCalendar}
    className={`px-1 ${disabled ? 'text-gray-500' : ''}`}
  />
);
