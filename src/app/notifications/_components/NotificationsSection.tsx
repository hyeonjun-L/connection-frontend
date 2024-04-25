import { redirect } from 'next/navigation';
import { NOTIFICATIONS_TAKE } from '@/constants/constants';
import { getNotifications } from '@/lib/apis/serverApis/notifications';
import NotificationList from './NotificationList';
import {
  IGetNotificationsData,
  NotificationsFilterOption,
} from '@/types/notifications';
import { FetchError } from '@/types/types';

const NotificationsSection = async ({
  filterOption,
}: {
  filterOption: string;
}) => {
  const filterData = {
    pageSize: NOTIFICATIONS_TAKE,
    filterOption: (filterOption as NotificationsFilterOption) ?? 'ALL',
  };

  let notifications: IGetNotificationsData = {
    notifications: [],
    totalItemCount: 0,
  };

  try {
    notifications = await getNotifications(filterData);
  } catch (error) {
    if (error instanceof Error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 400) {
        redirect('/notifications');
      }
      console.error(error);
    }
  }

  return (
    <NotificationList
      initalData={notifications}
      filterOption={filterData.filterOption}
    />
  );
};

export default NotificationsSection;
