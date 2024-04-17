import { redirect } from 'next/navigation';
import { REVIEW_TAKE } from '@/constants/constants';
import {
  getRatings,
  getReservationDetails,
  getWriteReviews,
} from '@/lib/apis/serverApis/reviewApis';
import MyReview from './_components/MyReview';
import {
  GetWriteReviewsData,
  RatingsData,
  ReservationDetails,
} from '@/types/review';

const page = async ({
  searchParams,
}: {
  searchParams: { orderBy: string };
}) => {
  const { orderBy } = searchParams;
  let writeReviews: GetWriteReviewsData = { count: 0, item: [] };
  let reservationLists: ReservationDetails[] = [];
  let ratingLists: RatingsData[] = [];
  const firstRender = {
    take: REVIEW_TAKE,
    orderBy: orderBy ?? '최신순',
  };

  try {
    const [geyWriteReviews, getReservationLists, getRatingLists] =
      await Promise.all([
        getWriteReviews(firstRender),
        getReservationDetails(),
        getRatings('user'),
      ]);

    ratingLists = getRatingLists;
    writeReviews = geyWriteReviews;
    reservationLists = getReservationLists;
  } catch (error) {
    // redirect('/');
    console.error(error);
  }

  return (
    <MyReview
      initialData={writeReviews}
      classLists={reservationLists}
      ratingLists={ratingLists}
    />
  );
};

export default page;
