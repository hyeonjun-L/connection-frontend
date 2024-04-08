import { cookies } from 'next/headers';
import { searchBestClass } from '@/lib/apis/serverApis/searchApis';
import { transformBestClassSearch } from '@/utils/apiDataProcessor';
import CarouselTemplate from '../CarouselTemplate';

const BestClass = async () => {
  let bestClassList = [];
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;

  try {
    const resBestClassList = transformBestClassSearch(
      await searchBestClass(!!user),
    );

    if (resBestClassList.length === 0) return null;

    if (resBestClassList.length < 6) {
      const repeatCount = Math.ceil(6 / resBestClassList.length);

      bestClassList = Array(repeatCount)
        .fill(resBestClassList)
        .flat()
        .slice(0, 5);
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return <CarouselTemplate mode="class" bestClassList={bestClassList} />;
};

export default BestClass;
