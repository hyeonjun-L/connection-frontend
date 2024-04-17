import { redirect } from 'next/navigation';
import {
  getReservationDetails,
  getWriteReviews,
} from '@/lib/apis/serverApis/reviewApis';
import MyReview from './_components/MyReview';
import { GetWriteReviewsData, ReservationDetails } from '@/types/review';

const page = async () => {
  let writeReviews: GetWriteReviewsData = { count: 0, item: [] };
  let reservationLists: ReservationDetails[] = [];
  const firstRender = {
    take: 2,
    orderBy: '최신순',
  };

  try {
    const [geyWriteReviews, getReservationLists] = await Promise.all([
      getWriteReviews(firstRender),
      getReservationDetails(),
    ]);

    writeReviews = geyWriteReviews;
    reservationLists = getReservationLists;
  } catch (error) {
    // redirect('/');
    console.error(error);
  }

  return <MyReview initialData={writeReviews} classLists={reservationLists} />;
};

export default page;
