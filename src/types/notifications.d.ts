export type NotificationsFilterOption =
  | 'ALL'
  | 'RESERVED'
  | 'LIKED'
  | 'COUPON_OR_PASS'
  | 'UNREAD';

export type NotificationType = 'CHAT' | 'NOTIFICATIONS';

export interface IGetNotifications {
  lastItemId?: string;
  pageSize: number;
  filterOption: NotificationsFilterOption;
}

export interface IBaseNotification extends INotificationType {
  description: string;
  title: string;
  readedAt: null | string;
  createdAt: string;
  target: { userId: number | null; lecturerId: number | null };
}

export interface INotificationType {
  lectureId?: number;
  userId?: number;
  lecturerId?: number;
  couponId?: number;
  lecturePassId?: number;
  userPassId?: number;
  reservationId?: number;
}

export interface INotifications extends IBaseNotification {
  id: string;
}

export interface INewNotifications extends IBaseNotification {
  deletedAt: null | string;
  updatedAt: string;
  __v: number;
  _id: string;
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

export interface INotificationQuery {
  itemId: string;
  itemFilterOption?: NotificationsFilterOption;
}

export interface ISendNotification {
  targets: number[];
  description: string;
}
