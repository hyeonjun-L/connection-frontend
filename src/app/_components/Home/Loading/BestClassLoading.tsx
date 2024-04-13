import CarouselContainer from '@/components/Carousel/CarouselContainer';
import ClassPreviewLoading from '@/components/Loading/ClassPreviewLoading';

const BestClassLoading = () => (
  <div className="relative flex h-[14rem] w-full justify-center px-2">
    <CarouselContainer
      move={true}
      showCurrentElement={false}
      carouselMoveIntervalTime={3000}
      priority={6}
      gap={16}
      mobileShowCurrentElement={false}
      itemStyle="w-[13rem]"
      carouselContainerStyle="h-full w-11/12 items-center overflow-hidden"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="w-full max-w-[13rem] xl:max-w-[33.7rem]">
          <ClassPreviewLoading />
        </div>
      ))}
    </CarouselContainer>
  </div>
);

export default BestClassLoading;
