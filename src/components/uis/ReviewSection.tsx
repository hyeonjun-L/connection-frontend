import { redirect } from 'next/navigation';
import { REVIEW_SECTION_TAKE } from '@/constants/constants';
import { getReviews } from '@/lib/apis/serverApis/reviewApis';
import ReviewList from './ReviewSection/ReviewList';
import { IReviewResponse } from '@/types/review';

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

  try {
    const resReviews = await getReviews(filterOption, targetId, type);
    reviews = resReviews;
  } catch (error) {
    // redirect 추가
    console.error(error);
    return <div>리뷰 조회 에러</div>; // 변경
  }

  return <ReviewList type={type} targetId={targetId} initalData={reviews} />;
};

export default ReviewSection;
