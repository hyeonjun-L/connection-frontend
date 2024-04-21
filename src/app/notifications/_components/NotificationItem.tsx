import { differenceInHours, parseISO } from 'date-fns';
import { TrashcanSVG } from '@/icons/svg';
import { formatShortDate } from '@/utils/dateTimeUtils';
import { INotifications } from '@/types/notifications';

const NotificationItem = ({
  notifications,
}: {
  notifications: INotifications;
}) => {
  const { description, createdAt, title } = notifications;
  console.log(notifications);

  const formatRelativeOrShortDate = (date: Date | string) => {
    const currentDate = new Date();
    const targetDate = date instanceof Date ? date : parseISO(date);
    const hoursDiff = differenceInHours(currentDate, targetDate);

    if (hoursDiff < 24) {
      return `${hoursDiff}시간 전`;
    } else {
      return formatShortDate(targetDate);
    }
  };

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
          <button className="group flex size-7 flex-shrink-0 items-center justify-center rounded-full shadow-vertical">
            <TrashcanSVG className="size-5 stroke-gray-300 stroke-2 group-hover:stroke-sub-color1" />
          </button>
        </div>
        <dd>{description}</dd>
      </dl>
    </li>
  );
};

export default NotificationItem;
