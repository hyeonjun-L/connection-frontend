import Link from 'next/link';
import { NOTIFICATIONS_TAKE } from '@/constants/constants';
import { getNotifications } from '@/lib/apis/serverApis/notifications';
import NotificationList from './_components/NotificationList';
import {
  INotifications,
  NotificationsFilterOption,
} from '@/types/notifications';

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

  let notifications: INotifications[] = [];

  try {
    notifications = await getNotifications(filterData);
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="mx-auto mt-3 w-full max-w-[51.1rem]">
      <header className="border-b border-gray-500 py-3">
        <h1 className="text-2xl font-semibold">알림</h1>
      </header>
      <nav className="flex h-12 gap-3 border-b border-gray-500 py-2">
        {filterOption.map((filter) => (
          <Link
            href="/"
            key={filter}
            className="flex items-center rounded-md border border-solid border-sub-color1 bg-white px-3 text-sub-color1 hover:bg-sub-color1-transparent"
          >
            {filter}
          </Link>
        ))}
      </nav>
      <NotificationList notificationsList={notifications} />
    </main>
  );
};

export default page;
