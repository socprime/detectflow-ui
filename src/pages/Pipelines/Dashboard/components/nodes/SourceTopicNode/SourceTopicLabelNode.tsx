import { motion } from 'motion/react';

export const SourceTopicLabelNode = () => {
  return (
    <motion.div
      className="px-4 py-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-light-blue text-2xs tracking-wider uppercase">Source Topics</div>
    </motion.div>
  );
};
