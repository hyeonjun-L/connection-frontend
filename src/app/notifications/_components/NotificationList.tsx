import NotificationItem from './NotificationItem';
import { INotifications } from '@/types/notifications';

const NotificationList = ({
  notificationsList,
}: {
  notificationsList: INotifications[];
}) => {
  return (
    <section className="flex flex-col bg-sub-color1-transparent px-4 pb-12 pt-3">
      <ul className="flex flex-col gap-3.5">
        {notificationsList.map((notifications) => (
          <NotificationItem
            key={notifications.id}
            notifications={notifications}
          />
        ))}
      </ul>
    </section>
  );
};

export default NotificationList;
