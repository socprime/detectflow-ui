import { motion } from 'motion/react';

export const RepositoryLabelNode = () => {
  return (
    <motion.div
      className="px-4 py-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="text-success text-2xs tracking-wider uppercase">Repositories</div>
    </motion.div>
  );
};
