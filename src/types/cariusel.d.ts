export interface Props {
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
  children?: React.ReactNode;
  imgURL?: string[];
}
