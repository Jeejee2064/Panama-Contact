'use client';
import { motion } from 'framer-motion';

// Orchestrated parent/child reveal — same easing/timing language as FadeIn,
// but lets a group of children stagger off one shared viewport trigger
// instead of hand-rolling delay={i * 0.05} on each item.

const containerVariants = {
  hidden: {},
  show: (staggerChildren = 0.08) => ({
    transition: { staggerChildren, delayChildren: 0.04 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function StaggerContainer({ children, className = '', staggerChildren = 0.08, once = true }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      custom={staggerChildren}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
