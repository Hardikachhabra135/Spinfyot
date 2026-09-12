import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const PaperPlaneGeometry = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Vertices for a simple paper plane
    // 0: Nose
    // 1: Left Wing
    // 2: Right Wing
    // 3: Tail Center Bottom
    // 4: Tail Center Top
    const vertices = new Float32Array([
      // Left Wing
      0, 0, 1.5,      // Nose
      -1, 0.2, -1,    // Left Tip
      0, 0, -1,       // Center Top
      
      // Right Wing
      0, 0, 1.5,      // Nose
      0, 0, -1,       // Center Top
      1, 0.2, -1,     // Right Tip
      
      // Left Body Bottom
      0, 0, 1.5,      // Nose
      0, 0, -1,       // Center Top
      0, -0.5, -1,    // Center Bottom
      
      // Right Body Bottom
      0, 0, 1.5,      // Nose
      0, -0.5, -1,    // Center Bottom
      0, 0, -1,       // Center Top
    ]);
    
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return geometry;
};

const Plane = ({ prefersReducedMotion }) => {
  const meshRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (!prefersReducedMotion) {
      // Bobbing animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      
      // Mouse tracking
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, (state.pointer.y * Math.PI) / 4, 0.1);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, -(state.pointer.x * Math.PI) / 4, 0.1);
      
      meshRef.current.rotation.x = targetRotation.current.x;
      meshRef.current.rotation.y = targetRotation.current.y;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1; // Gentle roll
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <primitive object={PaperPlaneGeometry()} />
      <meshStandardMaterial color="#F3F1EA" side={THREE.DoubleSide} roughness={0.6} metalness={0.1} />
    </mesh>
  );
};

const PaperPlaneScene = ({ className = '' }) => {
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
    <div className={`absolute z-10 w-[400px] h-[400px] ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <React.Suspense fallback={null}>
          <Plane prefersReducedMotion={prefersReducedMotion} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default PaperPlaneScene;
