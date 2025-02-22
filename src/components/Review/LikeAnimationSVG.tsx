import { motion } from 'framer-motion';

const LikeAnimationSVG = ({ liked }: { liked: boolean }) => {
  const visibleFill = liked ? 'var(--gray5)' : 'var(--main-color-transparent)';
  const stroke = liked ? 'stroke-gray-500' : 'stroke-main-color';

  const icon = {
    hidden: {
      pathLength: 0,
      fill: '#ffffff',
    },
    visible: {
      pathLength: 1,
      fill: visibleFill,
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="14"
      viewBox="0 0 15 14"
      className={stroke}
    >
      <motion.path
        d="M9.18164 -0.0361817C9.94336 0.116162 10.4385 0.857373 10.2861 1.61909L10.2188 1.95308C10.0635 2.7353 9.77637 3.47944 9.375 4.1562H13.5938C14.3701 4.1562 15 4.78608 15 5.56245C15 6.10444 14.6924 6.57612 14.2412 6.8105C14.5605 7.06831 14.7656 7.46382 14.7656 7.9062C14.7656 8.59175 14.2734 9.16304 13.626 9.28608C13.7549 9.49995 13.8281 9.74897 13.8281 10.0156C13.8281 10.6396 13.4209 11.1699 12.8584 11.3515C12.8789 11.4482 12.8906 11.5507 12.8906 11.6562C12.8906 12.4326 12.2607 13.0625 11.4844 13.0625H8.62793C8.07129 13.0625 7.5293 12.8984 7.06641 12.5908L5.93848 11.8378C5.15625 11.3164 4.6875 10.4375 4.6875 9.49702V6.23921C4.6875 5.38374 5.07715 4.57808 5.74219 4.04194L5.95898 3.86909C6.73535 3.248 7.26562 2.37495 7.45898 1.40229L7.52637 1.06831C7.67871 0.306592 8.41992 -0.188525 9.18164 -0.0361817ZM0.9375 4.62495H2.8125C3.33105 4.62495 3.75 5.0439 3.75 5.56245V12.125C3.75 12.6435 3.33105 13.0625 2.8125 13.0625H0.9375C0.418945 13.0625 0 12.6435 0 12.125V5.56245C0 5.0439 0.418945 4.62495 0.9375 4.62495Z"
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: {
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          },
          fill: {
            duration: 2,
            ease: [1, 0, 0.8, 1],
            repeat: Infinity,
            repeatType: 'loop',
          },
        }}
      />
    </motion.svg>
  );
};

export default LikeAnimationSVG;
