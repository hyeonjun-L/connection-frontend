'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { INSTRUCTOR_TAKE } from '@/constants/constants';
import useIntersect from '@/hooks/useIntersect';
import { NotFoundSVG } from '@/icons/svg';
import { searchInstructors } from '@/lib/apis/searchApis';
import { transformSearchInstructor } from '@/utils/apiDataProcessor';
import NavComponent from './NavComponent';
import InstructorCard from '@/components/InstructorCard/InstructorCard';
import Spinner from '@/components/Spinner/Spinner';
import { searchInstructorParameters } from '@/types/instructor';
import { InstructorCardProps, instructorSearchData } from '@/types/types';

interface InstructorListViewProps {
  instructorList: InstructorCardProps[];
  searchData: instructorSearchData;
  children: React.ReactNode;
  totalItemCount: number;
}

const InstructorListView = ({
  instructorList,
  searchData,
  children,
  totalItemCount,
}: InstructorListViewProps) => {
  const searchParams = useSearchParams();
  const [largeImg, setLargeImg] = useState(true);

  useEffect(() => {
    const storedValue = localStorage.getItem('cardState');
    if (storedValue !== null) {
      setLargeImg(storedValue === 'large');
    }
  }, []);

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const fetchInstructorLists = async ({
    pageParam,
  }: {
    pageParam: searchInstructorParameters;
  }): Promise<InstructorCardProps[]> => {
    const resInstructorsList = await searchInstructors({
      ...searchData,
      ...pageParam,
    });
    return transformSearchInstructor(resInstructorsList);
  };

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['instructorSearch', searchParams.toString()],
      queryFn: fetchInstructorLists,
      initialPageParam: searchData,
      initialData: () => {
        return {
          pages: [instructorList],
          pageParams: [searchData],
        };
      },
      getNextPageParam: (lastPage, allpages) => {
        return totalItemCount > allpages.length * INSTRUCTOR_TAKE
          ? ({
              ...searchData,
              searchAfter: lastPage.at(-1)!.searchAfter,
            } as searchInstructorParameters)
          : undefined;
      },
    });

  const instructors = useMemo(
    () => data.pages.flatMap((classInfo) => classInfo),
    [data],
  );

  const getNextPageHandler = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const { ref } = useIntersect(getNextPageHandler, options);

  const imgStateHandler = (state: boolean) => {
    setLargeImg(state);
    localStorage.setItem('cardState', state ? 'large' : 'small');
  };

  return (
    <div className="px-4 sm:px-9 xl:px-14">
      <NavComponent
        largeImg={largeImg}
        imgStateHandler={imgStateHandler}
        sortOption={searchData.sortOption}
      >
        {children}
      </NavComponent>

      <div
        className={`my-4 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4 ${
          largeImg ? 'grid-cols-1' : 'grid-cols-2'
        } ${instructors.length > 0 ? 'grid' : 'hidden'}`}
      >
        {instructors.map((info, index) => {
          const newInfo = { ...info, largeImg };
          return (
            <div
              ref={
                index === instructors.length - 1 && hasNextPage
                  ? ref
                  : undefined
              }
              key={info.id}
              className="h-60"
            >
              <InstructorCard {...newInfo} />
            </div>
          );
        })}
        {(isLoading || isFetchingNextPage) &&
          Array.from({ length: INSTRUCTOR_TAKE }, (_, index) => (
            <div
              key={index}
              className="h-60 w-full animate-pulse rounded-md bg-gray-700"
            />
          ))}
      </div>

      <div
        className={`my-7 flex w-full flex-col items-center justify-center gap-8 text-lg font-semibold text-gray-100 ${
          instructors.length > 0 ? 'hidden' : 'block'
        }`}
      >
        <NotFoundSVG />
        <p>검색된 결과가 없습니다</p>
      </div>
    </div>
  );
};

export default InstructorListView;
