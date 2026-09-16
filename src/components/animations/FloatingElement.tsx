import React from 'react';
import { motion } from 'motion/react';

interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  duration = 5,
  distance = 10,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
