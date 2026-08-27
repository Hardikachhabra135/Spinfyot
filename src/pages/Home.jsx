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
  const mainRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      
      // 2. Transition to About Us (Off-White)
      gsap.to(mainRef.current, {
        backgroundColor: '#F3F1EA',
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 90%',
          end: 'top 10%',
          scrub: 1.5,
        }
      });

      // 3. Transition to Testimonials (Navy Blue)
      gsap.to(mainRef.current, {
        backgroundColor: '#1F3A5C',
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '#testimonials',
          start: 'top 90%',
          end: 'top 10%',
          scrub: 1.5,
        }
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="flex flex-col min-h-screen" style={{ backgroundColor: '#000000' }}>
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
