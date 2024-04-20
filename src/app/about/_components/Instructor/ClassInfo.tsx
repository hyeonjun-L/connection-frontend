import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import passImg from '@/images/landing/instructor/pass.png';
import registerImg from '@/images/landing/instructor/register.png';
import {
  ANIMATION_DURATION,
  ANIMATION_VARIANTS,
} from '../../_utils/animationUtils';
import { ACTIVE_SECTION_STYLE, H2 } from '../../_utils/style';

const ClassSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);
  const images = [registerImg, passImg];

  useEffect(() => {
    if (inView) {
      setActiveIndex(0);
      const timer = setTimeout(() => {
        setActiveIndex(1);
      }, ANIMATION_DURATION * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView]);

  const handleSetActiveIndex = (index: number) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  return (
    <div
      ref={ref}
      className="mb-11 grid max-w-4xl grid-cols-1 items-center px-4 sm:mx-auto sm:w-fit sm:grid-cols-[max-content_1fr] sm:px-10"
    >
      <div className="w-full space-y-4 sm:max-w-96 sm:space-y-16">
        <div className="flex h-40" onClick={() => handleSetActiveIndex(0)}>
          <div className="w-1.5 overflow-hidden bg-gray-700">
            {activeIndex === 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={ANIMATION_VARIANTS}
                className="w-full bg-main-color"
              />
            )}
          </div>

          <div className="px-6">
            <p
              className={
                activeIndex === 0
                  ? ACTIVE_SECTION_STYLE.active
                  : ACTIVE_SECTION_STYLE.default
              }
            >
              01
            </p>
            <h2 className={H2}>댄스 클래스 등록</h2>
            <span className="whitespace-pre-line break-keep text-base">
              커리큘럼, 가격 등 5가지 단계를 거쳐 <br />
              운영하고 싶은 클래스를 등록해주세요
            </span>
          </div>
        </div>

        <figure className="flex items-center justify-center sm:hidden">
          <Image src={images[0]} alt="클래스 등록 Intro 이미지" width={390} />
        </figure>

        <div className="flex h-40" onClick={() => handleSetActiveIndex(1)}>
          <div className="w-1.5 overflow-hidden bg-gray-700">
            {activeIndex === 1 && (
              <motion.div
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={ANIMATION_VARIANTS}
                className="w-full bg-main-color"
              />
            )}
          </div>

          <div className="px-6">
            <p
              className={
                activeIndex === 1
                  ? ACTIVE_SECTION_STYLE.active
                  : ACTIVE_SECTION_STYLE.default
              }
            >
              02
            </p>
            <h2 className={H2}>나만의 패스권, 쿠폰 생성</h2>
            <span className="whitespace-pre-line break-keep text-base">
              패스권, 쿠폰을 통해 더 많은 수강생이 <br />
              수업을 신청할 수 있도록 독려해보세요
            </span>
          </div>
        </div>

        <figure className="flex items-center justify-center sm:hidden">
          <Image src={images[1]} alt="클래스 등록 Intro 이미지" width={390} />
        </figure>
      </div>

      <figure className="hidden h-[430px] items-center sm:flex">
        <Image
          src={images[activeIndex]}
          alt="클래스 등록 Intro 이미지"
          width={600}
        />
      </figure>
    </div>
  );
};

export default ClassSection;
