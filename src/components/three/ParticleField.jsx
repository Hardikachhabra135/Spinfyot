import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 200, prefersReducedMotion }) => {
  const pointsRef = useRef(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || prefersReducedMotion) return;
    
    // Slow drift
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#F3F1EA"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const ParticleField = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    checkMobile();
    setPrefersReducedMotion(motionQuery.matches);
    
    window.addEventListener('resize', checkMobile);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', motionListener);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Particles prefersReducedMotion={prefersReducedMotion} />
      </Canvas>
    </div>
  );
};

export default ParticleField;
