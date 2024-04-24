import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotifications } from '@/lib/apis/notifications';
import {
  INotificationQuery,
  INotificationsPagesData,
} from '@/types/notifications';

const useReadNotification = () => {
  const queryClient = useQueryClient();

  const updatePagesData = (
    data: INotificationsPagesData,
    itemLocation: number,
    itemId: string,
    option?: string,
  ) => {
    const { pages, pageParams } = data;
    const updatedPages =
      option === '읽지 않은 알림'
        ? pages
            .map((page, index) =>
              index === itemLocation
                ? {
                    ...page,
                    notifications: page.notifications.filter(
                      ({ id }) => id !== itemId,
                    ),
                  }
                : page,
            )
            .filter((page) => page.notifications.length > 0)
        : pages.map((page, index) =>
            index === itemLocation
              ? {
                  ...page,
                  notifications: page.notifications.map((info) =>
                    info.id === itemId
                      ? { ...info, readedAt: String(new Date()) }
                      : { ...info },
                  ),
                }
              : page,
          );

    return { pages: updatedPages, pageParams };
  };

  const readNotificationQuery = ({
    itemId,
    itemLocation,
    itemFilterOption,
  }: INotificationQuery) => {
    const filterOptions = ['전체', '읽지 않은 알림', itemFilterOption];

    queryClient.setQueryData(['notificationCount'], (data: number) =>
      data ? data - 1 : data,
    );

    filterOptions.forEach((option) => {
      const filterOptionData =
        queryClient.getQueryData<INotificationsPagesData>([
          'notifications',
          option,
        ]);
      if (filterOptionData) {
        queryClient.setQueryData<INotificationsPagesData>(
          ['notifications', option],
          (data) => {
            return data
              ? updatePagesData(data, itemLocation, itemId, option)
              : { pages: [], pageParams: [undefined] };
          },
        );
      }
    });
  };

  const { mutate: readNotificationsMutate } = useMutation({
    mutationFn: readNotifications,
    onSuccess: readNotificationQuery,
  });

  return { readNotificationsMutate };
};

export default useReadNotification;
