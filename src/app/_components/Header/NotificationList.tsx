import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  NOTIFICATIONS_REF_OPTIONS,
  NOTIFICATIONS_TAKE,
} from '@/constants/constants';
import useIntersect from '@/hooks/useIntersect';
import useReadNotification from '@/hooks/useReadNotification';
import { getNotifications } from '@/lib/apis/notifications';
import { formatRelativeOrShortDate } from '@/utils/dateTimeUtils';
import {
  checkFilterOption,
  generateNotificationLink,
} from '@/utils/notificationUtils';
import { userType } from '@/types/auth';
import {
  IGetNotifications,
  NotificationsFilterOption,
} from '@/types/notifications';

const NotificationList = ({
  userType,
  alarmCount,
}: {
  userType: userType;
  alarmCount: string;
}) => {
  const fetchNotifications = ({
    pageParam,
  }: {
    pageParam: IGetNotifications | undefined;
  }) =>
    getNotifications({
      pageSize: NOTIFICATIONS_TAKE,
      filterOption: '읽지 않은 알림',
      ...pageParam,
    });

  const {
    data: notificationsList,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications', '읽지 않은 알림'],
    queryFn: fetchNotifications,
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allpages) => {
      const currentCount = allpages.length * NOTIFICATIONS_TAKE;

      return allpages[0]?.totalItemCount &&
        allpages[0].totalItemCount > currentCount
        ? {
            pageSize: NOTIFICATIONS_TAKE,
            filterOption: '읽지 않은 알림' as NotificationsFilterOption,
            lastItemId: lastPage?.notifications.at(-1)?.id,
          }
        : undefined;
    },
  });

  const fetchNextPageHandler = async () => {
    if (isFetchingNextPage) return;
    await fetchNextPage();
  };

  const { ref: lastNotificationsRef } = useIntersect(
    fetchNextPageHandler,
    NOTIFICATIONS_REF_OPTIONS,
  );

  const notifications = useMemo(
    () =>
      notificationsList?.pages.flatMap(({ notifications }) => notifications) ??
      [],
    [notificationsList],
  );

  const { readNotificationsMutate } = useReadNotification();

  return (
    <article className="absolute right-0 top-[2.625rem] flex w-[17.188rem] flex-col rounded-md bg-white text-sm shadow-vertical">
      <header className="flex items-center justify-between px-3 py-3">
        <h1
          className={`font-semibold ${
            notificationsList ? '' : 'flex items-center gap-1'
          }`}
        >
          알림
          {notificationsList ? (
            `(${alarmCount === '' ? 0 : alarmCount})`
          ) : (
            <div className="h-4 w-6 animate-pulse bg-gray-700" />
          )}
        </h1>
        <Link href="/notifications" className="text-gray-500 hover:underline">
          전체보기
        </Link>
      </header>
      <section className="max-h-[16.75rem] overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {isLoading ? (
            <NotificationLoading />
          ) : (
            notifications.map((notificationsInfo, index) => {
              const { id, description, title, createdAt } = notificationsInfo;
              return (
                <li
                  key={id}
                  className="group bg-sub-color1-transparent px-3 py-2"
                >
                  <Link
                    onClick={() =>
                      readNotificationsMutate({
                        itemId: id,
                        itemFilterOption: checkFilterOption(notificationsInfo),
                      })
                    }
                    href={generateNotificationLink(notificationsInfo, userType)}
                  >
                    <div
                      ref={
                        index === notifications.length - 1 && hasNextPage
                          ? lastNotificationsRef
                          : undefined
                      }
                    >
                      <p className="line-clamp-2 truncate text-wrap">
                        {description}
                      </p>
                      <p className="truncate text-sub-color1">{title}</p>
                      <p className="text-gray-500">
                        {formatRelativeOrShortDate(createdAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
          {isFetchingNextPage && <NotificationLoading />}
        </ul>
      </section>
    </article>
  );
};

export default NotificationList;

const NotificationLoading = () => {
  return Array.from({ length: NOTIFICATIONS_TAKE }, (_, index) => (
    <li
      key={index}
      className="flex flex-col gap-1 bg-sub-color1-transparent px-3 py-2"
    >
      <div className="h-4 w-full animate-pulse bg-gray-700" />
      <div className="h-4 w-full animate-pulse bg-gray-700" />
      <div className="h-4 w-16 animate-pulse bg-gray-700" />
    </li>
  ));
};
