import { INSTRUCTOR_H2_STYLE } from '@/constants/constants';
import { getInstructorClassLists } from '@/lib/apis/serverApis/instructorPostApis';
import { transformToCardData } from '@/utils/apiDataProcessor';
import ClassList from './ClassList';

const ClassSection = async ({ id }: { id: string }) => {
  let classList;
  try {
    const classListsResponse = await getInstructorClassLists(id);

    if (classListsResponse instanceof Error) {
      throw new Error(classListsResponse.message);
    }

    classList = transformToCardData(classListsResponse, {
      id: Number(id),
      nickname: classListsResponse[0]?.lecturer.nickname,
      img: classListsResponse[0]?.lecturer.profileCardImageUrl,
    });
  } catch (error) {
    console.error(error);
    return null;
  }

  return (
    <section
      id="class-section"
      className="flex w-full flex-col items-center pt-20 "
    >
      <div className="w-full px-5 sm:px-0">
        <h2 className={INSTRUCTOR_H2_STYLE}>
          진행중인 강의 {classList.length}개
        </h2>
      </div>
      {classList.length > 0 ? (
        <ClassList classList={classList} />
      ) : (
        <div className="h-60 w-full" />
      )}
    </section>
  );
};

export default ClassSection;
