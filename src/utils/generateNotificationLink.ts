import { userType } from '@/types/auth';
import { INotificationType } from '@/types/notifications';

const generateNotificationLink = (
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

export default generateNotificationLink;
