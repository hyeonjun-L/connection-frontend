import { cookies } from 'next/headers';
import { MainTopSVG } from '@/icons/svg';
import { searchBestInstructor } from '@/lib/apis/serverApis/searchApis';
import fillCarouselItems from '@/utils/fillCarouselItems';
import CarouselTemplate from '../CarouselTemplate';
import SectionHeader from '../SectionHeader';
import { searchBestInstructorData } from '@/types/instructor';

const BestInstructor = async () => {
  let bestInstructorLists: searchBestInstructorData[] = [];
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;

  try {
    const resInstructorList = await searchBestInstructor(!!user);

    if (resInstructorList.length < 3) return null;

    bestInstructorLists =
      resInstructorList.length < 8
        ? fillCarouselItems({ items: resInstructorList, minItems: 8 })
        : resInstructorList;
  } catch (error) {
    console.error(error);
    return null;
  }

  return (
    <section className="mt-3">
      <SectionHeader
        icon={<MainTopSVG />}
        title="인기 강사 TOP8"
        link="/instructor"
      />
      <CarouselTemplate bestInstructorLists={bestInstructorLists} />;
    </section>
  );
};

export default BestInstructor;
