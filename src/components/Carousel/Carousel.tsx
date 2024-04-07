import Image from 'next/image';
import {
  useState,
  Children,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Arrow } from '@/icons/svg';
import { Props } from '@/types/cariusel';

interface CarouselProps extends Props {
  currentIndex: number;
  touchDistanceX: number;
  changeCurrentIndex: (index: number) => void;
}

const Carousel = ({
  imgURL,
  children,
  currentIndex,
  changeCurrentIndex,
  priority = 1,
  move,
  movePause,
  gap = 0,
  carouselMoveIntervalTime = 2000,
  gotoIndex,
  touchDistanceX,
  arrow = true,
  showCurrentElement = true,
  showCurrentElementBackGround = true,
}: CarouselProps) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(currentIndex);

  const childrenArray = Children.toArray(children);

  const originalElements = useMemo(
    () => (children ? [...childrenArray] : [...(imgURL || [])]),
    [children, childrenArray, imgURL],
  );

  const carouselElements = useMemo(() => {
    if (originalElements.length > 1) {
      const newElementArr = [...originalElements, originalElements[0]];
      newElementArr.shift();
      return [
        newElementArr.at(-1),
        ...newElementArr,
        ...newElementArr.slice(0, priority - 1),
      ];
    }
    return [...originalElements];
  }, [originalElements, priority]);

  const carouselLength = carouselElements.length;

  const loadedElementCount = useMemo(() => {
    const loadedCount = priority > 1 ? priority : 1;
    return move && loadedCount < carouselLength ? carouselLength : loadedCount;
  }, [carouselLength, move, priority]);

  const changeCarouselIndexHandler = useCallback(
    (index: number) => {
      let newIndex = index;
      const lastIndex = originalElements.length;
      const currentIndex = currentIndexRef.current;

      if (index < 0) {
        newIndex = lastIndex;
      } else if (index > lastIndex) {
        newIndex = 0;
      }

      currentIndexRef.current = newIndex;

      changeCurrentIndex(newIndex);

      setIsAnimating(Math.abs(currentIndex - newIndex) === 1);
    },
    [changeCurrentIndex, originalElements.length],
  );

  const changeImage = (
    event: React.MouseEvent,
    direction: 'BACKWARD' | 'FORWARD',
  ) => {
    event.stopPropagation();
    event.nativeEvent.preventDefault();

    const index =
      direction === 'FORWARD'
        ? currentIndex >= carouselLength - priority - 1
          ? 0
          : currentIndex + 1
        : currentIndex <= 0
        ? carouselLength - priority
        : currentIndex - 1;

    changeCarouselIndexHandler(index);
  };

  useEffect(() => {
    if (!move || movePause) {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      return;
    }

    intervalIdRef.current = setInterval(() => {
      changeCarouselIndexHandler(currentIndexRef.current + 1);
    }, carouselMoveIntervalTime);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [carouselMoveIntervalTime, changeCarouselIndexHandler, move, movePause]);

  useEffect(() => {
    if (gotoIndex === undefined) return;
    changeCarouselIndexHandler(gotoIndex);
  }, [gotoIndex]);

  return (
    <>
      <ul
        className={`flex h-full ${
          isAnimating && 'transition-transform duration-[1600ms] ease-out'
        }`}
        style={{
          transform: `translateX(${touchDistanceX + gap}px)`,
        }}
      >
        {carouselElements.slice(0, loadedElementCount).map((element, index) => (
          <li
            key={index}
            className={`relative h-full w-full flex-shrink-0 `}
            style={{ marginRight: `${gap}rem` }}
          >
            {children
              ? element
              : typeof element === 'string' && (
                  <Image
                    src={element}
                    alt="Connection 댄스 춤 이미지"
                    fill
                    sizes="(max-width: 720px) 60vw, (max-width: 1440px) 30vw"
                    priority={index < priority}
                    style={{ objectFit: 'cover' }}
                  />
                )}
          </li>
        ))}
      </ul>
      {showCurrentElement && (
        <div
          className={`absolute bottom-0 flex h-[10%] w-full items-center justify-center ${
            showCurrentElementBackGround && 'bg-black/[.5]'
          } `}
        >
          {originalElements.map((_, index) => (
            <span
              key={index}
              className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                index === 0 ||
                (currentIndex < originalElements.length &&
                  index <= currentIndex)
                  ? 'bg-white'
                  : 'bg-neutral-500'
              }`}
            />
          ))}
        </div>
      )}
      {arrow && carouselLength > 1 && (
        <>
          <Arrow
            onClick={(e: React.MouseEvent) => changeImage(e, 'BACKWARD')}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 -scale-x-100 transform cursor-pointer sm:block"
          />
          <Arrow
            onClick={(e: React.MouseEvent) => changeImage(e, 'FORWARD')}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 transform cursor-pointer sm:block"
          />
        </>
      )}
    </>
  );
};

export default Carousel;
