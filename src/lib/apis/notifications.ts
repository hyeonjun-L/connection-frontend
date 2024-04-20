import createParams from '@/utils/createParams';
import { IGetNotifications, INotifications } from '@/types/notifications';
import { FetchError } from '@/types/types';

export const getNotifications = async (
  data: IGetNotifications,
): Promise<INotifications[]> => {
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
    return resData.data.notifications;
  } catch (error) {
    console.error('알림 불러오기 오류', error);
    throw error;
  }
};
