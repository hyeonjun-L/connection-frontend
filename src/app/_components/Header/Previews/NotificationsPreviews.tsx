import Link from 'next/link';
import useReadNotification from '@/hooks/useReadNotification';
import {
  checkFilterOption,
  generateNotificationLink,
} from '@/utils/notificationUtils';
import { userType } from '@/types/auth';
import { INewNotifications } from '@/types/notifications';

const NotificationsPreviews = ({
  notifications,
  userType,
}: {
  notifications: INewNotifications;
  userType: userType;
}) => {
  const { description, title, _id } = notifications;

  const { readNotificationsMutate } = useReadNotification();

  return (
    <Link
      onClick={() =>
        readNotificationsMutate({
          itemId: _id,
          itemFilterOption: checkFilterOption(notifications),
        })
      }
      href={generateNotificationLink(notifications, userType)}
      className="relative flex w-full flex-col gap-1 text-left text-sm"
    >
      <p className="line-clamp-2 truncate text-wrap font-semibold">
        {description}
      </p>
      <p className="truncate font-bold text-sub-color1">{title}</p>
    </Link>
  );
};

export default NotificationsPreviews;
