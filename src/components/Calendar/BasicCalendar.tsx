'use client';
import { differenceInCalendarMonths, isSameMonth, isSameDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useEffect, useState, memo } from 'react';
import { DayPicker, CaptionProps } from 'react-day-picker';
import { FormattedCaption } from '../../utils/calendarUtils/CalendarCaption';
import {
  getBasicCalendarModifiersClassNames,
  DAY_OFF_ClassNames,
  getBasicCalendarModifiers,
} from '../../utils/calendarUtils/dateUtils';
import 'react-day-picker/dist/style.css';
import '../../styles/calendar.css';

interface ICalendarProps {
  mode: 'preview' | 'filter' | 'dayoff';
  selectableDates?: Date[];
  selectedDates?: Date[];
  // eslint-disable-next-line no-unused-vars
  handleSelected?: (value: Date[]) => void;
}

const BasicCalendar = (props: ICalendarProps) => {
  const { mode, selectableDates = [], selectedDates, handleSelected } = props;
  const [selected, setSelected] = useState<Date[] | undefined>(selectedDates);

  useEffect(() => {
    if (handleSelected && selected) {
      handleSelected(selected);
    }
  }, [selected?.length]);

  useEffect(() => {
    if (selectedDates?.length) {
      setSelected(selectedDates);
    }
  }, [selectedDates]);

  const disabledDays = (date: Date) =>
    !selectedDates?.some((clickableDate) => isSameDay(clickableDate, date));

  const modifiers = getBasicCalendarModifiers(mode, selectableDates);
  const modifiersClassNames = getBasicCalendarModifiersClassNames(mode);
  const classNames = mode === 'dayoff' ? DAY_OFF_ClassNames : undefined;
  const disabled = mode === 'dayoff' ? disabledDays : undefined;
  const defaultMonth = findClosestDate(selectedDates || [], new Date());

  return (
    <DayPicker
      mode={mode === 'preview' ? 'default' : 'multiple'}
      locale={ko}
      showOutsideDays
      selected={selected}
      onSelect={setSelected}
      defaultMonth={defaultMonth}
      disabled={disabled}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={classNames}
      components={{
        Caption: ({ displayMonth }: CaptionProps) =>
          FormattedCaption({
            displayMonth,
          }),
      }}
    />
  );
};

export default memo(BasicCalendar);

const findClosestDate = (selectedDates: Date[], targetDate: Date) => {
  let left = 0;
  let right = selectedDates.length - 1;
  let closest = selectedDates[0];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const currentDate = selectedDates[mid];

    if (isSameMonth(currentDate, targetDate)) {
      return currentDate;
    }

    if (
      Math.abs(differenceInCalendarMonths(currentDate, targetDate)) <
      Math.abs(differenceInCalendarMonths(closest, targetDate))
    ) {
      closest = currentDate;
    }

    if (currentDate < targetDate) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return closest;
};
