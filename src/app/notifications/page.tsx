import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import BackButton from './_components/BackButton';
import NotificationsSectionLoading from './_components/loading/NotificationsSectionLoading';
import NotificationsSection from './_components/NotificationsSection';

const page = async ({
  searchParams,
}: {
  searchParams: { filterOption: string };
}) => {
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;
  const { filterOption: searchParamfilterOption } = searchParams;
  const userFilterOption = [
    { value: 'ALL', label: '전체' },
    { value: 'RESERVED', label: '수강 클래스' },
    { value: 'LIKED', label: '관심 클래스' },
    { value: 'COUPON_OR_PASS', label: '쿠폰/패스권' },
    { value: 'UNREAD', label: '읽지 않은 알림' },
  ] as const;

  const instructorFilterOption = [
    { value: 'ALL', label: '전체' },
    { value: 'RESERVED', label: '수강 클래스' },
    { value: 'UNREAD', label: '읽지 않은 알림' },
  ] as const;

  const filterOption = user ? userFilterOption : instructorFilterOption;

  return (
    <main className="mx-auto mt-3 w-full max-w-[51.1rem]">
      <header className="flex items-center gap-1 border-b border-gray-500 px-[18px] py-3 sm:px-0">
        <BackButton />
        <h1 className="text-2xl font-semibold">알림</h1>
      </header>
      <nav className="flex flex-wrap gap-3 whitespace-nowrap border-b border-gray-500 px-[18px] py-2 text-sm sm:px-0 ">
        {filterOption.map(({ value, label }) => (
          <Link
            href={`/notifications?filterOption=${value}`}
            replace={true}
            key={value}
            className={`flex h-7 items-center rounded-md border border-solid border-sub-color1 px-3 ${
              (!searchParamfilterOption && value === 'ALL') ||
              searchParamfilterOption === value
                ? 'bg-sub-color1 text-white'
                : 'bg-white text-sub-color1 hover:bg-sub-color1-transparent'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Suspense fallback={<NotificationsSectionLoading />}>
        <NotificationsSection filterOption={searchParamfilterOption} />
      </Suspense>
    </main>
  );
};

export default page;
