interface Props {
  move: boolean;
  arrow?: boolean;
  priority?: number;
  showCurrentElement?: boolean;
  showCurrentElementBackGround?: boolean;
  gap?: number;
  carouselMoveIntervalTime?: number;
  arrowPushMoveWaitTime?: number;
  movePause?: boolean;
  focusAutoStop?: boolean;
  gotoIndex?: number;
  itemStyle?: string;
  carouselContainerStyle?: string;
}

interface ChildrenProps extends Props {
  children: React.ReactNode;
  imgURL?: string[];
}

interface ImgURLProps extends Props {
  imgURL: string[];
  children?: React.ReactNode;
}

export type CarouselProps = ChildrenProps | ImgURLProps;
