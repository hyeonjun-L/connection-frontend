import { NOTIFICATIONS_TAKE } from '@/constants/constants';
import NotificationLoading from './NotificationLoading';

const NotificationsSectionLoading = () => {
  return (
    <div className="flex flex-col bg-sub-color1-transparent px-4 pb-12 pt-3">
      <div className="flex flex-col gap-3.5">
        {Array.from({ length: NOTIFICATIONS_TAKE }, (_, index) => (
          <NotificationLoading key={index} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsSectionLoading;
