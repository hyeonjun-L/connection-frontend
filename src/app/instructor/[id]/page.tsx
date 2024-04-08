import { Suspense } from 'react';
import { getInstructor } from '@/lib/apis/serverApis/instructorPostApis';
import ClassSection from './_components/ClassSection';
import PassSection from './_components/PassSection';
import ProfileSection from './_components/ProfileSection';
import ReviewSection from '@/components/uis/ReviewSection';
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
  const profileData = await getInstructor(id);

  if (profileData === undefined) {
    throw new Error('강사 프로필 조회 오류');
  }

  return (
    <main className="mx-auto w-full">
      <Suspense fallback={<div>로딩</div>}>
        <ProfileSection profileData={profileData} id={id} />
      </Suspense>
      <div className="mx-auto flex w-full max-w-[51.1rem] flex-col items-center overflow-hidden">
        <Suspense fallback={<div>로딩</div>}>
          <ClassSection id={id} />
        </Suspense>

        <Suspense fallback={<div>로딩</div>}>
          <PassSection id={id} />
        </Suspense>

        <ReviewSection stars={profileData.stars} type="instructor" />
      </div>
    </main>
  );
};

export default InstructorDetailPage;
