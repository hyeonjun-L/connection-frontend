import { userType } from '@/types/auth';
import {
  INotificationType,
  NotificationsFilterOption,
} from '@/types/notifications';

export const generateNotificationLink = (
  notificationDetails: INotificationType,
  userType: userType,
) => {
  const { lectureId, userId, couponId, userPassId, reservationId } =
    notificationDetails;

  if (lectureId) {
    return `/class/${lectureId}`;
  }

  if (userPassId) {
    return '/mypage/user/pass';
  }

  if (couponId) {
    return '/mypage/user/coupon';
  }

  if (reservationId) {
    return userType === 'user'
      ? '/mypage/user/payment-history'
      : `/mypage/instructor/manage/member/${userId}`;
  }

  return '/';
};

export const checkFilterOption = (
  notificationDetails: INotificationType,
): NotificationsFilterOption | undefined => {
  const { lectureId, couponId, userPassId, reservationId } =
    notificationDetails;

  if (lectureId) {
    return '관심 클래스';
  }

  if (userPassId) {
    return '쿠폰/패스권';
  }

  if (couponId) {
    return '쿠폰/패스권';
  }

  if (reservationId) {
    return '수강 클래스';
  }
};
