import { LECTURE_COUPON_TAKE } from '@/constants/constants';

const PassLoading = () => {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4 pb-4 sm:justify-normal">
      {Array.from({ length: LECTURE_COUPON_TAKE }, (_, index) => (
        <div
          key={index}
          className="h-40 w-[20.5rem] animate-pulse bg-gray-700 sm:w-[18.125rem]"
        />
      ))}
    </div>
  );
};

export default PassLoading;
