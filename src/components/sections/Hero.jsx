import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import FoldText from '../ui/FoldText';
import SpecularButton from '../ui/SpecularButton';

const customEase = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1, delay: 0.2 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: customEase }
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: customEase, delay: 0.5 }
  },
};

const travelerVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 1.5, ease: customEase, delay: 0.7 }
  },
};

// Extremely subtle, sparse particles for premium atmospheric depth
const Particles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-[#99B6F5] rounded-full opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function Hero({ onBookCounselling }) {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Smooth scroll values for parallax layers
  const smoothScrollY = useSpring(scrollY, { damping: 25, stiffness: 100 });
  
  // Parallax transforms
  const textY = useTransform(smoothScrollY, [0, 800], [0, -80]);
  const textOpacity = useTransform(smoothScrollY, [0, 500], [1, 0]);
  
  const travelerY = useTransform(smoothScrollY, [0, 800], [0, 40]); // Slower parallax
  const pathY = useTransform(smoothScrollY, [0, 800], [0, -40]); // Subtle parallax
  const airplaneX = useTransform(smoothScrollY, [0, 800], [0, -600]); // Flies LEFT on scroll dramatically
  const airplaneY = useTransform(smoothScrollY, [0, 800], [0, -100]); // Flies LEFT mostly

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[130vh] bg-transparent flex flex-col items-center overflow-hidden"
    >
      {/* Background Gradient & Glow */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#081220] to-[#000000] z-0"
        style={{ opacity: useTransform(scrollY, [0, 800], [1, 0.5]) }}
      />
      
      {/* Very subtle radial depth light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-[#173B63] rounded-full blur-[200px] opacity-[0.15] z-0 pointer-events-none" />

      <Particles />

      {/* THEMATIC DECORATIVE LAYER (Passport/Visa/Boarding Pass Motifs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Visa Stamp 1 - UK */}
        <div className="absolute top-[15%] right-[10%] opacity-[0.08] rotate-[15deg]">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#99B6F5" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#99B6F5" strokeWidth="1" />
            <text x="50" y="42" fontFamily="monospace" fontSize="12" fill="#99B6F5" textAnchor="middle" letterSpacing="1">ENTRY CLEARANCE</text>
            <text x="50" y="65" fontFamily="sans-serif" fontSize="22" fill="#E57A44" textAnchor="middle" fontWeight="bold">UK</text>
            <path d="M 25,75 L 75,75" stroke="#99B6F5" strokeWidth="1" />
          </svg>
        </div>

        {/* Visa Stamp 2 - YYZ */}
        <div className="absolute bottom-[20%] left-[5%] opacity-[0.06] -rotate-[10deg]">
          <svg width="160" height="160" viewBox="0 0 100 100">
            <rect x="10" y="20" width="80" height="60" rx="4" fill="none" stroke="#99B6F5" strokeWidth="2" />
            <text x="50" y="40" fontFamily="sans-serif" fontSize="10" fill="#99B6F5" textAnchor="middle" letterSpacing="2">ADMITTED</text>
            <text x="50" y="60" fontFamily="monospace" fontSize="16" fill="#E57A44" textAnchor="middle" fontWeight="bold">YYZ</text>
            <text x="50" y="72" fontFamily="monospace" fontSize="8" fill="#99B6F5" textAnchor="middle">24 OCT 2026</text>
          </svg>
        </div>
        
        {/* Visa Stamp 3 - AUS */}
        <div className="absolute top-[50%] right-[30%] opacity-[0.04] rotate-[30deg]">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E57A44" strokeWidth="3" />
            <text x="50" y="55" fontFamily="sans-serif" fontSize="18" fill="#99B6F5" textAnchor="middle" fontWeight="900">AUS</text>
          </svg>
        </div>

        
        {/* Boarding Pass Watermark */}
        <div className="absolute top-[35%] left-[15%] opacity-[0.03] -rotate-[5deg] scale-[1.2] md:scale-150 origin-center">
          <svg width="400" height="150" viewBox="0 0 400 150">
            <path d="M 0,20 Q 0,0 20,0 L 280,0 Q 290,0 290,10 A 10,10 0 0,0 310,10 Q 310,0 320,0 L 380,0 Q 400,0 400,20 L 400,130 Q 400,150 380,150 L 320,150 Q 310,150 310,140 A 10,10 0 0,0 290,140 Q 290,150 280,150 L 20,150 Q 0,150 0,130 Z" fill="none" stroke="#F8F9FA" strokeWidth="2" />
            <line x1="300" y1="20" x2="300" y2="130" stroke="#F8F9FA" strokeWidth="1" strokeDasharray="4 4" />
            {/* Barcode lines */}
            <rect x="40" y="40" width="4" height="40" fill="#F8F9FA" />
            <rect x="48" y="40" width="8" height="40" fill="#F8F9FA" />
            <rect x="60" y="40" width="2" height="40" fill="#F8F9FA" />
            <rect x="66" y="40" width="10" height="40" fill="#F8F9FA" />
            <rect x="80" y="40" width="4" height="40" fill="#F8F9FA" />
            <rect x="88" y="40" width="2" height="40" fill="#F8F9FA" />
            <text x="40" y="100" fontFamily="monospace" fontSize="12" fill="#F8F9FA">BOARDING PASS &bull; FLIGHT SP-782</text>
            <text x="40" y="120" fontFamily="monospace" fontSize="24" fill="#F8F9FA" fontWeight="bold">DEL &rarr; JFK</text>
          </svg>
        </div>
      </div>


      {/* Sticky Container for Hero Content */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center z-20 pt-20 pb-10">
        
        {/* Main max-width grid container for perfect balance */}
        <div className="w-full max-w-[1250px] mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center justify-between relative">
          
          
          {/* Subtle Journey Path connecting the text and traveler */}
            <motion.div 
              className="absolute left-0 top-[45%] md:top-[50%] w-[120%] -translate-y-1/2 pointer-events-none z-10 opacity-20 md:opacity-30"
              style={{ y: pathY, opacity: textOpacity }}
            >
              <svg viewBox="0 0 1200 400" className="w-full h-auto" fill="none">
                <path 
                  d="M -100,250 C 300,100 700,350 1300,150" 
                  stroke="#99B6F5" 
                  strokeWidth="1.5" 
                  strokeDasharray="6 12" 
                />
                {/* Thematic Flight Waypoints */}
                <circle cx="100" cy="180" r="3" fill="#E57A44" stroke="#050B14" strokeWidth="2" />
                <circle cx="450" cy="205" r="3.5" fill="#E57A44" stroke="#050B14" strokeWidth="2" />
                <circle cx="850" cy="275" r="4" fill="#E57A44" stroke="#050B14" strokeWidth="2" />
                <circle cx="1150" cy="185" r="3" fill="#E57A44" stroke="#050B14" strokeWidth="2" />
              </svg>
            </motion.div>
  
            {/* Premium Realistic Airplane flying left */}
            <motion.div 
              className="absolute z-30"
              style={{ 
                x: airplaneX, 
                y: airplaneY, 
                opacity: textOpacity,
                left: '5%',
                top: '15%',
                rotate: -155, // Point it almost directly left
                scaleX: -1
              }}
              animate={{ 
                y: [0, -12, 0], 
                rotate: [-155, -158, -155] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <img 
                src="/assets/images/airplane-real.png" 
                alt="Airplane" 
                className="w-32 md:w-56 object-contain drop-shadow-[0_15px_30px_rgba(153,182,245,0.5)]"
              />
            </motion.div>

            {/* Left Content: Headline & CTA */}
          <motion.div 
            className="relative z-30 w-full md:w-[65%] lg:w-[70%] flex flex-col items-start text-left pt-10 md:pt-0"
            style={{ y: textY, opacity: textOpacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-display text-[3.25rem] sm:text-6xl md:text-[5.5rem] lg:text-[7rem] leading-[1.05] drop-shadow-lg flex flex-col gap-1 md:gap-2 mb-0">
              <span className="block text-[#F8F9FA]">
                <FoldText 
                  text="Your Journey Abroad" 
                  splitBy="word"
                  hinge="top"
                  trigger="scroll"
                  duration={1.2}
                  stagger={0.05}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.55}
                  fontSize="inherit"
                  fontWeight="inherit"
                  color="inherit"
                />
              </span>
              <span className="block text-[#99B6F5]">
                <FoldText 
                  text="Begins Here!" 
                  splitBy="word"
                  hinge="bottom"
                  trigger="scroll"
                  duration={1.2}
                  stagger={0.05}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.55}
                  fontSize="inherit"
                  fontWeight="inherit"
                  color="inherit"
                />
              </span>
            </h1>

            {/* Premium Uiverse Animated CTA - Positioned perfectly 2cm below heading */}
            <motion.div variants={ctaVariants} className="absolute left-0 -bottom-[100px] md:-bottom-[140px] w-full flex justify-center md:justify-start">
              <div className="flex flex-col items-center mt-[72px]">
                <SpecularButton
                  size="lg"
                  radius={18}
                  tint="#ffffff"
                  tintOpacity={0}
                  blur={0}
                  textColor="#f5f5f5"
                  lineColor="#ffffff"
                  baseColor="#173B63"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={onBookCounselling}
                  className="min-w-[320px] shadow-2xl"
                >
                  BOOK FREE COUNSELING
                </SpecularButton>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content: Traveler */}
          <motion.div 
            className="absolute bottom-0 right-[-10%] md:right-0 md:relative w-[80%] md:w-[45%] h-[60%] md:h-full flex items-end justify-end z-20 pointer-events-none"
            style={{ y: travelerY }}
            variants={travelerVariants}
            initial="hidden"
            animate="visible"
          >
            
            
            <div className="relative w-full h-full flex items-end justify-end">
              <motion.img 
                src="/assets/images/female-traveler.png" 
                alt="Student Traveler" 
                className="w-full h-auto max-h-full max-w-[650px] object-contain object-bottom drop-shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                style={{ maskImage: 'linear-gradient(to top, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* APPROVED Badge near hand/passport */}
              
            </div>
          </motion.div>

        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ opacity: textOpacity }}
        >
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#F8F9FA]/40 uppercase">Scroll</span>
          <div className="w-[1px] h-8 md:h-12 bg-white/10 relative overflow-hidden">
            <motion.div 
              className="w-full h-1/2 bg-[#99B6F5]"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </motion.div>

      </div>

      {/* Bottom transition blend & Premium Subtext */}
      <div className="absolute bottom-0 w-full pt-32 pb-12 px-6 z-20 flex justify-center bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center gap-3"
        >
          
          <p className="font-body text-[#8A9EBD] text-center text-[11px] md:text-[13px] font-medium tracking-[0.3em] uppercase max-w-[800px] leading-relaxed">
            We help students get into <span className="text-white font-bold">top universities abroad</span><br className="hidden md:block"/> from shortlisting to visa
          </p>
        </motion.div>
      </div>

    </section>
  );
}
