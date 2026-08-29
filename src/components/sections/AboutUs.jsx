import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Heart, Shield, Compass, Globe2 } from 'lucide-react';

// ─── FlipBookCard ─────────────────────────────────────────────────────────────
// Original 3D flip-book design, visually unchanged.
// `isActive` prop replaces the local `isFlipped` state so the PARENT controls
// which card is open, enforcing the single-open rule on mobile/tablet.
// Desktop hover behaviour (group-hover CSS) is completely untouched.
const FlipBookCard = ({ card, isActive, onToggle }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full ${isTouchDevice ? 'cursor-pointer' : ''}`}
      onClick={() => isTouchDevice && onToggle()}
      style={{
        height: '420px',
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* The Book Base (Inside Pages) */}
      <div 
        className="w-full h-full relative rounded-2xl flex items-center justify-center p-8 transition-shadow duration-700 ease-out"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 40px rgba(31,58,92,0.06)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* The Inside Content (Revealed on hover or tap) */}
        <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-opacity duration-500 delay-100 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="mb-6 flex justify-center">
            <div style={{ width: '48px', height: '48px', background: 'rgba(153, 182, 245, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <card.icon style={{ color: '#173B63', width: '24px', height: '24px' }} />
            </div>
          </div>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: 700, color: '#173B63', marginBottom: '16px', textAlign: 'center', lineHeight: 1.3 }}>
            {card.title}
          </h3>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', color: '#4B5563', lineHeight: 1.7, textAlign: 'center' }}>
            {card.desc}
          </p>
        </div>
        
        {/* The Cover Container (Flips open on hover or tap) */}
        <div 
          className={`absolute inset-0 cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left ${isActive ? '[transform:rotateY(-140deg)]' : 'group-hover:[transform:rotateY(-140deg)]'}`}
          style={{ transformStyle: 'preserve-3d', zIndex: 10 }}
        >
          {/* Front of Cover */}
          <div 
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
            style={{
              background: 'linear-gradient(135deg, #173B63, #0a1829)',
              backfaceVisibility: 'hidden',
              boxShadow: '4px 0px 20px rgba(0,0,0,0.15)', 
            }}
          >
            {/* Subtle cover decor */}
            <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none" />
            
            <card.icon style={{ color: '#99B6F5', width: '48px', height: '48px', marginBottom: '24px' }} className="group-hover:scale-110 transition-transform duration-500" />
            
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '26px', fontWeight: 600, color: '#FFFFFF', textAlign: 'center', letterSpacing: '1px', lineHeight: 1.2 }}>
              {card.title}
            </h3>
            
            <div className="absolute bottom-8 flex items-center gap-2 opacity-60">
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#99B6F5', letterSpacing: '1px' }}>
                {isTouchDevice ? 'Tap to explore' : 'Hover to explore'}
              </span>
            </div>
          </div>

          {/* Back of Cover (Inside the flap) */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #f8fafc, #e2e8f0)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              boxShadow: 'inset 4px 0px 10px rgba(0,0,0,0.05)', 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function AboutUs() {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yHeader = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yGlobe = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Single-open state: only one card can be flipped open at a time on touch devices.
  // null = all closed. Desktop hover CSS is unaffected by this state.
  const [activeCard, setActiveCard] = useState(null);
  const handleToggle = (index) => {
    setActiveCard((prev) => (prev === index ? null : index));
  };

  const cards = [
    {
      icon: Target,
      title: "Who We Are",
      desc: "Turning ambitious dreams into global opportunities.",
      delay: 0.1
    },
    {
      icon: Heart,
      title: "What We Believe",
      desc: "Making global education accessible, transparent, and meaningful.",
      delay: 0.2
    },
    {
      icon: Compass,
      title: "Our Approach",
      desc: "Personalized, data-driven guidance at every step.",
      delay: 0.3
    },
    {
      icon: Shield,
      title: "Why Choose Us",
      desc: "Built on integrity, transparency, and unwavering support.",
      delay: 0.4
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      style={{ 
        backgroundColor: 'transparent', 
        padding: 'clamp(80px, 15vw, 160px) 5% clamp(60px, 10vw, 120px)',
        position: 'relative', 
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >

      {/* Visual Centerpiece: Parallax Abstract Globe & Orbits */}
      <motion.div 
        style={{ y: yGlobe, position: 'absolute', right: '-15%', top: '10%', zIndex: 0, opacity: 0.8 }} 
        className="pointer-events-none hidden md:block"
      >
        <div style={{ position: 'relative', width: 'clamp(400px, 80vw, 800px)', height: 'clamp(400px, 80vw, 800px)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} style={{ position: 'absolute', inset: 0, border: '1px solid rgba(153, 182, 245, 0.4)', borderRadius: '50%' }} />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 80, ease: "linear" }} style={{ position: 'absolute', inset: '80px', border: '1px dashed rgba(31, 58, 92, 0.15)', borderRadius: '50%' }} />
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 100, ease: "linear" }} style={{ position: 'absolute', inset: '160px', border: '1px solid rgba(153, 182, 245, 0.2)', borderRadius: '50%' }} />
          
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(153,182,245,0.15) 0%, rgba(243,241,234,0) 70%)', borderRadius: '50%' }} />
          <Globe2 size={160} strokeWidth={0.5} color="#1F3A5C" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />
        </div>
      </motion.div>

      {/* Subtle Background Gradients for depth */}
      

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Storytelling Header */}
        <motion.div 
          style={{ y: yHeader, marginBottom: '80px', display: 'flex', flexDirection: 'column', maxWidth: '800px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#99B6F5', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}>Our Story</span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(4rem, 8vw, 7rem)', color: '#122137', margin: '0 0 24px 0', lineHeight: 0.9, fontWeight: 700 }}
          >
            Redefining<br/>Global Education.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#4B5563', margin: 0, lineHeight: 1.8, fontWeight: 400 }}
          >
            Guiding you every step of the way to achieve your global education dreams. We are more than consultants; we are your strategic partners in international education.
          </motion.p>
        </motion.div>

        {/* Balanced 3D Flip Book Grid — layout unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <FlipBookCard
              key={i}
              card={card}
              isActive={activeCard === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
