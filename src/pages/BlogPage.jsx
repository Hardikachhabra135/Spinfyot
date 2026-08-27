import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Coffee, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CounsellingModal from '../components/ui/CounsellingModal';

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Our Blog | Spinfyot";
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'Poppins, sans-serif' }}>
      <Header onInquireClick={openModal} />
      
      <div style={{ paddingTop: '100px' }}></div>
      
      <main style={{ flexGrow: 1, paddingBottom: '0' }}>
        
        {/* HERO SECTION */}
        <section style={{ backgroundColor: '#050B14', padding: '60px 5% 100px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(153, 182, 245, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '1px solid rgba(153, 182, 245, 0.2)' }}>
                <BookOpen style={{ color: '#99B6F5', width: '40px', height: '40px' }} />
              </div>
              <h1 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 7vw, 6rem)', color: '#99B6F5', margin: '0 0 24px 0', lineHeight: 1, fontWeight: 700, textShadow: '0 4px 20px rgba(153, 182, 245, 0.15)' }}>
                Our Blog
              </h1>
              <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#F8F9FA', maxWidth: '750px', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
                Great Content Coming Soon!
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section style={{ maxWidth: '1200px', margin: '-40px auto 0 auto', padding: '0 5%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          
          {/* Main White Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: 'clamp(40px, 5vw, 80px)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            <Coffee size={48} className="text-[#E57A44] mb-6 opacity-80" />
            
            <h2 style={{ fontSize: '32px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 24px 0' }}>We're brewing something special.</h2>
            <p style={{ fontSize: '18px', color: '#4B5563', lineHeight: 1.8, maxWidth: '800px', margin: '0 0 48px 0' }}>
              We're currently working on comprehensive guides, student success stories, university spotlights, and insider tips to help you navigate your study abroad journey. Check back soon for our first posts!
            </p>

            {/* Skeleton / Empty State Cards to make the page look premium while waiting */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex flex-col text-left bg-[#F8F9FA] rounded-[24px] p-6 border border-gray-100">
                  <div className="w-full h-40 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                  <div className="w-full h-6 bg-gray-300 rounded-full mb-3 animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>

            

          </motion.div>
        </section>
        
        {/* CTA SECTION */}
        <section style={{ backgroundColor: '#EBF1FA', padding: '100px 5%', marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 6vw, 5rem)', color: '#1F3A5C', margin: '0 0 30px 0', lineHeight: 1, fontWeight: 700 }}>Want personalized advice?</h2>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#4B5563', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
            Schedule a free 1-on-1 session with our expert counselors to map out your exact study abroad journey.
          </p>
          <button onClick={openModal} style={{ backgroundColor: '#1F3A5C', color: '#FFFFFF', fontSize: '18px', fontWeight: 600, padding: '20px 48px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px rgba(31, 58, 92, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#99B6F5'; e.currentTarget.style.color = '#1F3A5C'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1F3A5C'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Book Free Counselling
          </button>
        </section>
      </main>

      <Footer onInquireClick={openModal} />
      <CounsellingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
