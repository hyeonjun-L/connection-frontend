'use client';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useUserStore } from '@/store';
import Carousel from './Carousel';
import { Props } from '@/types/cariusel';
/**
 * CarouselContainer Interface
 *
 *
 * @property {string} itemStyle - 아이템 요소 스타일
 * @property {string} carouselContainerStyle - 캐러셀 컨테이너 스타일
 * @property {string[]} imgURL - 표시할 이미지들의 URL들이 담긴 배열, children 우선 렌더
 * @property {React.ReactNode} children - 표시할 요소들, imgURL 보다 우선순위 높음
 * @property {boolean} move - 캐러셀 움직임 활성화
 * @property {boolean} [arrow=true] - 탐색을 위해 화살표를 표시해야 하는지 여부를 나타내는 선택적 플래그 (기본값 = true)
 * @property {boolean} [priority=1] - 해당 숫자 만큼 요소를 미리 렌더 (기본값 = 1)
 * @property {boolean} [showCurrentElement =true] - 현재 캐러셀 위치 표시의 상태창 표시 여부를 나타내는 선택적 플래그 (기본값 = true)
 * @property {boolean} [showCurrentElementBackGround =true] - 상태창 표시 배경 여부를 나타내는 선택적 플래그 (기본값 = true)
 * @property {number} [gap=0] - 캐러셀 요소 사이의 간격을 rem으로 지정하는 선택적 숫자 (기본값 = 0)
 * @property {number} [carouselMoveIntervalTime = 2000] - 캐러셀 움직이는 시간을 ms로 지정하는 선택적 숫자 (기본값 = 2000ms)
 * @property {number} [arrowPushMoveWaitTime = 2000] - Arrow를 누른 후 캐러셀 움직임을 멈추는 시간을 ms로 지정하는 선택적 숫자 (기본값 = 2000ms)
 * @property {boolean} [movePause = false] - 캐러셀의 움직임을 true 동안 일시정지 (기본값 = false)
 * @property {boolean} [gotoIndex = null] - 캐러셀의 인덱스를 변경 하는 선택적 플래그 (number)
 * @property {boolean} [focusAutoStop = true] - 캐러셀 초점시 캐러셀 움직임을 멈추게 하는 선택적 플래그 (boolean)
 */

interface CarouselContainerProps extends Props {
  itemStyle?: string;
  carouselContainerStyle?: string;
  mobileShowCurrentElement?: boolean;
  changeCarouselIndexEvent?: (value: number) => void;
  touchStartEvent?: () => void;
  touchMoveEvent?: () => void;
  touchEndEvent?: () => void;
}

const CarouselContainer = (props: CarouselContainerProps) => {
  const {
    move,
    imgURL,
    children,
    itemStyle,
    carouselContainerStyle,
    showCurrentElement,
    gap = 0,
    mobileShowCurrentElement = true,
    changeCarouselIndexEvent,
    touchStartEvent,
    touchMoveEvent,
    touchEndEvent,
  } = props;

  const { isMobile } = useUserStore((state) => ({
    isMobile: state.isMobile,
  }));

  const [isAnimating, setIsAnimating] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadPriority, setLoadPriority] = useState(false);

  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [touchDistanceX, setTouchDistanceX] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(true);
  const itemRef = useRef<HTMLDivElement>(null);

  const childrenArray = React.Children.toArray(children);
  const itemLength = Math.max(childrenArray.length, imgURL?.length ?? 0);

  const getItemWidth = () => itemRef.current?.clientWidth;

  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartEvent) {
      touchStartEvent();
    }
    if (itemLength === 1) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const startPosition = touch.clientX - touchDistanceX;

    setIsAnimating(false);
    setTouchStartPosition(startPosition);
    if (isFirstTouch) {
      setLoadPriority(true);
      setIsFirstTouch(false);
    }
  };

  const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchMoveEvent) {
      touchMoveEvent();
    }
    setLoadPriority(false);
    if (itemLength === 1) return;
    e.stopPropagation();
    const itemWidth = getItemWidth();
    if (itemWidth) {
      const totalWidth = itemWidth * itemLength;

      const touch = e.touches[0];
      const currentTouchPosition = touch.clientX;
      const distanceX = currentTouchPosition - touchStartPosition;

      const currentIndex =
        distanceX > 0
          ? itemLength - Math.round(Math.abs(distanceX) / itemWidth)
          : Math.round(Math.abs(distanceX) / itemWidth);

      setCarouselIndex(currentIndex > itemLength - 1 ? 0 : currentIndex);

      setTouchDistanceX(
        distanceX > 0
          ? -totalWidth
          : Math.abs(distanceX) > totalWidth
          ? 0
          : distanceX,
      );
    }
  };

  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchEndEvent) {
      touchEndEvent();
    }
    if (itemLength === 1) return;
    e.stopPropagation();
    const itemWidth = getItemWidth();
    if (itemWidth) {
      setTouchDistanceX(carouselIndex * -itemWidth - gap * carouselIndex || 0);
    }
  };

  const changeCarouselIndex = (index: number) => {
    setCarouselIndex(index);
    const itemWidth = getItemWidth();
    if (itemWidth) {
      setTouchDistanceX(index * -itemWidth - gap * index || 0);
    }
  };

  const changeisAnimating = (state: boolean) => {
    setIsAnimating(state);
  };

  useEffect(() => {
    if (changeCarouselIndexEvent) {
      changeCarouselIndexEvent(
        itemLength === carouselIndex ? 0 : carouselIndex,
      );
    }
  }, [carouselIndex, changeCarouselIndexEvent, itemLength]);

  return (
    <div
      className={carouselContainerStyle}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
    >
      <div ref={itemRef} className={itemStyle}>
        <Carousel
          {...props}
          move={move || loadPriority}
          gotoIndex={undefined}
          currentIndex={carouselIndex}
          changeCurrentIndex={changeCarouselIndex}
          touchDistanceX={touchDistanceX}
          showCurrentElement={
            showCurrentElement || (mobileShowCurrentElement && !!isMobile)
          }
          changeisAnimating={changeisAnimating}
          isAnimating={isAnimating}
        />
      </div>
    </div>
  );
};

export default CarouselContainer;
