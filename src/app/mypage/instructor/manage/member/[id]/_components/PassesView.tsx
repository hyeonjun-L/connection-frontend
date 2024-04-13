'use client';
import { useState } from 'react';
import MemberPass from './MemberPass';
import CarouselContainer from '@/components/Carousel/CarouselContainer';
import { GetMyMemberPassesData } from '@/types/instructor';

interface PassesViewProps {
  passes: GetMyMemberPassesData[];
}

const PassesView = ({ passes }: PassesViewProps) => {
  const [focus, setFocus] = useState(false);
  if (passes.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">보유 패스권 ({passes.length})</h2>
      {passes.length > 1 ? (
        <div
          className="relative sm:px-11"
          onMouseOver={() => setFocus(true)}
          onMouseLeave={() => setFocus(false)}
        >
          <CarouselContainer
            move={true}
            movePause={focus}
            priority={4}
            gap={16}
            showCurrentElement={false}
            mobileShowCurrentElement={false}
            itemStyle="w-64 py-3 sm:px-0"
            carouselContainerStyle="overflow-hidden sm:px-5"
          >
            {(passes.length < 4
              ? Array(Math.ceil(4 / passes.length))
                  .fill(passes)
                  .flat()
                  .slice(0, 4)
              : passes
            ).map((pass) => (
              <MemberPass key={pass.lecturePass.id} pass={pass} />
            ))}
          </CarouselContainer>
        </div>
      ) : (
        <div className="mt-3 w-64">
          <MemberPass pass={passes[0]} />
        </div>
      )}
    </div>
  );
};

export default PassesView;
