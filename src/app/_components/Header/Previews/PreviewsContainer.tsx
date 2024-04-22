import { PanInfo, motion, useMotionValue, useTransform } from 'framer-motion';
import { NotificationType } from '@/types/notifications';

interface PreviewsContainerProps {
  layoutId: NotificationType;
  children: React.ReactNode;
  startTimer: () => void;
  stopTimer: () => void;
  onClick?: () => void;
  closePreviews: () => void;
}

const PreviewsContainer = ({
  layoutId,
  children,
  closePreviews,
  onClick,
  stopTimer,
  startTimer,
}: PreviewsContainerProps) => {
  const x = useMotionValue(0);

  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const handleDragEnd = (
    event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    if (Math.abs(info.offset.x) < -90 || Math.abs(info.offset.x) > 100) {
      closePreviews();
    }
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      className={`${
        layoutId === 'CHAT'
          ? 'right-0 grid grid-rows-[auto_1fr] sm:-right-20'
          : 'right-0 sm:-right-[7.5rem]'
      } absolute -bottom-36 h-[6.5rem] w-72 gap-y-2 rounded-md border border-solid border-main-color bg-white/90 p-3 backdrop-blur-3xl `}
      style={{ x, opacity }}
      drag="x"
      layoutId={layoutId}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.button>
  );
};

export default PreviewsContainer;
