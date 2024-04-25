import { useState, memo } from 'react';
import { ToggleTriangleSVG } from '@/icons/svg';
import ClassSection from './ClassInfo';
import RecruitSection from './RecruitInfo';
import Accordion from '@/components/Accordion/Accordion';

const InstructorLanding = () => {
  return (
    <>
      <ClassSection />
      <RecruitSection />

      <div className="mx-auto h-56 w-full max-w-4xl space-y-4 whitespace-pre-line break-keep px-10 py-6 sm:h-40">
        <ToggleSection
          label="강사 등록 하는법"
          content="회원가입 및 로그인 👉 오른쪽 상단 프로필 사진 클릭 👉 강사 전환 👉 강사 프로필 등록"
        />

        <ToggleSection
          label="클래스 등록 하는법"
          content="로그인 👉 오른쪽 상단 프로필 사진 클릭 👉 강사 전환 👉 상단에 있는 메뉴 중 ‘클래스 등록' 클릭"
        />
      </div>
    </>
  );
};

export default memo(InstructorLanding);

const ToggleSection = ({
  label,
  content,
}: {
  label: string;
  content: string;
}) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setIsOpened(!isOpened);
        }}
        className="mb-2 flex items-center"
      >
        {isOpened ? (
          <ToggleTriangleSVG className="mr-2 rotate-90 transition-transform duration-[0.3] ease-in-out" />
        ) : (
          <ToggleTriangleSVG className="mr-2" />
        )}
        {label}
      </button>

      <Accordion isOpen={isOpened}>
        <p className="ml-5">{content}</p>
      </Accordion>
    </div>
  );
};
