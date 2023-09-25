import { atom } from 'recoil';
import { DateRange } from 'react-day-picker';

export const classRangeState = atom<DateRange | undefined>({
  key: 'classRanges',
  default: undefined,
});

export const classTimeState = atom<number | null>({
  key: 'classTime',
  default: null,
});

export const classDatesState = atom<Date[] | null>({
  key: 'classDates',
  default: null,
});
