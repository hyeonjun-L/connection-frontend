import Link from 'next/link';

const NotificationList = () => {
  return (
    <article className="absolute right-0 top-[2.625rem] flex w-[17.188rem] flex-col bg-white text-sm shadow-vertical">
      <header className="flex items-center justify-between px-3 py-3">
        <h1 className="font-semibold">알림({3})</h1>
        <Link href="/notification" className="text-gray-500 hover:underline">
          전체보기
        </Link>
      </header>
      <section className="max-h-[16.75rem] overscroll-y-auto">
        <ul className="flex flex-col">
          <li className="bg-sub-color1-transparent px-3 py-2">
            <p className="line-clamp-2 truncate text-wrap">
              내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
            </p>
            <p className="truncate text-sub-color1">
              titletitletitletitletitletitletitletitletitletitle
            </p>
            <p className="text-gray-500">날짜</p>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default NotificationList;
