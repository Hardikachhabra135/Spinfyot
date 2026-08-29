import React, { useRef, useContext, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import FoldText from '../ui/FoldText';
import SpecularButton from '../ui/SpecularButton';
import { ReducedMotionContext } from '../../context/ReducedMotionContext';

const customEase = [0.22, 1, 0.36, 1];

// ─── Animation Variants ─────────────────────────────────────────────────────

// Container that staggers children
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: customEase },
  },
};

const ctaVariant = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: customEase, delay: 0.55 },
  },
};

// Traveler slides in from right
const travelerVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.4, ease: customEase, delay: 0.5 },
  },
};

// Airplane flies in from top-right, following a subtle arc
const airplaneEntryVariant = {
  hidden: {
    opacity: 0,
    x: 280,
    y: -160,
    rotate: -148,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: -155,
    transition: {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1], // expo-like ease for cinematic feel
      delay: 0.1,
    },
  },
};

// Decorative elements gently fade in
const decalVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.8, ease: 'easeOut', delay: 0.8 },
  },
};

// ─── Particles ───────────────────────────────────────────────────────────────
const PARTICLE_DATA = [...Array(15)].map((_, i) => ({
  id: i,
  top: `${(i * 7.3 + 11) % 100}%`,
  left: `${(i * 13.7 + 5) % 100}%`,
  duration: 5 + (i % 4),
  delay: (i % 3) * 0.7,
}));

const Particles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {PARTICLE_DATA.map(({ id, top, left, duration, delay }) => (
      <motion.div
        key={id}
        className="absolute w-[2px] h-[2px] bg-[#99B6F5] rounded-full"
        style={{ top, left, opacity: 0.08 }}
        animate={{ y: [0, -20, 0], opacity: [0.05, 0.2, 0.05] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    ))}
  </div>
);

// ─── Flight Path Line ─────────────────────────────────────────────────────────
const FlightPathLine = ({ pathY, textOpacity }) => (
  <motion.div
    className="absolute left-0 top-[45%] md:top-[50%] w-[120%] -translate-y-1/2 pointer-events-none z-10 opacity-20 md:opacity-30"
    style={{ y: pathY, opacity: textOpacity }}
    variants={decalVariant}
    initial="hidden"
    animate="visible"
  >
    <svg viewBox="0 0 1200 400" className="w-full h-auto" fill="none">
      <motion.path
        d="M -100,250 C 300,100 700,350 1300,150"
        stroke="#99B6F5"
        strokeWidth="1.5"
        strokeDasharray="6 12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.6 }}
      />
      {/* Flight waypoints */}
      {[
        { cx: 100, cy: 180, r: 3 },
        { cx: 450, cy: 205, r: 3.5 },
        { cx: 850, cy: 275, r: 4 },
        { cx: 1150, cy: 185, r: 3 },
      ].map(({ cx, cy, r }, i) => (
        <motion.circle
          key={cx}
          cx={cx} cy={cy} r={r}
          fill="#E57A44"
          stroke="#050B14"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 + i * 0.2, duration: 0.5, ease: 'backOut' }}
        />
      ))}
    </svg>
  </motion.div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero({ onBookCounselling }) {
  const containerRef = useRef(null);
  const prefersReducedMotion = useContext(ReducedMotionContext);
  const { scrollY } = useScroll();

  // Smooth spring for parallax
  const smoothScrollY = useSpring(scrollY, { damping: 25, stiffness: 100 });

  // Parallax transforms
  const textY = useTransform(smoothScrollY, [0, 800], [0, -80]);
  const textOpacity = useTransform(smoothScrollY, [0, 500], [1, 0]);
  const travelerY = useTransform(smoothScrollY, [0, 800], [0, 40]);
  const pathY = useTransform(smoothScrollY, [0, 800], [0, -40]);
  const airplaneX = useTransform(smoothScrollY, [0, 800], [0, -600]);
  const airplaneY = useTransform(smoothScrollY, [0, 800], [0, -100]);

  // Detect mobile to disable parallax (which pushes text behind navbar)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // When reduced motion is preferred, skip entrance animations
  const animate = prefersReducedMotion ? 'visible' : 'visible';

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-[100vw] h-[130vh] bg-transparent flex flex-col items-center overflow-hidden"
    >
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#081220] to-[#000000] z-0"
        style={{ opacity: useTransform(scrollY, [0, 800], [1, 0.5]) }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Radial depth glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] sm:w-[600px] md:w-[900px] h-[150vw] sm:h-[600px] md:h-[900px] bg-[#173B63] rounded-full blur-[200px] z-0 pointer-events-none"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />

      <Particles />

      {/* Thematic Decorative Layer */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        variants={decalVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Visa Stamp — UK */}
        <div className="absolute top-[15%] right-[10%] opacity-[0.08] rotate-[15deg]">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#99B6F5" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#99B6F5" strokeWidth="1" />
            <text x="50" y="42" fontFamily="monospace" fontSize="12" fill="#99B6F5" textAnchor="middle" letterSpacing="1">ENTRY CLEARANCE</text>
            <text x="50" y="65" fontFamily="sans-serif" fontSize="22" fill="#E57A44" textAnchor="middle" fontWeight="bold">UK</text>
            <path d="M 25,75 L 75,75" stroke="#99B6F5" strokeWidth="1" />
          </svg>
        </div>

        {/* Visa Stamp — YYZ */}
        <div className="absolute bottom-[20%] left-[5%] opacity-[0.06] -rotate-[10deg]">
          <svg width="160" height="160" viewBox="0 0 100 100">
            <rect x="10" y="20" width="80" height="60" rx="4" fill="none" stroke="#99B6F5" strokeWidth="2" />
            <text x="50" y="40" fontFamily="sans-serif" fontSize="10" fill="#99B6F5" textAnchor="middle" letterSpacing="2">ADMITTED</text>
            <text x="50" y="60" fontFamily="monospace" fontSize="16" fill="#E57A44" textAnchor="middle" fontWeight="bold">YYZ</text>
            <text x="50" y="72" fontFamily="monospace" fontSize="8" fill="#99B6F5" textAnchor="middle">24 OCT 2026</text>
          </svg>
        </div>

        {/* Visa Stamp — AUS */}
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
      </motion.div>

      {/* ── Sticky Hero Content ───────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full h-auto min-h-screen md:h-screen flex flex-col md:flex-row md:items-center md:justify-center z-20 pb-10 overflow-hidden md:pt-20"
        style={{ paddingTop: isMobile ? '160px' : undefined }}
      >
        <div className="w-full max-w-[1250px] mx-auto px-6 md:px-12 md:h-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between relative">

          {/* Flight Path */}
          <FlightPathLine pathY={pathY} textOpacity={textOpacity} />

          {/* ── Airplane (cinematic entrance) ─────────────────────────────── */}
          <motion.div
            className="absolute z-30 right-[4%] top-[8%] md:left-[5%] md:right-auto md:top-[15%]"
            style={{ scaleX: -1 }}
            variants={prefersReducedMotion ? {} : airplaneEntryVariant}
            initial={prefersReducedMotion ? { opacity: 1, rotate: -155 } : 'hidden'}
            animate={prefersReducedMotion ? { rotate: -155 } : 'visible'}
          >
            {/* Parallax + idle float wrapper */}
            <motion.div
              style={{ x: airplaneX, y: airplaneY, opacity: textOpacity }}
              animate={prefersReducedMotion ? {} : {
                y: [0, -14, 0],
                rotate: [0, -3, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.8, // Start floating only after entry animation
              }}
            >
              <img
                src="/assets/images/airplane-real.png"
                alt="Airplane"
                className="w-20 sm:w-28 md:w-56 object-contain drop-shadow-[0_15px_30px_rgba(153,182,245,0.5)]"
              />
            </motion.div>
          </motion.div>

          {/* ── Left Content: Headline & CTA ──────────────────────────────── */}
          <motion.div
            className="relative z-30 w-full md:w-[65%] lg:w-[70%] flex flex-col items-start text-left"
            style={{ y: isMobile ? 0 : textY, opacity: textOpacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Pre-headline accent */}
            <motion.div
              variants={fadeUpVariant}
              className="mb-3 flex items-center gap-2"
            >
              <span style={{
                display: 'inline-block',
                width: '32px',
                height: '2px',
                background: '#E57A44',
                borderRadius: '2px',
              }} />
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.25em',
                color: '#99B6F5',
                textTransform: 'uppercase',
              }}>
                Study Abroad Consultancy
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.2rem,8.5vw,5.5rem)] lg:text-[7rem] leading-[1.05] drop-shadow-lg flex flex-col gap-1 md:gap-2 mb-0">
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

            {/* CTA */}
            <motion.div
              variants={ctaVariant}
              className="relative md:absolute left-0 mt-7 md:mt-0 md:-bottom-[140px] w-full flex justify-start md:justify-start"
            >
              <div className="flex flex-col items-start md:items-center md:mt-[72px]">
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
                  className="w-[280px] sm:w-[320px] max-w-[90vw] shadow-2xl"
                >
                  BOOK FREE COUNSELING
                </SpecularButton>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Content: Traveler ───────────────────────────────────── */}
          <motion.div
            className="relative md:absolute md:bottom-0 md:right-0 w-full md:relative md:w-[45%] mt-6 md:mt-0 h-[52vw] md:h-full flex items-end justify-end md:justify-end z-20 pointer-events-none self-end md:self-auto"
            style={{ y: travelerY }}
            variants={travelerVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full h-full flex items-end justify-end">
              <motion.img
                src="/assets/images/female-traveler.png"
                alt="Student Traveler"
                className="w-auto h-full max-h-full md:max-w-[650px] md:w-full md:h-auto object-contain object-bottom drop-shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                style={{
                  maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
                }}
                animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
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

      {/* Bottom Blend */}
      <div className="absolute bottom-0 w-full pt-32 pb-12 px-6 z-20 flex justify-center bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <p className="font-body text-[#8A9EBD] text-center text-[11px] md:text-[13px] font-medium tracking-[0.3em] uppercase max-w-[800px] leading-relaxed">
            We help students get into <span className="text-white font-bold">top universities abroad</span><br className="hidden md:block" /> from shortlisting to visa
          </p>
        </motion.div>
      </div>
    </section>
  );
}
