import { cookies } from 'next/headers';
import {
  DANCE_GENRE,
  INSTRUCTOR_TAKE,
  REGIONS_SELECT_MAX,
} from '@/constants/constants';
import {
  searchBestInstructor,
  searchInstructors,
} from '@/lib/apis/serverApis/searchApis';
import {
  transformSearchInstructor,
  transformSearchParamsLocation,
} from '@/utils/apiDataProcessor';
import fillCarouselItems from '@/utils/fillCarouselItems';
import { regionsDecryption } from '@/utils/searchFilterFn';
import BestInstructors from './_components/BestInstructors';
import InstructorListView from './_components/InstructorListView';
import Filters from '@/components/Filter/Filters';
import SearchInput from '@/components/SearchInput/SearchInput';
import {
  IFilterOptions,
  InstructorCardProps,
  SearchParams,
  instructorSearchData,
} from '@/types/types';

const instructorPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;

  let instructorList: InstructorCardProps[] = [];
  let bestInstructorList: { id: number; image: string; nickname: string }[] =
    [];
  let totalItemCount = 0;

  const searchData: instructorSearchData = {
    take: INSTRUCTOR_TAKE,
    sortOption:
      searchParams.sortOption &&
      (searchParams.sortOption === 'LATEST' ||
        searchParams.sortOption === 'STARS')
        ? searchParams.sortOption
        : 'LATEST',
    value: searchParams.query,
    genres: [
      ...new Set(
        Array.isArray(searchParams.genre)
          ? searchParams.genre
          : searchParams.genre
          ? [searchParams.genre]
          : [],
      ),
    ].filter((genre) => DANCE_GENRE.includes(genre)),
    regions: [...new Set(regionsDecryption(searchParams.regions))].slice(
      0,
      REGIONS_SELECT_MAX,
    ),
    stars:
      searchParams.stars && Number.isInteger(Number(searchParams.stars))
        ? Number(searchParams.stars)
        : 0,
  };

  const filterOptions: IFilterOptions = {
    regions: transformSearchParamsLocation(searchData.regions),
    genre: searchData.genres,
    review: searchData.stars,
  };

  try {
    const [
      { totalItemCount: resTotalItemCount, instructorList: resInstructorList },
      bestInstructors,
    ] = await Promise.all([
      searchInstructors(searchData, !!user),
      searchBestInstructor(!!user),
    ]);

    bestInstructorList = bestInstructors.map((instructor) => ({
      ...instructor,
      image: instructor.lecturerProfileImageUrl[0].url,
    }));

    bestInstructorList =
      bestInstructorList.length < 8
        ? fillCarouselItems({ items: bestInstructorList, minItems: 8 })
        : bestInstructorList;

    totalItemCount = resTotalItemCount;
    instructorList = transformSearchInstructor(resInstructorList);
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="my-4 px-4 sm:px-9 xl:px-14">
        <SearchInput query={searchData.value ?? ''} />
      </div>
      {bestInstructorList.length > 2 && (
        <BestInstructors list={bestInstructorList} />
      )}

      <InstructorListView
        instructorList={instructorList}
        searchData={searchData}
        totalItemCount={totalItemCount}
      >
        <Filters type="instructor" filterOption={filterOptions} />
      </InstructorListView>
    </main>
  );
};

export default instructorPage;
