import { cookies } from 'next/headers';
import createParams from '@/utils/createParams';
import {
  IGetNotifications,
  IGetNotificationsData,
} from '@/types/notifications';
import { FetchError } from '@/types/types';

const END_POINT = process.env.NEXT_PUBLIC_API_END_POINT;

export const getNotifications = async (
  data: IGetNotifications,
): Promise<IGetNotificationsData> => {
  const cookieStore = cookies();
  const userToken = cookieStore.get('userAccessToken')?.value;
  const lecturerToken = cookieStore.get('lecturerAccessToken')?.value;
  const authorization = userToken || lecturerToken;

  const params = createParams(data);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
  };

  const response = await fetch(
    END_POINT + `/notifications/notificationsId?${params}`,
    {
      method: 'GET',
      credentials: 'include',
      headers,
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
};
