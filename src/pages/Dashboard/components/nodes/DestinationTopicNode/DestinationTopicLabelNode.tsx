import { motion } from 'motion/react';

export const DestinationTopicLabelNode = () => {
  return (
    <motion.div
      className="px-4 py-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
    >
      <div className="text-purple text-2xs tracking-wider uppercase">Destination Topics</div>
    </motion.div>
  );
};
