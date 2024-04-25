export const ANIMATION_DURATION = 3.5;

export const BAR_HEIGHT = 160;

export const ANIMATION_VARIANTS = {
  hidden: { height: 0 },
  visible: {
    height: `${BAR_HEIGHT}px`,
    transition: {
      duration: 3.5,
      ease: 'easeInOut',
    },
  },
};
