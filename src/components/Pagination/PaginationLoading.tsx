import { ArrowRightSVG } from '@/icons/svg';

const PaginationLoading = () => {
  return (
    <div className="flex w-full justify-center gap-[1.37rem] p-[10px]">
      <div className="flex animate-pulse select-none items-center gap-1 stroke-gray-500 text-gray-500">
        <ArrowRightSVG className="mb-px h-[15px] w-[9px] rotate-180 " />
        이전
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="h-full w-6 animate-pulse rounded-full bg-gray-700"
        />
      ))}
      <div className="flex animate-pulse select-none items-center gap-1 stroke-gray-500 text-gray-500">
        다음
        <ArrowRightSVG className="h-[15px] w-[9px]" />
      </div>
    </div>
  );
};

export default PaginationLoading;
