import { redirect } from 'next/navigation';
import { REVIEW_TAKE } from '@/constants/constants';
import { getMyLecture } from '@/lib/apis/serverApis/classApi';
import { getMyLecturersReviews } from '@/lib/apis/serverApis/reviewApis';
import MyReview from './_components/MyReview';
import { OptionType } from '@/types/coupon';
import { GetMyLecturersReviewsData } from '@/types/review';
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

  let myClassListsOption;
  const firstRender = {
    take: REVIEW_TAKE,
    lecturerMyReviewType: lecturerMyReviewType ?? '전체',
    orderBy: orderBy ?? '최신순',
    lectureId,
  };

  let resReview: GetMyLecturersReviewsData = { count: 0, item: [] };

  try {
    const [responseReviews, resLectureLists] = await Promise.all([
      getMyLecturersReviews(firstRender),
      getMyLecture(),
    ]);
    if (Array.isArray(responseReviews.item)) {
      resReview = responseReviews;
    }

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
    />
  );
};

export default page;
