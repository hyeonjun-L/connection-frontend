import { cookies } from 'next/headers';
import createParams from '@/utils/createParams';
import { userType } from '@/types/auth';
import {
  GetMyLecturersReviews,
  GetMyLecturersReviewsData,
  GetWriteReviews,
  GetWriteReviewsData,
  RatingsData,
  ReservationDetails,
  WriteReview,
} from '@/types/review';
import { FetchError } from '@/types/types';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const getWriteReviews = async (
  data: GetWriteReviews,
): Promise<GetWriteReviewsData> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get('userAccessToken')?.value;
  const params = createParams(data);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(
    END_POINT + `/lecture-reviews/lectureReviewId/my-reviews/users?${params}`,
    {
      method: 'GET',
      credentials: 'include',
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    const error: FetchError = new Error(errorData.message || '');
    error.status = response.status;
    throw error;
  }

  const resData = await response.json();
  return { item: resData.data.reviews, count: resData.data.totalItemCount };
};

export const getReservationDetails = async (): Promise<
  ReservationDetails[]
> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get('userAccessToken')?.value;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(
    END_POINT + '/lecture-reviews/lectureReviewId/reservations',
    {
      method: 'GET',
      credentials: 'include',
      headers,
    },
  );

  if (!response.ok) {
    throw new Error(`작성가능한 예약 내역 불러오기: ${response.status}`);
  }

  const resData = await response.json();
  return resData.data.reservation;
};

export const getMyLecturersReviews = async (
  data: GetMyLecturersReviews,
): Promise<GetMyLecturersReviewsData> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get('lecturerAccessToken')?.value;

  const params = new URLSearchParams();

  Object.entries(data)
    .filter(([_, v]) => v !== undefined)
    .forEach(([k, v]) => {
      params.append(k, String(v));
    });

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(
    END_POINT +
      `/lecture-reviews/lectureReviewId/my-reviews/lecturers?${params}`,
    {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
      headers,
    },
  );

  if (!response.ok) {
    throw new Error(`강사 내 리뷰 불러오기: ${response.status}`);
  }

  const resData = await response.json();
  return { count: resData.data.count, item: resData.data.review };
};

export const getRatings = async (
  userType: userType,
): Promise<RatingsData[]> => {
  const cookieStore = cookies();
  const authorization = cookieStore.get(
    userType === 'user' ? 'userAccessToken' : 'lecturerAccessToken',
  )?.value;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(
    `${END_POINT}/lecture-reviews/lectureReviewId/ratings`,
    {
      method: 'GET',
      credentials: 'include',
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    const error: FetchError = new Error(errorData.message || '');
    error.status = response.status;
    throw error;
  }

  const resData = await response.json();
  return resData.data.reviewRatings;
};
