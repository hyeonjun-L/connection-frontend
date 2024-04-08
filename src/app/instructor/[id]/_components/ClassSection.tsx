import { INSTRUCTOR_H2_STYLE } from '@/constants/constants';
import { getInstructorClassLists } from '@/lib/apis/serverApis/instructorPostApis';
import { transformToCardData } from '@/utils/apiDataProcessor';
import ClassList from './ClassList';

const ClassSection = async ({ id }: { id: string }) => {
  const classListsResponse = await getInstructorClassLists(id);

  if (classListsResponse instanceof Error) {
    return '에러표시';
  }

  const classList = transformToCardData(classListsResponse, {
    id: Number(id),
    nickname: classListsResponse[0].lecturer.nickname,
    img: classListsResponse[0].lecturer.profileCardImageUrl,
  });

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
      {classList.length > 0 && <ClassList classList={classList} />}
    </section>
  );
};

export default ClassSection;
