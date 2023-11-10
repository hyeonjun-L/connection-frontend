import { create } from 'zustand';
import { formatDate, resRegions } from '@/utils/apiDataProcessor';
import { IGetClassDraft, IprocessedDraft } from '@/types/class';

interface IUseClassCreateStore {
  classData: IprocessedDraft | null;
  setClassData: (data: IGetClassDraft | null) => void;
}

export const useClassCreateStore = create<IUseClassCreateStore>()((set) => ({
  classData: null,
  setClassData: (data: IGetClassDraft | null) =>
    set({ classData: data ? dataProcess(data) : data }),
}));

const dataProcess = (data: IGetClassDraft) => {
  const {
    temporaryLectureToDanceGenre,
    isGroup,
    maxCapacity,
    minCapacity,
    difficultyLevel,
    lectureMethod,
    temporaryLecturenotification,
    startDate,
    endDate,
    temporaryLectureHoliday,
    reservationDeadline,
    temporaryLectureToRegion,
  } = data.temporaryLecture;

  const genres = temporaryLectureToDanceGenre.map(
    (item) => item.danceCategory.genre,
  );

  const newDifficultyLevel =
    difficultyLevel === '상'
      ? '상급'
      : difficultyLevel === '중'
      ? '중급'
      : difficultyLevel === '하'
      ? '초급(입문)'
      : null;

  const newlectureMethod =
    lectureMethod?.name === '원데이'
      ? '원데이 레슨'
      : lectureMethod?.name === '정기'
      ? '정기클래스'
      : null;

  const lessonType =
    isGroup === null ? null : isGroup ? '그룹레슨' : '개인(1:1)레슨';

  const classSize = {
    max: maxCapacity ?? 100,
    min: minCapacity ?? 1,
  };

  const notification = temporaryLecturenotification?.notification;

  const newStartDate = startDate === null ? '' : formatDate(startDate);

  const newEndDate = endDate === null ? '' : formatDate(endDate);

  const holidays = temporaryLectureHoliday.map(
    ({ holiday }) => new Date(holiday),
  );

  const newReservationDeadline = Number(reservationDeadline);

  const regions = resRegions(
    temporaryLectureToRegion.map(({ region }) => region),
  );

  return {
    ...data.temporaryLecture,
    temporaryLectureToDanceGenre: genres,
    difficultyLevel: newDifficultyLevel,
    lectureMethod: newlectureMethod,
    lessonType,
    notification,
    classRange: {
      startDate: newStartDate,
      endDate: newEndDate,
    },
    holidays,
    reservationDeadline: newReservationDeadline,
    regions,
    classSize,
    location: {
      roadAddr: data.location?.address,
      bdNm: data.location?.buildingName,
      detailAddress: data.location?.detailAddress,
    },
    temporaryLectureDateSchedule: data.temporaryLectureDateSchedule
      ? [...data.temporaryLectureDateSchedule]
      : [],
  };
};
