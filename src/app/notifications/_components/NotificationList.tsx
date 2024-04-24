'use client';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import {
  NOTIFICATIONS_REF_OPTIONS,
  NOTIFICATIONS_TAKE,
} from '@/constants/constants';
import useIntersect from '@/hooks/useIntersect';
import useReadNotification from '@/hooks/useReadNotification';
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
  const [deletLoading, setDeleteLoading] = useState<string | null>(null);

  const { userType, authUser } = useUserStore((state) => ({
    userType: state.userType,
    authUser: state.authUser,
  }));

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

      return allpages[0]?.totalItemCount &&
        allpages[0].totalItemCount > currentCount
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
            const updatedPages = pages.map((page) => ({
              totalItemCount: page.totalItemCount - 1,
              notifications: page.notifications.filter(
                ({ id }) => id !== itemId,
              ),
            }));

            const filteredPages = updatedPages.filter(
              (page) => page.notifications.length > 0,
            );

            return {
              pages: filteredPages.length > 0 ? filteredPages : [],
              pageParams,
            };
          },
        );
      }
    });
  };

  const { mutate: deleteNotificationsMutate } = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: (data) => {
      deleteNotificationQuery({ ...data });
      setDeleteLoading(null);
    },
    onMutate: (data) => setDeleteLoading(data.itemId),
  });

  const fetchNextPageHandler = async () => {
    if (isFetchingNextPage) return;
    await fetchNextPage();
  };

  const { ref: lastNotificationsRef } = useIntersect(
    fetchNextPageHandler,
    NOTIFICATIONS_REF_OPTIONS,
  );

  const { readNotificationsMutate } = useReadNotification();

  return (
    <section className="flex flex-col bg-sub-color1-transparent px-4 pb-12 pt-3">
      <ul className="flex flex-col gap-3.5">
        {notificationsData.pages.map(({ notifications: notificationsList }) => {
          return notificationsList.map((notifications) => (
            <NotificationItem
              key={notifications.id}
              lastNotificationsRef={
                hasNextPage ? lastNotificationsRef : undefined
              }
              deleteNotifications={() =>
                deleteNotificationsMutate({
                  itemId: notifications.id,
                  itemFilterOption: checkFilterOption(notifications),
                })
              }
              readNotifications={() =>
                readNotificationsMutate({
                  itemId: notifications.id,
                  itemFilterOption: checkFilterOption(notifications),
                })
              }
              isDeletLoading={deletLoading === notifications.id}
              userType={userType!}
              authUserId={Number(authUser?.id)}
              notifications={notifications}
            />
          ));
        })}
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
