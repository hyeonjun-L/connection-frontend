import { cookies } from 'next/headers';
import { searchBestInstructor } from '@/lib/apis/serverApis/searchApis';
import CarouselTemplate from '../CarouselTemplate';
import { searchBestInstructorData } from '@/types/instructor';

const BestInstructor = async () => {
  let bestInstructorLists: searchBestInstructorData[] = [];
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;

  try {
    const resInstructorList = await searchBestInstructor(!!user);

    if (resInstructorList.length === 0) return null;

    if (resInstructorList.length < 9) {
      const repeatCount = Math.ceil(9 / resInstructorList.length);

      bestInstructorLists = Array(repeatCount)
        .fill(resInstructorList)
        .flat()
        .slice(0, 8);
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return <CarouselTemplate bestInstructorLists={bestInstructorLists} />;
};

export default BestInstructor;
