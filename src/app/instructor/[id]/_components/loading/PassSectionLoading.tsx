import CarouselContainer from '@/components/Carousel/CarouselContainer';
import PassLoading from '@/components/Pass/PassLoading';

const PassSectionLoading = () => {
  return (
    <div className="relative my-20 flex h-52 w-full justify-center">
      <CarouselContainer
        move={true}
        showCurrentElement={false}
        carouselMoveIntervalTime={3000}
        priority={3}
        gap={32}
        mobileShowCurrentElement={false}
        itemStyle="w-72 sm:w-80 h-full"
        carouselContainerStyle="flex h-full w-11/12 items-center overflow-hidden"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <PassLoading key={index} />
        ))}
      </CarouselContainer>
    </div>
  );
};

export default PassSectionLoading;
