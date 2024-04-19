import createParams from '@/utils/createParams';
import {
  GetMyLecturersReviews,
  GetMyLecturersReviewsData,
  NewReviews,
  ReviewOrderType,
  IReviewResponse,
  GetWriteReviewsData,
  GetReviews,
  ReviewMainContent,
} from '@/types/review';
import { FetchError } from '@/types/types';

export const getReviews = async (
  data: GetReviews,
): Promise<IReviewResponse> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/review/get?${params}`, {
      credentials: 'include',
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
    return resData.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('클래스 리뷰 목록 조회 오류', error);
    throw error;
  }
};

export const getWriteReviews = async (
  data: GetReviews,
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
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
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
    return { count: resData.data.totalItemCount, item: resData.data.reviews };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
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
    return responseData;
  } catch (error) {
    console.error('리뷰 작성 오류', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const response = await fetch(`/api/review/delete?reviewId=${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('리뷰 삭제 오류', error);
    throw error;
  }
};

export const updateReview = async (
  data: ReviewMainContent,
  reviewId: number,
) => {
  try {
    const response = await fetch(`/api/review/update?reviewId=${reviewId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('리뷰 수정 오류', error);
    throw error;
  }
};

export const postReviewLikes = async (id: number) => {
  try {
    const response = await fetch(`/api/post/review/likes/add?reviewId=${id}`, {
      method: 'POST',
      credentials: 'include',
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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('리뷰 좋아요 요청 오류', error);
    throw error;
  }
};

export const deleteReviewLikes = async (id: number) => {
  try {
    const response = await fetch(
      `/api/post/review/likes/delete?reviewId=${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('리뷰 좋아요 취소 요청 오류', error);
    throw error;
  }
};
