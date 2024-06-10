'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CLASS_TAKE } from '@/constants/constants';
import useChangeSearchParams from '@/hooks/useChangeSearchParams';
import useIntersect from '@/hooks/useIntersect';
import { NotFoundSVG } from '@/icons/svg';
import { searchClasses } from '@/lib/apis/searchApis';
import { transformSearchClass } from '@/utils/apiDataProcessor';
import ClassPreview from '@/components/ClassPreview/ClassPreview';
import ClassPreviewLoading from '@/components/Loading/ClassPreviewLoading';
import Spinner from '@/components/Spinner/Spinner';
import { ClassCardType, searchClassParameters } from '@/types/class';
import { classSearchData } from '@/types/types';

interface ClassListViewProps {
  searchData: classSearchData;
  children: React.ReactNode;
  classList: ClassCardType[];
  totalItemCount: number;
}

const ClassListView = ({
  children,
  searchData,
  classList,
  totalItemCount,
}: ClassListViewProps) => {
  const { changeParams, searchParams } = useChangeSearchParams();

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const sortOptionList: {
    id: 'LATEST' | 'STARS';
    label: string;
  }[] = [
    {
      id: 'LATEST',
      label: '최신순',
    },
    {
      id: 'STARS',
      label: '별점순',
    },
  ];

  const fetchClassLists = async ({
    pageParam,
  }: {
    pageParam: searchClassParameters;
  }): Promise<ClassCardType[]> => {
    const resClassList = await searchClasses({ ...searchData, ...pageParam });
    return transformSearchClass(resClassList);
  };

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['classSearch', searchParams.toString()],
      queryFn: fetchClassLists,
      initialPageParam: searchData,
      initialData: () => {
        return {
          pages: [classList],
          pageParams: [searchData],
        };
      },
      getNextPageParam: (lastPage, allpages) => {
        return totalItemCount > allpages.length * CLASS_TAKE
          ? ({
              ...searchData,
              searchAfter: lastPage.at(-1)!.searchAfter,
            } as searchClassParameters)
          : undefined;
      },
    });

  const classLists = useMemo(
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
    <div className="px-4 sm:px-9 xl:px-14">
      <nav className="mt-4 flex flex-col gap-1">
        {children}

        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5">
            {sortOptionList.map((option) => (
              <div key={option.id} className="flex items-center gap-1">
                <input
                  id={option.id}
                  type="checkbox"
                  className="peer h-[18px] w-[18px] accent-black"
                  checked={searchData.sortOption === option.id}
                  onChange={() =>
                    changeParams({ name: 'sortOption', value: option.id })
                  }
                />
                <label
                  htmlFor={option.id}
                  className="cursor-pointer text-gray-500 peer-checked:text-black"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div
        className={`my-4 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-y-12 lg:grid-cols-4 xl:grid-cols-2 xl:gap-x-5 xl:gap-y-4 ${
          classLists.length > 0 ? 'grid' : 'hidden'
        }`}
      >
        {classLists.map((classData, index) => (
          <div
            ref={
              index === classLists.length - 1 && hasNextPage ? ref : undefined
            }
            key={classData.id}
          >
            <ClassPreview {...classData} />
          </div>
        ))}
        {(isLoading || isFetchingNextPage) &&
          Array.from({ length: CLASS_TAKE }, (_, index) => (
            <ClassPreviewLoading key={index} />
          ))}
      </div>

      <div
        className={`my-7 flex w-full flex-col items-center justify-center gap-8 text-lg font-semibold text-gray-100 ${
          classLists.length > 0 ? 'hidden' : 'block'
        }`}
      >
        <NotFoundSVG />
        <p>검색된 결과가 없습니다</p>
      </div>

      {(isLoading || isFetchingNextPage) && (
        <div className="mb-5 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ClassListView;
