import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import testimonialsData from '../../data/testimonials';
import { apiUrl, getImageUrl } from '../../utils/api';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(testimonialsData);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    fetch(apiUrl('/api/public/testimonials'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        }
      })
      .catch(err => console.error('Failed to load testimonials:', err));
  }, []);

  const [isPaused, setIsPaused] = useState(false);

  // Auto-play interval
  useEffect(() => {
    if (testimonials.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials, isPaused]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" style={{ padding: 'clamp(60px, 10vw, 120px) 5% 40px', backgroundColor: 'transparent', position: 'relative', overflow: 'hidden' }}>

      
      {/* Decorative Background Elements */}
      
      
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 150, ease: "linear" }} style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.10, zIndex: 0, pointerEvents: 'none' }}>
        <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#99B6F5" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>
      </motion.div>

      {/* HERO / HEADER */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 6vw, 4.5rem)', color: '#99B6F5', margin: '0 0 16px 0', lineHeight: 1.1, fontWeight: 700, textShadow: '0 4px 20px rgba(153, 182, 245, 0.15)' }}
        >
          Don't take our word for it!<br/>Hear it from our students.
        </motion.h2>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#F8F9FA', maxWidth: '600px', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
          Discover the real experiences of students who navigated their global education journey with SPINFYOT.
        </p>
      </div>

      {/* TESTIMONIAL SLIDER */}
      <div 
        style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', justifySelf: 'center', justifyContent: 'center', marginTop: '20px', height: '560px' }}
      >
        
        <div 
          style={{ position: 'relative', width: 'clamp(280px, 80vw, 360px)', height: 'clamp(420px, 120vw, 500px)' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false}>
            {testimonials.map((testimonial, idx) => {
              // Calculate positional offset
              const offset = (idx - currentIndex + testimonials.length) % testimonials.length;
              
              let x = "0px";
              let y = 80;
              let rotate = 0;
              let scale = 0.75;
              let opacity = 0;
              let zIndex = 10;
              
              if (isMobile) {
                if (offset === 0) {
                  x = "0px";
                  y = 0;
                  rotate = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 50;
                } else {
                  x = "0px";
                  y = 0;
                  rotate = 0;
                  scale = 0.8;
                  opacity = 0;
                  zIndex = -1;
                }
              } else {
                // Center card
                if (offset === 0) {
                  x = "0px";
                  y = 0;
                  rotate = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 50;
                } 
                // Right 1 card
                else if (offset === 1) {
                  x = "min(15vw, 180px)";
                  y = 30;
                  rotate = 6;
                  scale = 0.92;
                  opacity = 0.95;
                  zIndex = 40;
                } 
                // Right 2 card
                else if (offset === 2) {
                  x = "min(28vw, 340px)";
                  y = 60;
                  rotate = 12;
                  scale = 0.84;
                  opacity = 0.7;
                  zIndex = 30;
                }
                // Left 1 card
                else if (offset === testimonials.length - 1) {
                  x = "max(-180px, -15vw)";
                  y = 30;
                  rotate = -6;
                  scale = 0.92;
                  opacity = 0.95;
                  zIndex = 40;
                }
                // Left 2 card
                else if (offset === testimonials.length - 2) {
                  x = "max(-340px, -28vw)";
                  y = 60;
                  rotate = -12;
                  scale = 0.84;
                  opacity = 0.7;
                  zIndex = 30;
                }
              }

              // Determine background color based on original brand alternating style
              const bgColors = ['#F8F9FA', '#FFFFFF', '#F3F1EA'];
              const bgColor = bgColors[idx % 3];

              return (
                <motion.div 
                  key={testimonial.id} 
                  initial={false}
                  animate={{ x, y, rotate, scale, opacity, zIndex }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 1 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 'clamp(280px, 80vw, 360px)',
                    height: 'clamp(420px, 120vw, 500px)',
                    backgroundColor: bgColor,
                    borderRadius: '32px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    textAlign: 'center',
                    pointerEvents: offset === 0 ? 'auto' : 'none'
                  }}
                >
                  
                    <div style={{ width: '96px', height: '96px', marginBottom: '32px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #FFFFFF', boxShadow: '0 10px 25px rgba(31, 58, 92, 0.15)', flexShrink: 0 }}>
                      <img 
                        src={getImageUrl(testimonial.photoUrl, `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`)} 
                        alt={testimonial.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    
                    <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '18px', color: '#1F3A5C', fontWeight: 500, fontStyle: 'italic', marginBottom: 'auto', lineHeight: 1.6 }}>
                      "{testimonial.quote}"
                    </p>
                    
                    <div style={{ marginTop: '32px' }}>
                      <h4 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '24px', fontWeight: 700, color: '#1F3A5C', margin: '0' }}>
                        {testimonial.name}
                      </h4>
                    </div>
                  </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Aesthetic Floor Lines */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, pointerEvents: 'none', opacity: 0.5 }}>
            <div style={{ width: '100%', height: '5px', background: 'linear-gradient(to right, transparent, #2f69f2, transparent)', filter: 'blur(4px)', marginBottom: '2px' }} />
            <div style={{ width: '50%', height: '5px', background: 'linear-gradient(to right, transparent, #84ccfc, transparent)', filter: 'blur(4px)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
