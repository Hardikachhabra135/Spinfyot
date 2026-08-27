import { Star, Globe, Plane, GraduationCap, Award, Users } from 'lucide-react';
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Change direction if scrolling backwards
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap" style={{ letterSpacing: "-2px" }}>
      <motion.div className="font-display font-semibold uppercase text-[#F8F9FA]/10 text-[5rem] md:text-[8rem] flex whitespace-nowrap flex-nowrap items-center" style={{ x, fontFamily: '"Poppins", sans-serif' }}>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </motion.div>
    </div>
  );
}

function DecorativeSeparator() {
  return (
    <span className="inline-flex items-center justify-center mx-8 md:mx-12 opacity-30 text-[#F8F9FA]">
      <svg width="clamp(32px, 5vw, 64px)" height="clamp(32px, 5vw, 64px)" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
      </svg>
    </span>
  );
}

export default function ScrollingMarquee() {
  return (
    <section className="relative w-full py-12 md:py-24 bg-transparent overflow-hidden z-10 -mt-16 md:-mt-32 pointer-events-none">
      <ParallaxText baseVelocity={-1.5}>
        <span className="flex items-center">
          ADMISSIONS IN TOP 100 UNIVERSITIES <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><GraduationCap size={64} strokeWidth={2.5} /></span> 
          99% VISA SUCCESS RATE <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><Award size={64} strokeWidth={2.5} /></span> 
          GLOBAL ALUMNI NETWORK <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><Globe size={64} strokeWidth={2.5} /></span>
        </span>
      </ParallaxText>
      <ParallaxText baseVelocity={1.5}>
        <span className="flex items-center">
          TRUSTED BY 10,000+ STUDENTS <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><Users size={64} strokeWidth={2.5} /></span> 
          EXPERT IMMIGRATION ADVOCACY <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><Plane size={64} strokeWidth={2.5} /></span> 
          SCHOLARSHIP GUIDANCE <span className="mx-8 md:mx-12 text-[#F8F9FA]/20"><Star size={64} strokeWidth={2.5} /></span>
        </span>
      </ParallaxText>
    </section>
  );
}
