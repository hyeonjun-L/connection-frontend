import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import applyImg from '@/images/landing/learner/apply.png';
import { ANIMATION_VARIANTS } from '../../_utils/animationUtils';
import { H2 } from '../../_utils/style';

const ApplyClass = () => {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className="bg-main-color-transparent pt-11">
      <div className="mb-11 grid max-w-4xl grid-cols-1 items-center px-4 sm:mx-auto sm:w-fit sm:grid-cols-[max-content_1fr] sm:px-10">
        <div ref={ref} className="w-full max-w-96 space-y-16">
          <div className="flex h-40">
            <div className="w-1.5 overflow-hidden bg-gray-700">
              <motion.div
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={ANIMATION_VARIANTS}
                className="w-full bg-main-color"
              />
            </div>

            <div className="px-6">
              <p className="mb-5 text-4xl font-black text-main-color underline underline-offset-8">
                03
              </p>
              <h2 className={H2}>간편한 신청</h2>
              <span className="whitespace-pre-line break-keep text-base">
                원하는 클래스를 고른 후<br />
                간편 결제방식으로 10초만에 신청 완료!
              </span>
            </div>
          </div>
        </div>

        <figure className="flex justify-center sm:h-[440px]">
          <Image src={applyImg} alt="클래스 등록 Intro 이미지" width={600} />
        </figure>
      </div>
    </div>
  );
};

export default ApplyClass;
