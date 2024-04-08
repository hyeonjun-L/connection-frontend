'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CarouselContainer from '@/components/Carousel/CarouselContainer';
import ClassCard from '@/components/ClassPreview/ClassPreview';
import { searchBestInstructorData } from '@/types/instructor';

interface classMode {
  bestInstructorLists?: searchBestInstructorData[];
  bestClassList: any[];
  mode: 'class';
}

interface instructorMode {
  bestInstructorLists: searchBestInstructorData[];
  bestClassList?: any[];
  mode: 'instructor';
}
type ICarouselTemplateProps = classMode | instructorMode;

const CarouselTemplate = ({
  mode,
  bestClassList,
  bestInstructorLists,
}: ICarouselTemplateProps) => {
  const [focus, setFocus] = useState(false);
  const width =
    mode === 'class'
      ? 'w-[13rem]'
      : 'h-[4.75rem] w-[4.75rem] md:h-[9.375rem] md:w-[9.25rem]';
  const height = mode === 'class' ? 'h-[14rem]' : 'h-[4.75rem] md:h-[9.375rem]';
  const priority = mode === 'class' ? 6 : 8;

  const onFocus = () => {
    setFocus(true);
  };

  const offFocus = () => {
    setFocus(false);
  };

  return (
    <div
      className={`relative flex ${height} w-full justify-center px-2`}
      onMouseOver={onFocus}
      onMouseLeave={offFocus}
    >
      <CarouselContainer
        move={true}
        showCurrentElement={false}
        carouselMoveIntervalTime={3000}
        priority={priority}
        gap={16}
        movePause={focus}
        itemStyle={width}
        mobileShowCurrentElement={false}
        carouselContainerStyle="h-full w-11/12 items-center overflow-hidden"
      >
        {mode === 'class' && bestClassList
          ? bestClassList.map((classList, index) => {
              const data = { ...classList, smallView: true };
              return (
                <div
                  key={classList.title + index}
                  className="w-full max-w-[13rem]"
                >
                  <ClassCard
                    key={classList.title + index}
                    {...data}
                    touchEndEvent={offFocus}
                    touchStartEvent={onFocus}
                  />
                </div>
              );
            })
          : bestInstructorLists
          ? bestInstructorLists.map((list) => (
              <div key={list.id} className="h-full w-full">
                <Link
                  href={`/instructor/${list.id}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative flex-grow">
                    <Image
                      src={list.lecturerProfileImageUrl[0].url}
                      alt="Connection 댄스 춤 이미지"
                      fill
                      sizes="(max-width: 720px) 60vw, (max-width: 1440px) 30vw"
                      style={{ objectFit: 'cover' }}
                      priority={true}
                    />
                  </div>
                  <div className="flex h-6 items-center justify-center truncate bg-black text-sm text-white lg:h-8 lg:text-base lg:font-bold">
                    {list.nickname}
                  </div>
                </Link>
              </div>
            ))
          : null}
      </CarouselContainer>
    </div>
  );
};

export default CarouselTemplate;
