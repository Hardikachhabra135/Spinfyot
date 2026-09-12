import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for 3D tilt effect on cards.
 * Tracks mouse position relative to element and calculates rotateX/rotateY transforms.
 * Returns style object and event handlers.
 *
 * @param {Object} options
 * @param {number} options.maxTilt - Maximum tilt angle in degrees (default: 8)
 * @param {number} options.perspective - CSS perspective value in px (default: 1000)
 * @param {number} options.scale - Scale factor on hover (default: 1.02)
 * @param {boolean} options.disabled - Disable the effect (for touch devices, reduced motion)
 */
export default function useTiltEffect({
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  disabled = false,
} = {}) {
  const [tiltStyle, setTiltStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: 'transform 0.1s ease-out',
  });

  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles — reversed so card follows cursor
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: 'transform 0.1s ease-out',
      });
    },
    [disabled, maxTilt, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    });
  }, [perspective]);

  return {
    ref,
    tiltStyle: disabled
      ? { transform: 'none', transition: 'none' }
      : tiltStyle,
    tiltHandlers: disabled
      ? {}
      : {
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
        },
  };
}
