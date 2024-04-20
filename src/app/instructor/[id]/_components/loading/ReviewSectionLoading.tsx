import { StarSVG } from '@/icons/svg';
import ReviewLoadingContainer from '@/components/Review/ReviewLoading';

const ReviewSectionLoading = () => {
  return (
    <div className="relative mb-20 w-full scroll-mt-16">
      <div className="mb-4 flex w-full items-center">
        <div className="flex h-6 w-1/4 animate-pulse items-center bg-gray-700" />
        <div className="ml-3 hidden md:flex">
          {Array.from({ length: 5 }, (_, i) => (
            <StarSVG
              key={i}
              width={15}
              height={14}
              className="animate-pulse fill-gray-700"
            />
          ))}
        </div>
        <StarSVG
          width="15"
          height="14"
          className="ml-3 animate-pulse fill-gray-700 sm:block md:hidden"
        />
      </div>
      <ReviewLoadingContainer />
    </div>
  );
};

export default ReviewSectionLoading;
