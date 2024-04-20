import { INCOME_HISTORY_TAKE } from '@/constants/constants';

const IncomeHistoryTableLoading = ({ take }: { take?: number }) => {
  return (
    <>
      <div className="my-5 flex justify-between">
        <div className="flex gap-5">
          <div className="h-7 w-10 animate-pulse bg-gray-700" />
          <div className="h-7 w-16 animate-pulse bg-gray-700" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-10 animate-pulse bg-gray-700" />
          <div className="h-7 w-20 animate-pulse bg-gray-700" />
        </div>
      </div>

      <div className="mt-3 h-10 w-full animate-pulse bg-gray-700" />
      <hr className="my-3 animate-pulse border-2 bg-gray-500" />
      <div className="mb-6 flex flex-col gap-2">
        {Array.from({ length: take ?? INCOME_HISTORY_TAKE }, (_, index) => (
          <div key={index} className="h-10 w-full animate-pulse bg-gray-700" />
        ))}
      </div>
    </>
  );
};

export default IncomeHistoryTableLoading;
