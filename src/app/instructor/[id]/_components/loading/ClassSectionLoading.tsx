import React from 'react';
import CarouselContainer from '@/components/Carousel/CarouselContainer';
import ClassPreviewLoading from '@/components/Loading/ClassPreviewLoading';

const ClassSectionLoading = () => (
  <div className="relative flex h-60 w-full justify-center ">
    <CarouselContainer
      move={true}
      showCurrentElement={false}
      carouselMoveIntervalTime={3000}
      priority={3}
      gap={32}
      mobileShowCurrentElement={false}
      itemStyle="w-[13rem]"
      carouselContainerStyle="flex h-full w-11/12 items-center overflow-hidden"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="w-full max-w-[13rem] xl:max-w-[33.7rem]">
          <ClassPreviewLoading />
        </div>
      ))}
    </CarouselContainer>
  </div>
);

export default ClassSectionLoading;
