'use client';
import Link from 'next/link';
import { useState } from 'react';
import { DoubleRightSVG, ConnectionLogoSVG, ClickSVG } from '@/icons/svg';
import Instructor from './_components/Instructor';
import Learner from './_components/Learner';
import { USER_TYPE_BUTTON_STYLE } from './_utils/style';

const LadingPage = () => {
  const [userType, setUserType] = useState(0);

  return (
    <main className="flex cursor-default flex-col justify-center">
      <figure className="landing">
        <Link
          href="/"
          className="mb-36 flex flex-col items-center justify-center sm:mb-28"
        >
          <span className="text-center text-base font-bold sm:text-lg">
            댄스 클래스를 빠르게 찾는 연결고리
          </span>
          <ConnectionLogoSVG className="mt-4 w-72 sm:w-80" />
        </Link>
      </figure>

      <div className="mb-6 flex h-12 justify-center gap-x-4 px-4 sm:mb-11">
        <button
          onClick={() => setUserType(0)}
          className={
            userType === 0
              ? USER_TYPE_BUTTON_STYLE.active
              : USER_TYPE_BUTTON_STYLE.default
          }
        >
          댄스 강사
          {userType === 0 && <ClickSVG className="absolute -right-9 -top-6" />}
        </button>
        <button
          onClick={() => setUserType(1)}
          className={
            userType === 1
              ? USER_TYPE_BUTTON_STYLE.active
              : USER_TYPE_BUTTON_STYLE.default
          }
        >
          수강생
          {userType === 1 && <ClickSVG className="absolute -right-9 -top-6" />}
        </button>
      </div>
      <div className="mx-auto mb-4 w-fit animate-slow-bounce">
        <DoubleRightSVG
          width={58}
          height={65}
          className="rotate-90 fill-main-color"
        />
      </div>
      <h1 className="mb-14 text-center text-2xl font-bold sm:text-4xl">
        {userType === 0 ? (
          <>
            클래스를 등록하고
            <br className="sm:hidden" />
            수강생을 모집해보세요!
          </>
        ) : (
          <>
            다양한 클래스를 탐색하고
            <br className="sm:hidden" />
            신청해보세요!
          </>
        )}
      </h1>
      {userType === 0 ? <Instructor /> : <Learner />}
      <Link
        href="/"
        className="mx-4 mb-40 mt-12 flex justify-center whitespace-nowrap rounded-full border-2 border-main-color py-2 text-xl font-bold text-main-color hover:bg-main-color-transparent sm:mx-auto sm:px-36 sm:text-2xl"
      >
        커넥션 시작하기
      </Link>
    </main>
  );
};

export default LadingPage;
