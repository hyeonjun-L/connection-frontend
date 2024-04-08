import dynamic from 'next/dynamic';
import TextAreaSection from '@/components/TextArea/TextAreaSection';
import { IClassEditPageData } from '@/types/class';
import { ANNOUNCEMENT, CLASS_OPERATION_PLAN } from '@/constants/constants';

const CustomEditor = dynamic(
  () => import('@/components/TextArea/CustomEditor'),
  {
    ssr: false,
  },
);

const IntroSection = ({ data }: { data: IClassEditPageData }) => {
  const { introduction, curriculum, notification } = data;

  return (
    <>
      {/* 공지사항 */}
      <TextAreaSection
        maxLength={200}
        dataName="notification"
        placeholder={ANNOUNCEMENT}
        defaultValue={notification?.content}
        title="중요 공지사항을 입력해주세요"
      />
      {/* 운영계획 */}
      <TextAreaSection
        maxLength={500}
        dataName="introduction"
        defaultValue={introduction}
        placeholder={CLASS_OPERATION_PLAN}
        title="어떤 클래스를 운영할 계획 인가요?"
        height="h-40"
      />
      {/* 커리큘럼 */}
      <CustomEditor
        title="커리큘럼"
        dataName="curriculum"
        defaultValue={curriculum}
        height="652px"
        maxLength={3000}
        minLength={200}
        requiredMark={false}
      />
    </>
  );
};

export default IntroSection;
