import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

const Button = ({
  variant = 'primary',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  showArrow = false,
  magnetic = false,
}) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic effect springs
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (!magnetic || !buttonRef.current || disabled) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
    const xPos = (clientX - (left + width / 2)) * 0.2; // 20% pull
    const yPos = (clientY - (top + height / 2)) * 0.2;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (magnetic) {
      x.set(0);
      y.set(0);
    }
  };

  const baseClasses = 'relative inline-flex items-center justify-center font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sfy-periwinkle focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-full px-6 py-3';
  
  const variants = {
    primary: 'bg-sfy-navy text-white hover:bg-sfy-navy/90',
    outline: 'bg-transparent border-2 border-sfy-navy text-sfy-navy hover:bg-sfy-blue-light/20',
  };

  const isLoading = disabled && type === 'submit';

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={magnetic ? { x, y } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex items-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {!isLoading && children}
        {showArrow && !isLoading && (
          <motion.span
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-current/10"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

export default Button;
