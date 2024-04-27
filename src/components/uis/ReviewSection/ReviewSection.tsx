import { redirect } from 'next/navigation';
import { REVIEW_SECTION_TAKE } from '@/constants/constants';
import { NotFoundSVG } from '@/icons/svg';
import { getReviews } from '@/lib/apis/serverApis/reviewApis';
import ReviewList from './ReviewList';
import { IReviewResponse, ReviewOrderType } from '@/types/review';
import { FetchError } from '@/types/types';

interface ReviewSectionProps {
  type: 'lectures' | 'lecturers';
  targetId: string;
  orderBy?: string;
}

const ReviewSection = async ({
  type,
  orderBy,
  targetId,
}: ReviewSectionProps) => {
  let reviews: IReviewResponse = {
    reviews: [],
    totalItemCount: 0,
    totalStars: 0,
  };

  const filterOption = {
    take: REVIEW_SECTION_TAKE,
    orderBy: orderBy ?? '최신순',
  };

  const typeName = type === 'lectures' ? '클래스' : '강사';

  try {
    const resReviews = await getReviews(filterOption, targetId, type);
    reviews = { ...reviews, ...resReviews };
  } catch (error) {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        redirect('/mypage/user/myclass/review');
      }
      console.error(error);
    }
    return (
      <section
        id="review-section"
        className="relative mb-20 flex w-full scroll-mt-16 flex-col items-center gap-2"
      >
        <div className="mb-2 flex w-full items-center justify-between">
          <h2 className="flex items-center scroll-smooth text-lg font-bold">
            {typeName} 후기
          </h2>
        </div>
        <NotFoundSVG />
        <p>해당 {typeName}의 리뷰를 찾지 못했습니다.</p>
      </section>
    );
  }

  return (
    <ReviewList
      type={type}
      targetId={targetId}
      initalData={reviews}
      orderBy={filterOption.orderBy as ReviewOrderType}
    />
  );
};

export default ReviewSection;
