import { PagenationFilterState } from '@/types/types';

export type ReviewOrderType =
  | '최신순'
  | '좋아요순'
  | '평점 높은순'
  | '평점 낮은순';

export interface IReviewList extends ReviewMainContent {
  id: number;
  lectureId: number;
  userId: number;
  reservationId: number;
  user: {
    nickname: string;
    profileImage: null | string;
  };
  lectureTitle: string;
  startDateTime: string;
  isLike: boolean;
  likeCount: number;
}

export interface IReviewResponse {
  reviews: IReviewList[];
  totalItemCount: number;
}

export interface WriteReview extends ReviewMainContent {
  id: number;
  lectureId: string;
  userId: string;
  reservationId: number;
  lectureTitle: string;
  isLike: boolean;
  likeCount: number;
  startDateTime: string;
  user: {
    nickname: string;
    profileImage?: string;
  };
}

export interface ReservationDetails {
  id: number;
  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  representative: string;
  phoneNumber: string;
  participants: number;
  requests?: string;
  isEnabled: boolean;
  lectureSchedule: {
    lecture: {
      id: number;
      title: string;
    };
    startDateTime: string;
  };
}

export interface SelectClassType {
  value: ReservationDetails;
  label: string;
}

export interface WriteReviewData extends ReviewMainContent {
  classInfo: SelectClassType | null;
}

export interface ReviewMainContent {
  description: string;
  stars: number;
}

export interface GetMyLecturersReviews extends PagenationFilterState {
  lecturerMyReviewType: string;
  orderBy: string;
}

export interface GetWriteReviews extends PagenationFilterState {
  orderBy: string;
}

export interface GetWriteReviewsData {
  count: number;
  item: WriteReview[];
}

export interface GetMyLecturersReviewsData {
  count: number;
  item: MyLecturersReviewsData[];
}

export interface MyLecturersReviewsData extends ReviewMainContent {
  id: number;
  lectureId: number;
  userId: number;
  reservationId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  reservation: {
    lectureSchedule: {
      startDateTime: string;
      lecture: { title: string };
    };
  };
  users: {
    nickname: string;
    userProfileImage: {
      imageUrl: string;
    };
  };
}

export interface NewReviews extends ReviewMainContent {
  lectureId: number;
  reservationId: number;
}
