import BestInstructors from '@/app/instructor/_components/BestInstructors';
import {
  DANCE_GENRE,
  INSTRUCTOR_TAKE,
  REGIONS_SELECT_MAX,
} from '@/constants/constants';
import { dummyMain } from '@/constants/dummy';
import { searchInstructors } from '@/lib/apis/serverApis/searchApis';
import { useUserStore } from '@/store/userStore';
import {
  transformSearchInstructor,
  transformSearchParamsLocation,
} from '@/utils/apiDataProcessor';
import { regionsDecryption } from '@/utils/searchFilterFn';
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
  const { userType } = useUserStore.getState();
  let instructorList: InstructorCardProps[] = [];

  const searchData: instructorSearchData = {
    take: 1,
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
    stars: searchParams.stars ?? 0,
  };

  const filterOptions: IFilterOptions = {
    regions: transformSearchParamsLocation(searchData.regions),
    genre: searchData.genres,
    review: searchData.stars,
    price: [],
    date: [],
    method: [],
    daytime: [],
  };

  try {
    const instructors = await searchInstructors(
      searchData,
      userType === 'user',
    );

    searchData.searchAfter = instructors.at(-1)?.searchAfter;

    instructorList = transformSearchInstructor(instructors);
  } catch (error) {
    console.error(error);
  }

  return (
    <section className="flex flex-col">
      <div className="my-4 px-4 sm:px-9 xl:px-14">
        <SearchInput query={searchData.value ?? ''} />
      </div>
      <BestInstructors list={dummyMain.topInstructorList} />

      <div>
        <InstructorListView
          instructorList={instructorList}
          searchData={searchData}
        >
          <Filters type="instructor" filterOption={filterOptions} />
        </InstructorListView>
      </div>
    </section>
  );
};

export default instructorPage;
