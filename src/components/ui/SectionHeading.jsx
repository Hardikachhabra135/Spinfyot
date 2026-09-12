import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ children, color = 'navy', className = '', as = 'h2' }) => {
  const Component = motion.create(as);
  
  const colorClass = color === 'periwinkle' ? 'text-sfy-periwinkle' : 'text-sfy-navy';

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`font-display text-4xl md:text-5xl lg:text-6xl ${colorClass} ${className}`}
    >
      {children}
    </Component>
  );
};

export default SectionHeading;
