import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { IRegularScheduleData } from '@/types/class';

interface IClassScheduleStore {
  classRange?: DateRange;
  setClassRange: (newRange: DateRange | undefined) => void;
  classDuration?: number | undefined;
  setClassDuration: (time: number) => void;
  classType?: string;
  setClassType: (type: string) => void;
  // 휴무일을 포함한 전체 스케쥴
  classDates?: Date[];
  setClassDates: (date: Date[]) => void;
  // 휴무일을 제외한 최종 스케쥴 날짜
  finalDates?: Date[];
  setFinalDate: (date: Date[]) => void;
  // 정기클래스 데이터
  regularClassDates?: IRegularScheduleData[];
  setRegularClassDates: (dates: IRegularScheduleData[]) => void;
}

export const useClassScheduleStore = create<IClassScheduleStore>((set) => ({
  classRange: undefined,
  setClassRange: (newRange) => set({ classRange: newRange }),
  classType: undefined,
  setClassType: (type) => set({ classType: type }),
  classDuration: undefined,
  setClassDuration: (newRange) => set({ classDuration: newRange }),
  classDates: undefined,
  setClassDates: (date) => set({ classDates: date }),
  finalDates: undefined,
  setFinalDate: (date) => set({ finalDates: date }),
  regularClassDates: undefined,
  setRegularClassDates: (date) => set({ regularClassDates: date }),
}));
