import Link from 'next/link';
import { RefObject } from 'react';
import { TrashcanSVG } from '@/icons/svg';
import { formatRelativeOrShortDate } from '@/utils/dateTimeUtils';
import { generateNotificationLink } from '@/utils/notificationUtils';
import NotificationDeleteLoading from './loading/NotificationDeleteLoading';
import Profile from './Profile';
import { userType } from '@/types/auth';
import { INotifications } from '@/types/notifications';

interface NotificationItemProps {
  userType: userType;
  notifications: INotifications;
  readNotifications: () => void;
  deleteNotifications: () => void;
  lastNotificationsRef?: RefObject<HTMLDivElement>;
  isDeletLoading: boolean;
}
const NotificationItem = ({
  userType,
  notifications,
  lastNotificationsRef,
  isDeletLoading,
  deleteNotifications,
  readNotifications,
}: NotificationItemProps) => {
  const { description, createdAt, title, lecturerId, userId, readedAt } =
    notifications;

  const href = generateNotificationLink(notifications, userType);

  const opponentId = lecturerId ? lecturerId : userId;
  const opponentType = userType === 'user' ? 'lecturer' : 'user';

  const deletNotificationHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.nativeEvent.preventDefault();

    deleteNotifications();
  };

  const readNotificationHandler = () => {
    readNotifications();
  };

  return (
    <Link
      onClick={readNotificationHandler}
      href={href}
      className="w-full rounded-md bg-white px-4 py-3 shadow-float hover:shadow-inner"
    >
      <dl className={`${readedAt ? 'text-gray-300' : ''}`}>
        <div
          ref={lastNotificationsRef}
          className="mb-2 flex w-full items-center justify-between gap-3"
        >
          <div
            className={`grid ${
              opponentId && userId !== opponentId
                ? 'grid-cols-[auto_auto_auto]'
                : 'grid-cols-[auto_auto]'
            } items-center gap-x-3 text-sm`}
          >
            {opponentId && userId !== opponentId && (
              <Profile opponentId={opponentId} opponentType={opponentType} />
            )}
            <dt className="truncate font-semibold">{title}</dt>
            <time className="text-gray-300" suppressHydrationWarning>
              {formatRelativeOrShortDate(createdAt)}
            </time>
          </div>
          {isDeletLoading ? (
            <NotificationDeleteLoading />
          ) : (
            <button
              onClick={deletNotificationHandler}
              className="group flex size-7 flex-shrink-0 items-center justify-center rounded-full shadow-vertical active:bg-gray-200 active:shadow-none"
            >
              <TrashcanSVG className="size-5 stroke-gray-300 stroke-2 group-hover:stroke-black" />
            </button>
          )}
        </div>
        <dd>{description}</dd>
      </dl>
    </Link>
  );
};

export default NotificationItem;
