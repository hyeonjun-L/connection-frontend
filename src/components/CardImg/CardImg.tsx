import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Arrow } from '../../../public/icons/svg';

/**
 * CardImgProps Interface
 *
 * 사용법 1
 * <relative overflow-hidden 컨테이너>
 *  <이미지 크기 제어 컨테이너>
 *    <CardImg/>
 *  </이미지 크기 제어 컨테이너>
 * </ relative overflow-hidden 컨테이너>
 *
 * 사용법 2
 * <이미지 크기 제어 및 relative overflow-hidden>
 *   <CardImg/>
 * </ 이미지 크기 제어 및 relative overflow-hidden>
 *
 * @property {string[]} imgURL - 표시할 이미지들의 URL들이 담긴 배열
 * @property {boolean} move - 이미지 캐러셀 활성화
 * @property {boolean} [arrow=true] - 탐색을 위해 화살표를 표시해야 하는지 여부를 나타내는 선택적 플래그 (기본값 = true)
 * @property {boolean} [optimizationMode=true] - true => 이미지 한개만 미리 로드 move true 변경시 나머지 이미지 로드, false => 이미지 배열 전부를 로드 (기본값 = true)
 * @property {boolean} [showCurrentImage=true] - 현재 캐러셀 이미지 표시의 상태창 표시 여부를 나타내는 선택적 플래그 (기본값 = true)
 * @property {number} [gap=0] - 이미지 사이의 간격을 rem으로 지정하는 선택적 숫자 (기본값 = 0)
 */

interface CardImgProps {
  imgURL: string[];
  move: boolean;
  arrow?: boolean;
  optimizationMode?: boolean;
  showCurrentImage?: boolean;
  gap?: number;
}

const IMG_MOVE_INTERVAL_TIME = 2000;
const ARROW_WAIT_TIME = 2000;

let intervalId: NodeJS.Timeout | null = null;
let timeoutId: NodeJS.Timeout | null = null;

const CardImg = ({
  imgURL: originalImgURL,
  move,
  arrow = true,
  optimizationMode = true,
  showCurrentImage = true,
  gap = 0,
}: CardImgProps) => {
  const imgURL = [
    originalImgURL.at(-1),
    ...originalImgURL,
    ...originalImgURL.slice(0, 2),
  ];
  const imgLength = imgURL.length;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [loadedImagesCount, setLoadedImagesCount] = useState(
    optimizationMode ? 1 : imgLength,
  );
  const [isAnimating, setIsAnimating] = useState(true);

  if (move && loadedImagesCount < imgLength) {
    setLoadedImagesCount(imgLength);
  }

  const updateImageIndex = () => {
    setCurrentImgIndex((prev) => {
      if (prev + 1 === imgLength - 2) {
        setIsAnimating(false);
        return 0;
      } else if (prev === 0) {
        setIsAnimating(true);
        return prev + 1;
      } else {
        return prev + 1;
      }
    });
  };

  useEffect(() => {
    if (move && isAnimating) {
      if (optimizationMode) {
        updateImageIndex();
      }
      intervalId = setInterval(updateImageIndex, IMG_MOVE_INTERVAL_TIME);
    } else {
      setIsAnimating(false);
      setCurrentImgIndex(0);
      setTimeout(() => setIsAnimating(true), 100);
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [move, loadedImagesCount]);

  const changeImage = (direction: 'BACKWARD' | 'FORWARD') => {
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);

    setIsAnimating(false);
    setCurrentImgIndex((prev) =>
      direction === 'BACKWARD'
        ? prev === 0
          ? originalImgURL.length - 1
          : prev - 1
        : prev === originalImgURL.length - 1
        ? 0
        : prev + 1,
    );

    timeoutId = setTimeout(() => {
      setIsAnimating(true);
      intervalId = setInterval(updateImageIndex, IMG_MOVE_INTERVAL_TIME);
    }, ARROW_WAIT_TIME);
  };

  return (
    <div
      className="display: flex h-full"
      style={{
        gap: `${gap}rem`,
      }}
    >
      {imgURL.slice(0, loadedImagesCount).map((imgSrc, index) => (
        <picture
          key={index}
          className={`relative h-full w-full flex-shrink-0 ${
            isAnimating && 'transition-transform duration-[1600ms] ease-out'
          }`}
          style={{
            transform: `translateX(calc(-${100 * currentImgIndex}% - ${
              gap * currentImgIndex
            }rem)`,
          }}
        >
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="Connection 댄스 이미지"
              fill
              sizes="(max-width: 720px) 60vw, (max-width: 1440px) 30vw"
              priority={index === 0 || !optimizationMode}
            />
          )}
        </picture>
      ))}

      {showCurrentImage && (
        <div className="display: absolute bottom-0 flex h-[10%] w-full items-center justify-center bg-black/[.5]">
          {originalImgURL.map((_, index) => (
            <span
              key={index}
              className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                index === 0 ||
                (currentImgIndex < originalImgURL.length &&
                  index <= currentImgIndex)
                  ? 'bg-white'
                  : 'bg-neutral-500'
              }`}
            />
          ))}
        </div>
      )}

      {arrow && (
        <>
          <Arrow
            onClick={() => changeImage('BACKWARD')}
            className="absolute left-3 top-1/2 -translate-y-1/2 -scale-x-100 transform cursor-pointer"
          />
          <Arrow
            onClick={() => changeImage('FORWARD')}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
          />
        </>
      )}
    </div>
  );
};

export default CardImg;
