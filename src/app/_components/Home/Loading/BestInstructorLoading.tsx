import CarouselContainer from '@/components/Carousel/CarouselContainer';

const BestInstructorLoading = () => (
  <div className="relative px-4 sm:px-9 xl:px-16">
    <CarouselContainer
      move={true}
      priority={10}
      gap={16}
      showCurrentElement={false}
      mobileShowCurrentElement={false}
      itemStyle="h-[4.75rem] w-[4.75rem] lg:h-[9.375rem] lg:w-[9.25rem]"
      carouselContainerStyle="h-full w-full items-center overflow-hidden"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="h-full w-full animate-pulse rounded-md bg-gray-700"
        />
      ))}
    </CarouselContainer>
  </div>
);

export default BestInstructorLoading;
