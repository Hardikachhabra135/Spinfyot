import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CloudTrail = () => {
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev => {
        const newClouds = [...prev, { id: Date.now(), top: Math.random() * 30 - 15 }];
        if (newClouds.length > 12) return newClouds.slice(newClouds.length - 12);
        return newClouds;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-[-5%] md:left-[5%] top-[55%] -translate-y-1/2 w-[150px] h-[80px] z-10 pointer-events-none">
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          initial={{ opacity: 0.8, scale: 0.2, x: 50, y: cloud.top }}
          animate={{ opacity: 0, scale: 3, x: -150, y: cloud.top + (Math.random() * 40 - 20) }}
          transition={{ duration: 4, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 w-8 h-8 bg-white rounded-full mix-blend-screen"
          style={{ filter: 'blur(10px)' }}
        />
      ))}
    </div>
  );
};

export default CloudTrail;
