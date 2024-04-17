import { REVIEW_TAKE } from '@/constants/constants';
import { LikeSVG, StarSVG } from '../../../public/icons/svg';

const ReviewLoadingContainer = () => {
  return Array.from({ length: REVIEW_TAKE }, (_, i) => (
    <ReviewLoading key={`L${i}`} />
  ));
};

export default ReviewLoadingContainer;

const ReviewLoading = () => {
  return (
    <div className="mb-3 w-full animate-pulse rounded-md border border-solid border-gray-700">
      <div className="flex w-full justify-between p-[0.8rem]">
        <div className="size-[34px] flex-shrink-0 animate-pulse rounded-full bg-gray-700" />
        <div className="ml-3 flex flex-col gap-1">
          <div className="h-6 w-16 animate-pulse bg-gray-700" />
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <StarSVG
                key={i}
                width={11}
                height={14}
                className="animate-pulse fill-gray-700"
              />
            ))}
          </div>
        </div>
        <div className="flex h-fit w-full flex-nowrap items-baseline justify-end">
          <div className="h-6 w-16 animate-pulse bg-gray-700" />
          <div className="ml-3 box-border h-6 w-16 animate-pulse rounded-md bg-gray-700" />
        </div>
      </div>

      <div className="mx-auto mb-2 h-6 w-11/12 animate-pulse bg-gray-700 px-[0.8rem]" />
      <div className="flex items-center justify-between border-t border-solid border-gray-700 p-[0.8rem]">
        <div className="h-6 w-16 animate-pulse bg-gray-700" />
        <div className="flex items-center gap-1">
          <LikeSVG
            width="15"
            height="14"
            className="animate-pulse fill-gray-700"
          />
          <div className="h-5 w-4 animate-pulse bg-gray-700" />
        </div>
      </div>
    </div>
  );
};
