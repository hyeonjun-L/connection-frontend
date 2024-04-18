import { redirect } from 'next/navigation';
import { REVIEW_TAKE } from '@/constants/constants';
import { getMyLecture } from '@/lib/apis/serverApis/classApi';
import {
  getMyLecturersReviews,
  getRatings,
} from '@/lib/apis/serverApis/reviewApis';
import MyReview from './_components/MyReview';
import { OptionType } from '@/types/coupon';
import { GetMyLecturersReviewsData, RatingsData } from '@/types/review';
import { FetchError } from '@/types/types';

const page = async ({
  searchParams,
}: {
  searchParams: {
    orderBy: string;
    lecturerMyReviewType: string;
    lectureId: number;
  };
}) => {
  const { orderBy, lecturerMyReviewType, lectureId } = searchParams;
  let ratingLists: RatingsData[] = [];
  let myClassListsOption;
  const firstRender = {
    take: REVIEW_TAKE,
    lecturerMyReviewType: lecturerMyReviewType ?? '전체',
    orderBy: orderBy ?? '최신순',
    lectureId,
  };

  let resReview: GetMyLecturersReviewsData = { count: 0, item: [] };

  try {
    const [responseReviews, resLectureLists, getRatingLists] =
      await Promise.all([
        getMyLecturersReviews(firstRender),
        getMyLecture(),
        getRatings('lecturer'),
      ]);
    if (Array.isArray(responseReviews.item)) {
      resReview = responseReviews;
    }
    ratingLists = getRatingLists;

    myClassListsOption = resLectureLists.map(
      ({ id, title }): OptionType => ({
        value: id,
        label: title,
      }),
    );

    myClassListsOption.length > 0 &&
      myClassListsOption.unshift({
        value: '',
        label: `전체 클래스(${myClassListsOption.length})`,
      });
  } catch (error) {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        redirect('/mypage/instructor/manage/review');
      }
      console.error(error);
    }
  }

  return (
    <MyReview
      initialData={resReview}
      myClassListsOption={myClassListsOption ?? []}
      ratingLists={ratingLists}
    />
  );
};

export default page;
