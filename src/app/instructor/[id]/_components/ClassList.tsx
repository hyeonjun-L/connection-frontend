'use client';
import { useState } from 'react';
import CarouselContainer from '@/components/Carousel/CarouselContainer';
import ClassCard from '@/components/ClassPreview/ClassPreview';
import { ClassCardType } from '@/types/class';

const ClassList = ({ classList }: { classList: ClassCardType[] }) => {
  const [focus, setFocus] = useState(false);

  const onFocus = () => {
    setFocus(true);
  };

  const offFocus = () => {
    setFocus(false);
  };

  return (
    <div
      className={`relative flex h-60 justify-center ${
        classList.length > 1
          ? 'w-full'
          : 'w-2/3 items-center rounded-lg shadow-horizontal xl:shadow-none'
      }`}
      onMouseOver={onFocus}
      onMouseLeave={offFocus}
    >
      {classList.length > 1 ? (
        <CarouselContainer
          move={true}
          showCurrentElement={false}
          carouselMoveIntervalTime={3000}
          priority={3}
          gap={32}
          movePause={focus}
          mobileShowCurrentElement={false}
          itemStyle="w-[13rem]"
          carouselContainerStyle="flex h-full w-11/12 items-center overflow-hidden"
        >
          {classList.map((state) => {
            return (
              <div key={state.id}>
                <ClassCard
                  {...state}
                  smallView={true}
                  touchEndEvent={offFocus}
                  touchStartEvent={onFocus}
                />
              </div>
            );
          })}
        </CarouselContainer>
      ) : (
        <ClassCard {...classList[0]} />
      )}
    </div>
  );
};

export default ClassList;
