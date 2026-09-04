import { useLayoutEffect, useRef, useState } from 'react';
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
  const bgProxyRef = useRef({ r: 0, g: 0, b: 0 });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = mainRef.current;
    const proxy = bgProxyRef.current;

    // Helper: parse "rrr,ggg,bbb" string into {r,g,b}
    const rgb = (r, g, b) => ({ r, g, b });

    // Color stops — exact same colors as before
    const BLACK     = rgb(0,   0,   0);      // Hero / Services  (#000000)
    const OFF_WHITE = rgb(243, 241, 234);    // About Us         (#F3F1EA)
    const NAVY      = rgb(31,  58,  92);     // Testimonials     (#1F3A5C)

    // Apply current proxy values directly to element (no CSS transition)
    const applyColor = () => {
      const { r, g, b } = proxy;
      el.style.backgroundColor = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    };

    // Build a scrubbed tween between two colors on a trigger
    const makeTransition = (trigger, from, to, startPos, endPos) => {
      // Set initial proxy to "from" color so GSAP can tween from it
      return ScrollTrigger.create({
        trigger,
        start: startPos,  // e.g. "top 70%"
        end:   endPos,    // e.g. "top 30%"
        scrub: 0.6,       // small scrub = responsive but smooth (no lag)
        onUpdate: (self) => {
          const p = self.progress;
          proxy.r = from.r + (to.r - from.r) * p;
          proxy.g = from.g + (to.g - from.g) * p;
          proxy.b = from.b + (to.b - from.b) * p;
          applyColor();
        },
      });
    };

    // Seed the initial color
    proxy.r = BLACK.r; proxy.g = BLACK.g; proxy.b = BLACK.b;
    applyColor();

    // Transition 1: Black → Off-White as #about enters
    const t1 = makeTransition('#about', BLACK, OFF_WHITE, 'top 80%', 'top 20%');

    // Transition 2: Off-White → Navy as #testimonials enters
    const t2 = makeTransition('#testimonials', OFF_WHITE, NAVY, 'top 80%', 'top 20%');

    return () => {
      t1.kill();
      t2.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div
      ref={mainRef}
      className="flex flex-col min-h-screen"
      // backgroundColor is now set directly by GSAP — no CSS transition needed
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
