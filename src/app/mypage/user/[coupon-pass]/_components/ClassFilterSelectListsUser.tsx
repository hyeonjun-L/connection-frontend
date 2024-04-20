import { useMemo } from 'react';
import { PlusesSVG } from '@/icons/svg';
import { SelectClassType } from '@/types/coupon';

interface ClassFilterSelectListsUserProps {
  listViewCount: number;
  myLectureList: SelectClassType[];
  handleChangeSelectedClass: (selectedOptions: any) => void;
  userClassFilterView: boolean;
  showMoreClassFilter: () => void;
  selectedClass?: string[];
}

const ClassFilterSelectListsUser = ({
  listViewCount,
  myLectureList,
  showMoreClassFilter,
  handleChangeSelectedClass,
  selectedClass,
  userClassFilterView,
}: ClassFilterSelectListsUserProps) => {
  const processSelectedClass = useMemo(
    () => selectedClass?.map((value) => Number(value)),
    [selectedClass],
  );

  const changeSelectedClass = (classId: number) => {
    if (processSelectedClass === undefined) {
      handleChangeSelectedClass([classId]);
      return;
    }

    if (processSelectedClass.length + 1 === myLectureList.length) {
      handleChangeSelectedClass(undefined);
      return;
    }

    if (processSelectedClass.includes(classId)) {
      const filteredClasses = processSelectedClass.filter(
        (value) => value !== classId,
      );

      handleChangeSelectedClass(
        filteredClasses.length > 0 ? filteredClasses : undefined,
      );
      return;
    }

    const updatedClasses = [...processSelectedClass, classId];
    handleChangeSelectedClass(updatedClasses);
  };

  return (
    <ul
      className={`${
        userClassFilterView ? 'flex' : 'hidden'
      } w-full flex-wrap items-center text-sm`}
    >
      {myLectureList.map(
        ({ label, value }, index) =>
          index !== 0 &&
          index < listViewCount && (
            <button
              key={value}
              className={`mb-2 mr-5  ${
                !processSelectedClass ||
                (Array.isArray(processSelectedClass) &&
                  processSelectedClass.includes(Number(value)))
                  ? 'text-sub-color1'
                  : 'text-black'
              }`}
              onClick={() => changeSelectedClass(Number(value))}
            >
              <li className="sm:blok flex w-64 truncate sm:w-auto">#{label}</li>
            </button>
          ),
      )}
      {myLectureList.length > listViewCount && (
        <button
          className="group mb-2 mr-5 flex gap-1 hover:text-sub-color1 sm:text-gray-500 sm:underline"
          onClick={showMoreClassFilter}
        >
          <p className="sm:hidden">+{myLectureList.length - listViewCount}</p>
          더보기
          <div className="hidden h-5 w-5 items-center justify-center rounded-full border border-gray-500 group-hover:border-sub-color1 sm:flex">
            <PlusesSVG className="fill-sub-color1" />
          </div>
        </button>
      )}
    </ul>
  );
};

export default ClassFilterSelectListsUser;
