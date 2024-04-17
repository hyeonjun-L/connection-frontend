'use client';
import Link from 'next/link';
import { REVIEW_TAKE } from '@/constants/constants';
import usePageNation from '@/hooks/usePageNation';
import { EditSVG, NotFoundSVG } from '@/icons/svg';
import { getWriteReviews } from '@/lib/apis/reviewApis';
import formatDate from '@/utils/formatDate';
import { Button } from '@/components/Button';
import Pagination from '@/components/Pagination/Pagination';
import PaginationLoading from '@/components/Pagination/PaginationLoading';
import { UserReview } from '@/components/Review';
import ReviewLoading from '@/components/Review/ReviewLoading';
import ReviewLoadingContainer from '@/components/Review/ReviewLoading';
import {
  GetWriteReviewsData,
  ReservationDetails,
  WriteReview,
} from '@/types/review';

interface ReviewProps {
  initialData: GetWriteReviewsData;
  classLists: ReservationDetails[];
}

const MyReview = ({ initialData, classLists }: ReviewProps) => {
  const {
    items: reviewList,
    totalItemCount,
    filterState,
    isLoading,
    changeFilterState,
    changePage,
  } = usePageNation<WriteReview>({
    initialData,
    defaultFilterState: {
      take: REVIEW_TAKE,
      targetPage: 1,
      orderBy: '최신순',
    },
    queryType: 'userReview',
    queryFn: getWriteReviews,
  });

  const pageCount = Math.ceil(totalItemCount / REVIEW_TAKE);

  return (
    <section className="z-0 col-span-1 flex w-full flex-col px-2 sm:px-6">
      <h1 className="col-span-2 mb-4 h-auto border-b border-solid border-gray-700 pb-4 text-center text-lg font-semibold sm:mb-0 sm:border-none sm:pb-0 sm:text-start sm:text-2xl sm:font-bold">
        작성한 리뷰
      </h1>
      <div className="flex flex-col-reverse gap-5 sm:flex-row">
        <div className="flex-grow sm:border-t sm:border-solid sm:border-gray-700">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3 whitespace-nowrap py-3">
              <select
                name="sorting"
                className="h-7 border border-solid border-gray-500"
                onChange={(e) => changeFilterState({ orderBy: e.target.value })}
              >
                <option value="최신순">최신순</option>
                <option value="좋아요순">좋아요순</option>
                <option value="평점 높은순">평점 높은순</option>
                <option value="평점 낮은순">평점 낮은순</option>
              </select>
              {/* {writeReviews.length}개의 리뷰 */}
            </div>
            <Link href="/mypage/user/myclass/review/writeReviewModal">
              <Button>
                <div className="flex items-center gap-1 whitespace-nowrap px-2 text-sm sm:px-4 sm:text-base">
                  <EditSVG
                    width="15px"
                    height="15px"
                    className="fill-sub-color1"
                  />
                  <span className="hidden sm:block">리뷰 작성하기</span>
                  <span className="block sm:hidden">리뷰 작성</span>(
                  {classLists.length})
                </div>
              </Button>
            </Link>
          </nav>
          {isLoading ? (
            <ReviewLoadingContainer />
          ) : reviewList.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {reviewList.map(
                ({
                  id,
                  stars,
                  description,
                  lectureTitle,
                  startDateTime,
                  likeCount,
                  isLike,
                  user,
                }) => (
                  <UserReview
                    key={id}
                    src={user?.profileImage}
                    nickname={user.nickname}
                    average={stars}
                    date={formatDate(startDateTime)}
                    title={lectureTitle}
                    count={likeCount}
                    isLike={isLike}
                    reviewId={id}
                    content={description}
                    link={`/report?lectureReviewId=${id}`}
                  />
                ),
              )}
            </ul>
          ) : (
            <div className="my-7 flex w-full flex-col items-center justify-center gap-8 text-lg font-semibold text-gray-100">
              <NotFoundSVG />
              <p>작성 하신 리뷰가 없습니다!</p>
            </div>
          )}
          {reviewList.length > 0 && pageCount === 0 ? (
            <PaginationLoading />
          ) : (
            pageCount > 0 && (
              <nav className="z-0">
                <Pagination
                  pageCount={pageCount}
                  currentPage={
                    filterState.currentPage ? filterState.currentPage - 1 : 0
                  }
                  onPageChange={changePage}
                />
              </nav>
            )
          )}
        </div>
        <div className="w-full self-start sm:w-56 md:w-72 lg:w-80">
          {/* <ReviewStatistics reviewList={writeReviews} /> */}
        </div>
      </div>
    </section>
  );
};

export default MyReview;
