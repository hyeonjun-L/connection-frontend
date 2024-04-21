import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NOTIFICATIONS_TAKE } from '@/constants/constants';
import { getNotifications } from '@/lib/apis/serverApis/notifications';
import NotificationList from './_components/NotificationList';
import {
  IGetNotificationsData,
  INotifications,
  NotificationsFilterOption,
} from '@/types/notifications';
import { FetchError } from '@/types/types';

const page = async ({
  searchParams,
}: {
  searchParams: { filterOption: string };
}) => {
  const { filterOption: searchParamfilterOption } = searchParams;
  const filterOption = [
    '전체',
    '수강 클래스',
    '관심 클래스',
    '쿠폰/패스권',
    '읽지 않은 알림',
  ];

  const filterData = {
    pageSize: NOTIFICATIONS_TAKE,
    filterOption:
      (searchParamfilterOption as NotificationsFilterOption) ?? '전체',
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
    <main className="mx-auto mt-3 w-full max-w-[51.1rem]">
      <header className="border-b border-gray-500 py-3">
        <h1 className="text-2xl font-semibold">알림</h1>
      </header>
      <nav className="flex h-12 gap-3 border-b border-gray-500 py-2">
        {filterOption.map((filter) => (
          <Link
            href={`/notifications?filterOption=${filter}`}
            replace={true}
            key={filter}
            className={`flex items-center rounded-md border border-solid border-sub-color1 px-3 ${
              (!searchParamfilterOption && filter === '전체') ||
              searchParamfilterOption === filter
                ? 'bg-sub-color1 text-white'
                : 'bg-white text-sub-color1 hover:bg-sub-color1-transparent'
            }`}
          >
            {filter}
          </Link>
        ))}
      </nav>
      <NotificationList
        initalData={notifications}
        filterOption={filterData.filterOption}
      />
    </main>
  );
};

export default page;
