import createParams from '@/utils/createParams';
import {
  GetMyLecturersReviews,
  GetMyLecturersReviewsData,
  NewReviews,
  WriteReview,
  ReviewOrderType,
  IReviewResponse,
  GetWriteReviewsData,
  GetWriteReviews,
} from '@/types/review';
import { FetchError } from '@/types/types';

export const getClassReviews = async (
  lectureId: string,
  displayCount: number,
  currentPage: number,
  targetPage: number,
  firstItemId: number,
  lastItemId: number,
  orderBy: ReviewOrderType,
): Promise<IReviewResponse> => {
  const query = `lectureId=${lectureId}&take=${displayCount}&currentPage=${currentPage}&targetPage=${targetPage}&firstItemId=${firstItemId}&lastItemId=${lastItemId}&orderBy=${orderBy}`;

  const response = await fetch(`/api/post/review/class?${query}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('클래스 리뷰 목록 조회 오류!');

  const { data } = await response.json();

  return data;
};

export const getInstructorReviews = async (
  lecturerId: string,
  displayCount: number,
  currentPage: number,
  targetPage: number,
  firstItemId: number,
  lastItemId: number,
  orderBy: ReviewOrderType,
): Promise<IReviewResponse> => {
  const query = `lecturerId=${lecturerId}&take=${displayCount}&currentPage=${currentPage}&targetPage=${targetPage}&firstItemId=${firstItemId}&lastItemId=${lastItemId}&orderBy=${orderBy}`;

  const response = await fetch(`/api/post/review/instructor?${query}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('강사 리뷰 조회 요청 오류!');

  const { data } = await response.json();

  return data;
};

export const getWriteReviews = async (
  data: GetWriteReviews,
  signal?: AbortSignal,
): Promise<GetWriteReviewsData> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/review/user?${params}`, {
      method: 'GET',
      signal,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();
    return { item: resData.data.reviews, count: resData.data.totalItemCount };
  } catch (error) {
    console.error('내 보유 강의 조회 오류', error);
    throw error;
  }
};

export const getMyLecturersReviews = async (
  data: GetMyLecturersReviews,
  signal?: AbortSignal,
): Promise<GetMyLecturersReviewsData> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/review/lecturer?${params}`, {
      method: 'GET',
      credentials: 'include',
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();
    return { count: resData.data.count, item: resData.data.review };
  } catch (error) {
    console.error('강사 내 리뷰 불러오기', error);
    throw error;
  }
};

export const writeReview = async (data: NewReviews) => {
  try {
    const response = await fetch(`/api/review/new`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `리뷰 작성 오류: ${errorData.message || ''}, status: ${
          response.status
        }`,
      );
    }

    const responseData = await response.json();
    return responseData.data.coupon;
  } catch (error) {
    console.error('리뷰 작성 오류', error);
    throw error;
  }
};
