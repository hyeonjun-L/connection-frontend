export type NotificationsFilterOption =
  | '전체'
  | '수강 클래스'
  | '관심 클래스'
  | '쿠폰/패스권'
  | '읽지 않은 알림';

export interface IGetNotifications {
  lastItemId?: string;
  pageSize: number;
  filterOption: NotificationsFilterOption;
}

export interface INotifications {
  id: string;
  description: string;
  title: string;
  target: { userId?: number; lectureId?: number };
  lectureId?: number;
  lecturerId?: number;
  couponId?: number;
  lecturePassId?: number;
  userPassId?: number;
  readedAt: null | string;
  createdAt: string;
}

export interface IGetNotificationsData {
  notifications: INotifications[];
  totalItemCount: number;
}

export interface INotificationsPagesData {
  pages: { notifications: INotifications[]; totalItemCount: number }[];
  pageParams: string | undefined[];
}
