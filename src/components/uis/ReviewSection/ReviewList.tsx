'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { REVIEW_SECTION_TAKE } from '@/constants/constants';
import { ArrowUpSVG, StarSVG } from '@/icons/svg';
import { getReviews } from '@/lib/apis/reviewApis';
import { formatShortDate } from '@/utils/dateTimeUtils';
import SortDropdown from '@/components/Dropdown/SortDropdown';
import { Review, UserReview } from '@/components/Review';
import ReviewLoading from '@/components/Review/ReviewLoading';
import { IReviewResponse, ReviewOrderType } from '@/types/review';
import { PageNavigationState } from '@/types/types';

interface ReviewListProps {
  type: 'lectures' | 'lecturers';
  targetId: string;
  initalData: IReviewResponse;
  orderBy: ReviewOrderType;
}

const ReviewList = ({
  type,
  targetId,
  initalData,
  orderBy: defaultOrderBy,
}: ReviewListProps) => {
  const [isListOpened, setIsListOpened] = useState(false);
  const [orderBy, setOrderBy] = useState<ReviewOrderType>(defaultOrderBy);
  const dropDownRef = useRef(null);

  useClickAway(dropDownRef, () => {
    setIsListOpened(false);
  });

  const changeOrderBy = (listValue: ReviewOrderType) => {
    setOrderBy(listValue);
  };

  const fetchReviews = async ({
    pageParam,
  }: {
    pageParam: PageNavigationState | undefined;
  }) => {
    return await getReviews({
      take: REVIEW_SECTION_TAKE,
      orderBy,
      type,
      targetId,
      ...pageParam,
    });
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['reviews', type, targetId, orderBy],
      queryFn: fetchReviews,
      initialPageParam: undefined,
      initialData: () => {
        return {
          pages: [initalData],
          pageParams: [undefined],
        };
      },
      getNextPageParam: (lastPage, allpages) => {
        const currentPage = allpages.length;

        return Math.ceil(lastPage.totalItemCount / REVIEW_SECTION_TAKE) >
          currentPage
          ? {
              currentPage,
              targetPage: currentPage + 1,
              firstItemId: lastPage.reviews[0]?.id,
              lastItemId: lastPage.reviews.at(-1)?.id,
            }
          : undefined;
      },
      refetchOnWindowFocus: false,
    });

  return (
    <section id="review-section" className="relative mb-20 w-full scroll-mt-16">
      <div
        ref={dropDownRef}
        className="mb-4 flex w-full items-center justify-between"
      >
        <h2 className="flex items-center scroll-smooth text-lg font-bold">
          {type === 'lectures' ? '클래스' : '강사'} 후기
          {data.pages[0].totalItemCount}건
          <div className="ml-3 hidden md:block">
            <Review average={data.pages[0].totalStars} />
          </div>
          <StarSVG
            width="15"
            height="14"
            className={`${
              data ? 'fill-sub-color1' : 'animate-pulse fill-gray-700'
            } ml-3 sm:block md:hidden`}
          />
          <span className="ml-1 text-gray-500">
            ({data.pages[0].totalStars})
          </span>
        </h2>

        <button
          onClick={() => setIsListOpened((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-medium"
          aria-label="리뷰 정렬"
        >
          {orderBy}
          <ArrowUpSVG
            width="27"
            height="27"
            className={`origin-center fill-black ${
              isListOpened ? '' : 'rotate-180'
            }`}
          />
        </button>
        {isListOpened && (
          <SortDropdown selectedOption={orderBy} onClickList={changeOrderBy} />
        )}
      </div>

      <div className="mb-3.5 flex min-h-20 flex-col gap-6">
        {data.pages.map((page) =>
          page.reviews.map((review) => (
            <UserReview
              key={review.id}
              reviewId={review.id}
              src={review.user.profileImage}
              nickname={review.user.nickname}
              average={review.stars}
              content={review.description}
              date={formatShortDate(review.startDateTime)}
              title={review.lectureTitle}
              isLike={review.isLike}
              count={review.likeCount}
              link={`/report?lectureReviewId=${review.id}`}
              userId={review.userId}
            />
          )),
        )}
        {isFetchingNextPage && <ReviewLoading />}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mx-auto flex gap-x-1.5 text-gray-500"
        >
          더보기
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-solid border-gray-500 pb-0.5 text-xl font-semibold text-sub-color1">
            +
          </div>
        </button>
      )}
    </section>
  );
};

export default ReviewList;
