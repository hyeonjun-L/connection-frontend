import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import manageImg from '@/images/landing/instructor/manage.png';
import recruitImg from '@/images/landing/instructor/recruit.png';
import {
  ANIMATION_DURATION,
  ANIMATION_VARIANTS,
} from '../../_utils/animationUtils';
import { ACTIVE_SECTION_STYLE, H2 } from '../../_utils/style';

const RecruitSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [recruitImg, manageImg];
  const ref = useRef(null);
  const inView = useInView(ref);

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
    <div className="bg-main-color-transparent pt-11">
      <div className="grid grid-cols-1 items-center px-4 sm:mx-auto sm:w-fit sm:max-w-4xl sm:grid-cols-[max-content_1fr] sm:px-10">
        <div ref={ref} className="w-full space-y-4 sm:max-w-96 sm:space-y-16">
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
                03
              </p>
              <h2 className={H2}>수강생 모집</h2>
              <span className="whitespace-pre-line break-keep text-base">
                업로드 된 클래스 게시글을 통해 <br />
                본격적으로 수강생을 모집해요
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
                04
              </p>
              <h2 className={H2}>신청한 수강생 확인</h2>
              <span className="whitespace-pre-line break-keep text-base">
                강사만을 위한 대시보드 페이지에서
                <br />
                수강생을 확인하고 편리하게 관리해요
              </span>
            </div>
          </div>

          <figure className="flex items-center justify-center sm:hidden">
            <Image src={images[1]} alt="클래스 등록 Intro 이미지" width={390} />
          </figure>
        </div>

        <figure className="hidden h-[440px] justify-center sm:flex">
          <Image
            src={images[activeIndex]}
            alt="클래스 등록 Intro 이미지"
            width={600}
          />
        </figure>
      </div>
    </div>
  );
};

export default RecruitSection;
