import { useEffect, useState, createContext, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Home from './pages/Home.jsx';

// Lazy-loaded pages
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));

// Context for reduced motion preference
export const ReducedMotionContext = createContext(false);

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-sfy-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sfy-periwinkle border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </Suspense>
    </ReducedMotionContext.Provider>
  );
}

export default App;
