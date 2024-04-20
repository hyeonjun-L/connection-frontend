import React from 'react';
import {
  ChatSVG,
  InstagramSVG,
  LinkSVG,
  OptionSVG,
  StarSVG,
  YoutubeSVG,
} from '@/icons/svg';
import CarouselContainer from '@/components/Carousel/CarouselContainer';

const ProfileSectionLoading = () => {
  return (
    <>
      <div className="mb-5 mt-3 flex h-[18rem] w-full justify-center px-5">
        <CarouselContainer
          move={true}
          priority={3}
          gap={2}
          itemStyle="size-full md:w-1/2 lg:w-1/3"
          carouselContainerStyle="size-full relative overflow-hidden"
          showCurrentElementBackGround={false}
          showCurrentElement={false}
          mobileShowCurrentElement={false}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="size-full animate-pulse bg-gray-700" />
          ))}
        </CarouselContainer>
      </div>

      <div className="mx-auto flex w-full max-w-[51.1rem] flex-col items-center overflow-hidden px-5">
        <section className="flex w-full flex-col items-center">
          <div className="relative flex w-full flex-col items-center">
            <div className="box-border h-6 w-1/3 animate-pulse bg-gray-700" />
            <div className="absolute right-0 flex gap-3">
              <ChatSVG
                width="23"
                height="23"
                className="animate-pulse fill-gray-300"
              />
              <OptionSVG className="animate-pulse fill-gray-500" />
            </div>
            <div className="mb-4 mt-2 box-border flex h-4 gap-1 sm:pl-4">
              {Array.from({ length: 5 }, (_, index) => (
                <StarSVG
                  key={index}
                  className="size-3 animate-pulse fill-gray-500"
                />
              ))}
            </div>
            <div className="grid w-full animate-pulse grid-rows-6 gap-2 whitespace-nowrap border-t-2 border-solid border-gray-700 py-5 sm:w-[40rem] sm:grid-cols-2 sm:grid-rows-none">
              <div className="h-6 w-full animate-pulse bg-gray-700" />
              <div className="flex gap-1">
                <InstagramSVG className="animate-pulse fill-gray-500" />
                <div className="h-6 w-full animate-pulse bg-gray-700" />
              </div>
              <div className="h-6 w-full animate-pulse bg-gray-700" />
              <div className="flex gap-1">
                <YoutubeSVG className="animate-pulse stroke-gray-500 [&>*:nth-child(1)]:fill-gray-500" />
                <div className="h-6 w-full animate-pulse bg-gray-700" />
              </div>
              <div className="h-6 w-full animate-pulse bg-gray-700" />
              <div className="flex gap-1">
                <LinkSVG className="animate-pulse fill-gray-500" />
                <div className="h-6 w-full animate-pulse bg-gray-700" />
              </div>
            </div>
          </div>
        </section>
        <hr className="mb-2 h-[1px] w-screen animate-pulse bg-gray-500" />
        <div className="flex w-full sm:gap-2">
          <div className="h-96 w-1/3 animate-pulse bg-gray-500" />
          <div className="h-96 w-1/3 animate-pulse bg-gray-500" />
          <div className="h-96 w-1/3 animate-pulse bg-gray-500" />
        </div>
        <div className="mt-6 h-96 w-full animate-pulse bg-gray-500" />
        <div className="mt-6 h-96 w-full animate-pulse bg-gray-500" />
      </div>
    </>
  );
};

export default ProfileSectionLoading;
