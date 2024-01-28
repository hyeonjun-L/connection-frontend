import { searchBestClass } from '@/lib/apis/serverApis/searchApis';
import { transformBestClassSearch } from '@/utils/apiDataProcessor';
import CarouselTemplate from '../CarouselTemplate';
import ClassCard from '@/components/ClassPreview/ClassPreview';
import { useUserStore } from '@/store/userStore';

const BestClass = async () => {
  let bestClassList = [];

  try {
    const { userType } = useUserStore.getState();
    const resBestClassList = transformBestClassSearch(
      await searchBestClass(userType === 'user'),
    );

    bestClassList =
      resBestClassList.length < 6
        ? [
            ...resBestClassList,
            ...resBestClassList.slice(0, 6 - resBestClassList.length),
          ]
        : resBestClassList;
  } catch (error) {
    console.error(error);
    return null;
  }

  if (bestClassList.length === 0) return null;

  return (
    <CarouselTemplate mode="class">
      {bestClassList.map((classList, index) => {
        const data = { ...classList, smallView: true };
        return (
          <li key={classList.title + index} className="w-full max-w-[13rem]">
            <ClassCard key={classList.title + index} {...data} />
          </li>
        );
      })}
    </CarouselTemplate>
  );
};

export default BestClass;
