import { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import AboutUs from '../components/sections/AboutUs';
import Testimonials from '../components/sections/Testimonials';
import CounsellingModal from '../components/ui/CounsellingModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState('#000000');
  const mainRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      
      // 2. Transition to About Us (Off-White)
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 50%',
        onEnter: () => setBgColor('#F3F1EA'),
        onLeaveBack: () => setBgColor('#000000'),
      });

      // 3. Transition to Testimonials (Navy Blue)
      ScrollTrigger.create({
        trigger: '#testimonials',
        start: 'top 50%',
        onEnter: () => setBgColor('#1F3A5C'),
        onLeaveBack: () => setBgColor('#F3F1EA'),
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={mainRef} 
      className="flex flex-col min-h-screen" 
      style={{ 
        backgroundColor: bgColor,
        transition: 'background-color 0.8s ease-in-out'
      }}
    >
      <Header onInquireClick={openModal} />
      
      <main id="main-content" className="flex-grow relative z-10">
        <Hero onBookCounselling={openModal} />
        <Services />
        <AboutUs />
        <Testimonials />
      </main>

      <Footer />
      
      <CounsellingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
