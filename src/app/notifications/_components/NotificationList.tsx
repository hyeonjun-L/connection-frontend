'use client';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRef } from 'react';
import {
  NOTIFICATIONS_REF_OPTIONS,
  NOTIFICATIONS_TAKE,
} from '@/constants/constants';
import useIntersect from '@/hooks/useIntersect';
import {
  deleteNotifications,
  getNotifications,
} from '@/lib/apis/notifications';
import { useUserStore } from '@/store';
import { checkFilterOption } from '@/utils/notificationUtils';
import NotificationLoading from './loading/NotificationLoading';
import NotificationItem from './NotificationItem';
import {
  IGetNotifications,
  IGetNotificationsData,
  INotificationQuery,
  INotificationsPagesData,
  NotificationsFilterOption,
} from '@/types/notifications';

const NotificationList = ({
  initalData,
  filterOption,
}: {
  initalData: IGetNotificationsData;
  filterOption: NotificationsFilterOption;
}) => {
  const queryClient = useQueryClient();
  const totalItemRef = useRef(initalData.totalItemCount);

  const { userType } = useUserStore((state) => ({ userType: state.userType }));

  const fetchNotifications = async ({
    pageParam,
  }: {
    pageParam: IGetNotifications | undefined;
  }) => {
    return await getNotifications({
      pageSize: NOTIFICATIONS_TAKE,
      filterOption,
      ...pageParam,
    });
  };

  const {
    data: notificationsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications', filterOption],
    queryFn: fetchNotifications,
    initialPageParam: undefined,
    initialData: () => {
      return {
        pages: [initalData],
        pageParams: [undefined],
      };
    },
    getNextPageParam: (lastPage, allpages) => {
      const currentCount = allpages.length * NOTIFICATIONS_TAKE;

      return totalItemRef.current > currentCount
        ? {
            pageSize: NOTIFICATIONS_TAKE,
            filterOption,
            lastItemId: lastPage?.notifications.at(-1)?.id,
          }
        : undefined;
    },
  });

  const deleteNotificationQuery = ({
    itemId,
    itemLocation,
    itemFilterOption,
  }: INotificationQuery) => {
    const getFilterOptionData = (option?: string) => {
      const data = queryClient.getQueryData<INotificationsPagesData>([
        'notifications',
        option,
      ]);
      return data ? ['notifications', option] : false;
    };
    const filterOptions = ['전체', '읽지 않은 알림', itemFilterOption];

    totalItemRef.current -= 1;

    queryClient.setQueryData(['notificationCount'], (data: number) => {
      return data ? data - 1 : data;
    });

    filterOptions.forEach((option) => {
      const filterOptionData = getFilterOptionData(option);
      if (filterOptionData) {
        queryClient.setQueryData<INotificationsPagesData>(
          filterOptionData,
          (data) => {
            if (!data) {
              return {
                pages: [initalData],
                pageParams: [undefined],
              };
            }

            const { pages, pageParams } = data;
            const updatedPages = pages.map((page, index) =>
              index === itemLocation
                ? {
                    ...page,
                    notifications: page.notifications.filter(
                      ({ id }) => id !== itemId,
                    ),
                  }
                : page,
            );

            const filteredPages = updatedPages.filter(
              (page) => page.notifications.length > 0,
            );

            return {
              pages: filteredPages.length > 0 ? filteredPages : [initalData],
              pageParams,
            };
          },
        );
      }
    });
  };

  const { mutate: deleteNotificationsMutate } = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: (data) => deleteNotificationQuery({ ...data }),
  });

  const fetchNextPageHandler = async () => {
    if (isFetchingNextPage) return;
    await fetchNextPage();
  };

  const { ref: lastNotificationsRef } = useIntersect(
    fetchNextPageHandler,
    NOTIFICATIONS_REF_OPTIONS,
  );

  return (
    <section className="flex flex-col bg-sub-color1-transparent px-4 pb-12 pt-3">
      <ul className="flex flex-col gap-3.5">
        {notificationsData.pages.map(
          ({ notifications: notificationsList }, page) => {
            return notificationsList.map((notifications) => (
              <NotificationItem
                key={notifications.id}
                lastNotificationsRef={
                  hasNextPage ? lastNotificationsRef : undefined
                }
                deleteNotification={() =>
                  deleteNotificationsMutate({
                    itemId: notifications.id,
                    itemLocation: page,
                    itemFilterOption: checkFilterOption(notifications),
                  })
                }
                userType={userType!}
                notifications={notifications}
              />
            ));
          },
        )}
        {isFetchingNextPage && (
          <li className="flex flex-col gap-3.5">
            {Array.from({ length: NOTIFICATIONS_TAKE }, (_, index) => (
              <NotificationLoading key={index} />
            ))}
          </li>
        )}
      </ul>
    </section>
  );
};

export default NotificationList;
