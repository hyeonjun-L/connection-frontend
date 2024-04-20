import { TrashcanSVG } from '@/icons/svg';

const NotificationItem = () => {
  return (
    <li className="w-full rounded-md bg-white px-4 py-3 shadow-float">
      <dl>
        <div className="mb-2 flex w-full items-center justify-between gap-3">
          <div className="grid grid-cols-[auto_auto] gap-x-3 text-sm">
            <dt className="truncate font-semibold">제목제</dt>
            <dd className="text-gray-300">7시간 전</dd>
          </div>
          <button className="group flex size-7 flex-shrink-0 items-center justify-center rounded-full shadow-vertical">
            <TrashcanSVG className="size-5 stroke-gray-300 stroke-2 group-hover:stroke-sub-color1" />
          </button>
        </div>
        <dd>
          내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
        </dd>
      </dl>
    </li>
  );
};

export default NotificationItem;
