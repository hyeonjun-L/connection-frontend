import { cookies } from 'next/headers';
import { MainPopularSVG } from '@/icons/svg';
import { searchBestClass } from '@/lib/apis/serverApis/searchApis';
import { transformBestClassSearch } from '@/utils/apiDataProcessor';
import fillCarouselItems from '@/utils/fillCarouselItems';
import CarouselTemplate from '../CarouselTemplate';
import SectionHeader from '../SectionHeader';

const BestClass = async () => {
  let bestClassList = [];
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;

  try {
    const resBestClassList = transformBestClassSearch(
      await searchBestClass(!!user),
    );

    if (resBestClassList.length < 3) return null;

    bestClassList =
      resBestClassList.length < 6
        ? fillCarouselItems({ items: resBestClassList, minItems: 6 })
        : resBestClassList;
  } catch (error) {
    console.error(error);
    return null;
  }

  return (
    <section className="mt-4 w-full">
      <SectionHeader
        icon={<MainPopularSVG />}
        title="인기 클래스"
        link="/class"
      />
      <CarouselTemplate bestClassList={bestClassList} />;
    </section>
  );
};

export default BestClass;
