import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Home from './pages/Home.jsx';
import { ReducedMotionContext } from './context/ReducedMotionContext';
import ReferralTracker from './components/common/ReferralTracker.jsx';

// Lazy-loaded pages
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage.jsx'));


// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-sfy-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sfy-periwinkle border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Page transition wrapper — subtle fade + micro slide up
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const location = useLocation();

  // Set up Lenis smooth scroll
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Don't initialize Lenis if user prefers reduced motion
    if (mediaQuery.matches) return () => mediaQuery.removeEventListener('change', handler);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion}>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <ReferralTracker />
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/ref/:slug" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
            <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
            <Route path="/testimonials" element={<PageTransition><TestimonialsPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ReducedMotionContext.Provider>
  );
}

export default App;
