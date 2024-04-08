import Image from 'next/image';
import CarouselContainer from '@/components/Carousel/CarouselContainer';

const InstructorCarousel = async ({ imgURL }: { imgURL: string[] }) => {
  return (
    <div className="mb-5 mt-3 flex h-[18rem] w-full justify-center px-5">
      {imgURL.length >= 2 ? (
        <CarouselContainer
          imgURL={imgURL}
          move={true}
          priority={3}
          showCurrentElementBackGround={false}
          itemStyle="size-full md:w-1/2 lg:w-1/3"
          carouselContainerStyle="size-full relative overflow-hidden"
          showCurrentElement={true}
        />
      ) : (
        <div
          key={imgURL[0]}
          className="relative h-full w-[18.875rem] sm:w-[28rem]"
        >
          <Image
            src={imgURL[0]}
            alt="Connection 댄스 춤 이미지"
            fill
            sizes="(max-width: 720px) 60vw, (max-width: 1440px) 30vw"
          />
        </div>
      )}
    </div>
  );
};

export default InstructorCarousel;
