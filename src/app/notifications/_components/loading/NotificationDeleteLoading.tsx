import { motion } from 'framer-motion';

const NotificationDeleteLoading = () => {
  const icon = {
    hidden: {
      pathLength: 0,
      fill: '#ffffff',
    },
    visible: {
      pathLength: 1,
      fill: 'var(--gray3)',
    },
  };

  return (
    <button className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 ">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 22 22"
        className="stroke-black"
      >
        <motion.path
          d="M12.375 10.1111V15.4444M8.625 10.1111V15.4444M4.875 6.55556V17.2222C4.875 17.6937 5.07254 18.1459 5.42417 18.4793C5.77581 18.8127 6.25272 19 6.75 19H14.25C14.7473 19 15.2242 18.8127 15.5758 18.4793C15.9275 18.1459 16.125 17.6937 16.125 17.2222V6.55556M3 6.55556H18M5.8125 6.55556L7.6875 3H13.3125L15.1875 6.55556"
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
    </button>
  );
};

export default NotificationDeleteLoading;
