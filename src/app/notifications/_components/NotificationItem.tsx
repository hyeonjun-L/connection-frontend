import { TrashcanSVG } from '@/icons/svg';
import { formatRelativeOrShortDate } from '@/utils/dateTimeUtils';
import { INotifications } from '@/types/notifications';

interface NotificationItemProps {
  notifications: INotifications;
  deleteNotification: () => void;
}
const NotificationItem = ({
  notifications,
  deleteNotification,
}: NotificationItemProps) => {
  const { description, createdAt, title } = notifications;

  return (
    <li className="w-full rounded-md bg-white px-4 py-3 shadow-float">
      <dl>
        <div className="mb-2 flex w-full items-center justify-between gap-3">
          <div className="grid grid-cols-[auto_auto] gap-x-3 text-sm">
            <dt className="truncate font-semibold">{title}</dt>
            <dd className="text-gray-300">
              {formatRelativeOrShortDate(createdAt)}
            </dd>
          </div>
          <button
            onClick={deleteNotification}
            className="group flex size-7 flex-shrink-0 items-center justify-center rounded-full shadow-vertical active:bg-gray-200 active:shadow-none"
          >
            <TrashcanSVG className="size-5 stroke-gray-300 stroke-2 group-hover:stroke-black" />
          </button>
        </div>
        <dd>{description}</dd>
      </dl>
    </li>
  );
};

export default NotificationItem;
