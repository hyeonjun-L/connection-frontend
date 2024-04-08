import { INSTRUCTOR_H2_STYLE } from '@/constants/constants';
import { getLecturerPassList } from '@/lib/apis/serverApis/passApis';

const PassSection = async ({ id }: { id: string }) => {
  const passLists = await getLecturerPassList(id);

  return (
    <section className="mb-14 flex w-full flex-col items-center px-5 pt-20 sm:px-0">
      <div className="w-full">
        <h2 className={INSTRUCTOR_H2_STYLE}>패스권 {passLists.length}개</h2>
      </div>
      {passLists.length > 0 && <div>패스권 연결해주세용</div>}
    </section>
  );
};

export default PassSection;
