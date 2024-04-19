import { Suspense } from 'react';
import { getInstructor } from '@/lib/apis/serverApis/instructorPostApis';
import ClassSection from './_components/ClassSection';
import ClassSectionLoading from './_components/loading/ClassSectionLoading';
import PassSectionLoading from './_components/loading/PassSectionLoading';
import ProfileSectionLoading from './_components/loading/ProfileSectionLoading';
import ReviewSectionLoading from './_components/loading/ReviewSectionLoading';
import PassSection from './_components/PassSection';
import ProfileSection from './_components/ProfileSection';
import ReviewSection from '@/components/uis/ReviewSection/ReviewSection';
import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const { id } = params;
  const profile = await getInstructor(id);

  if (profile instanceof Error || !profile) {
    return {
      title: 'Connection | 강의 상세페이지',
      description: 'Connection 강의 상세페이지',
    };
  }

  return {
    title: profile.nickname,
    description: profile.introduction,
  };
};

const InstructorDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  return (
    <main className="mx-auto w-full overflow-x-hidden">
      <Suspense fallback={<ProfileSectionLoading />}>
        <ProfileSection id={id} />
      </Suspense>

      <div className="mx-auto flex w-full max-w-[51.1rem] flex-col items-center overflow-hidden">
        <Suspense fallback={<ClassSectionLoading />}>
          <ClassSection id={id} />
        </Suspense>

        <Suspense fallback={<PassSectionLoading />}>
          <PassSection id={id} />
        </Suspense>

        <Suspense fallback={<ReviewSectionLoading />}>
          <div className="w-full px-4">
            <ReviewSection type="lecturers" targetId={id} />
          </div>
        </Suspense>
      </div>
    </main>
  );
};

export default InstructorDetailPage;
