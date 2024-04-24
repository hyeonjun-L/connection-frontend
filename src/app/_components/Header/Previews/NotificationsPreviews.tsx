import Link from 'next/link';
import generateNotificationLink from '@/utils/generateNotificationLink';
import { userType } from '@/types/auth';
import { INewNotifications } from '@/types/notifications';

const NotificationsPreviews = ({
  notifications,
  userType,
}: {
  notifications: INewNotifications;
  userType: userType;
}) => {
  return (
    <Link
      href={generateNotificationLink(notifications, userType)}
      className="relative flex w-full flex-col gap-1 text-left text-sm"
    >
      <p className="line-clamp-2 truncate text-wrap font-semibold">
        {notifications.description}
      </p>
      <p className="truncate font-bold text-sub-color1">
        {notifications.title}
      </p>
    </Link>
  );
};

export default NotificationsPreviews;
