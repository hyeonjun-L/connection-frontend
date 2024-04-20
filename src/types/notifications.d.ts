export type NotificationsFilterOption =
  | '전체'
  | '수강 클래스'
  | '관심 클래스'
  | '쿠폰/패스권'
  | '읽지 않은 알림';

export interface IGetNotifications {
  lastItemId?: number;
  pageSize: number;
  filterOption: NotificationsFilterOption;
}

export interface INotifications {
  id: string;
  description: string;
  target: { userId?: number; lectureId?: number };
  lectureId?: number;
  lecturerId?: number;
  couponId?: number;
  lecturePassId?: number;
  userPassId?: number;
  readedAt: null | string;
  createdAt: string;
}
