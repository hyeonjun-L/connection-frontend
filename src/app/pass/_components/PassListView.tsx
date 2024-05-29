'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import useIntersect from '@/hooks/useIntersect';
import { searchPasses } from '@/lib/apis/searchApis';
import { transformSearchPasses } from '@/utils/apiDataProcessor';
import UserPass from '@/components/Pass/UserPass';
import Spinner from '@/components/Spinner/Spinner';
import { searchPassesParameters, userPass } from '@/types/pass';

interface PassesListViewProps {
  passList: userPass[];
  searchData: searchPassesParameters;
}

const PassesListView = ({ searchData, passList }: PassesListViewProps) => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const fetchPassLists = async ({
    pageParam,
  }: {
    pageParam: searchPassesParameters;
  }): Promise<userPass[]> => {
    const resPassList = await searchPasses({ ...searchData, ...pageParam });
    return transformSearchPasses(resPassList);
  };

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['passSearch', searchData.toString()],
      queryFn: fetchPassLists,
      initialPageParam: searchData,
      initialData: () => {
        return {
          pages: [passList],
          pageParams: [searchData],
        };
      },
      getNextPageParam: (lastPage, allpages) => {
        const currentPage = allpages.length;

        return lastPage
          ? ({
              ...searchData,
              searchAfter: lastPage.at(-1)!.searchAfter,
            } as searchPassesParameters)
          : undefined;
      },
    });

  const passes = useMemo(
    () => data.pages.flatMap((classInfo) => classInfo),
    [data],
  );

  const getNextPageHandler = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const { ref } = useIntersect(getNextPageHandler, options);

  return (
    <>
      <section className="mb-7 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {passes.map((passInfo, index) => (
          <div
            key={passInfo.id}
            ref={index === passes.length - 1 && hasNextPage ? ref : undefined}
          >
            <UserPass passInfo={passInfo} />
          </div>
        ))}
      </section>
      {(isLoading || isFetchingNextPage) && (
        <div className="mb-5 flex justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default PassesListView;
