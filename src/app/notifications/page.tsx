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
    '전체',
    '수강 클래스',
    '관심 클래스',
    '쿠폰/패스권',
    '읽지 않은 알림',
  ] as const;

  const instructorFilterOption = [
    '전체',
    '수강 클래스',
    '읽지 않은 알림',
  ] as const;

  const filterOption = user ? userFilterOption : instructorFilterOption;

  return (
    <main className="mx-auto mt-3 w-full max-w-[51.1rem]">
      <header className="flex items-center gap-1 border-b border-gray-500 px-[18px] py-3 sm:px-0">
        <BackButton />
        <h1 className="text-2xl font-semibold">알림</h1>
      </header>
      <nav className="flex flex-wrap gap-3 whitespace-nowrap border-b border-gray-500 px-[18px] py-2 text-sm sm:px-0 ">
        {filterOption.map((filter) => (
          <Link
            href={`/notifications?filterOption=${filter}`}
            replace={true}
            key={filter}
            className={`flex h-7 items-center rounded-md border border-solid border-sub-color1 px-3 ${
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
      <Suspense fallback={<NotificationsSectionLoading />}>
        <NotificationsSection filterOption={searchParamfilterOption} />
      </Suspense>
    </main>
  );
};

export default page;
