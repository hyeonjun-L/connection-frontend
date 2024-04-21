import createParams from '@/utils/createParams';
import {
  IGetNotifications,
  IGetNotificationsData,
  INotificationQuery,
} from '@/types/notifications';
import { FetchError } from '@/types/types';

export const getNotifications = async (
  data: IGetNotifications,
): Promise<IGetNotificationsData> => {
  try {
    const params = createParams(data);

    const response = await fetch(
      `/api/notifications/get-notifications?${params}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();

    return {
      notifications: resData.data.notifications,
      totalItemCount: resData.data.totalItemCount,
    };
  } catch (error) {
    console.error('알림 불러오기 오류', error);
    throw error;
  }
};

export const deleteNotifications = async ({
  itemId,
  itemLocation,
}: INotificationQuery): Promise<INotificationQuery> => {
  try {
    const response = await fetch(
      `/api/notifications/delete?notificationsId=${itemId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    return { itemId, itemLocation };
  } catch (error) {
    console.error('알림 삭제 오류', error);
    throw error;
  }
};
