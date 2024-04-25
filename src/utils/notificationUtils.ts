import { userType } from '@/types/auth';
import {
  INotificationType,
  NotificationsFilterOption,
} from '@/types/notifications';

export const generateNotificationLink = (
  notificationDetails: INotificationType,
  userType: userType,
) => {
  const { lectureId, couponId, userPassId, reservationId, lecturerId } =
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
      : `/mypage/instructor/manage/member`;
  }

  if (lecturerId) {
    return `/instructor/${lecturerId}`;
  }

  return '/';
};

export const checkFilterOption = (
  notificationDetails: INotificationType,
): NotificationsFilterOption | undefined => {
  const { lectureId, couponId, userPassId, reservationId } =
    notificationDetails;

  if (lectureId) {
    return 'LIKED';
  }

  if (userPassId) {
    return 'COUPON_OR_PASS';
  }

  if (couponId) {
    return 'COUPON_OR_PASS';
  }

  if (reservationId) {
    return 'RESERVED';
  }
};
