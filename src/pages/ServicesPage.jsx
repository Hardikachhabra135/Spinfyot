import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Services from '../components/sections/Services';
import CounsellingModal from '../components/ui/CounsellingModal';

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Our Services | Spinfyot";
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#000000' }}>
      <Header onInquireClick={openModal} />
      
      {/* Spacer for fixed header */}
      <div style={{ paddingTop: '100px' }}></div>
      
      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        <Services />
      </main>

      <Footer onInquireClick={openModal} />
      <CounsellingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
