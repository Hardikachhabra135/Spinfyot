import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, CheckCircle2, Send } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CounsellingModal from '../../components/ui/CounsellingModal';
import services from '../../data/services';
import { apiUrl } from '../../utils/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');

  const isFormInvalid = name.trim() === '' || email.trim() === '' || question.trim() === '';

  const handleSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch(apiUrl('/api/public/questions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, question, serviceSlug: slug }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      setIsSending(false);
      setIsSent(true);
      setName('');
      setEmail('');
      setQuestion('');
      setTimeout(() => setIsSent(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to send question: ' + error.message);
      setIsSending(false);
    }
  };
  
  const service = services.find(s => s.slug === slug);

  useEffect(() => {
    if (service) {
      document.title = `${service.title} | Spinfyot`;
      window.scrollTo(0, 0);
    }
  }, [service]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  if (!service) return <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>Not Found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'Poppins, sans-serif' }}>
      <Header onInquireClick={openModal} />
      
      <div style={{ paddingTop: '100px' }}></div>
      
      <main style={{ flexGrow: 1, paddingBottom: '0' }}>
        {/* HERO SECTION */}
        <section style={{ backgroundColor: '#000000', padding: '60px 5% 100px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
            <Link to="/#services" style={{ color: '#99B6F5', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontWeight: 600, fontSize: '15px', alignSelf: 'flex-start', marginBottom: '60px', transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.8} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
              <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to All Services
            </Link>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(153, 182, 245, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '1px solid rgba(153, 182, 245, 0.2)' }}>
                {service.icon && <service.icon style={{ color: '#99B6F5', width: '40px', height: '40px' }} />}
              </div>
              <h1 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 7vw, 6rem)', color: '#99B6F5', margin: '0 0 24px 0', lineHeight: 1, fontWeight: 700, textShadow: '0 4px 20px rgba(153, 182, 245, 0.15)' }}>{service.title}</h1>
              <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#F8F9FA', maxWidth: '750px', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>{service.subtitle}</p>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section style={{ maxWidth: '1200px', margin: '-40px auto 0 auto', padding: '0 5%', display: 'flex', flexDirection: 'column', gap: '80px', position: 'relative', zIndex: 10 }}>
          
          {/* About Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: 'clamp(32px, 5vw, 64px)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '28px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 24px 0' }}>About This Service</h2>
            <p style={{ fontSize: '18px', color: '#4B5563', lineHeight: 1.8, margin: 0 }}>{service.about}</p>
          </motion.div>

          {/* What We Provide */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '32px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 40px 0', textAlign: 'center' }}>What We Provide</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {service.whatWeProvide?.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(153,182,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <CheckCircle2 style={{ color: '#1F3A5C', width: '24px', height: '24px' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1F3A5C', margin: '0 0 16px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '32px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 50px 0', textAlign: 'center' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', width: '100%' }}>
              {service.howItWorks?.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ fontSize: '48px', fontFamily: '"Caveat", cursive', color: '#99B6F5', fontWeight: 700, lineHeight: 1, marginBottom: '16px' }}>{step.step}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1F3A5C', margin: '0 0 12px 0' }}>{step.title}</h3>
                  <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Who It's For */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ backgroundColor: '#1F3A5C', borderRadius: '32px', padding: 'clamp(40px, 6vw, 80px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '28px', color: '#99B6F5', fontWeight: 700, margin: '0 0 24px 0' }}>Who Is This For?</h2>
            <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: '#F8F9FA', lineHeight: 1.6, margin: 0, maxWidth: '800px', fontWeight: 500 }}>"{service.whoItsFor}"</p>
          </motion.div>

          {/* FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '32px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 40px 0', textAlign: 'center' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {service.faqs?.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <button onClick={() => toggleFaq(i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', outline: 'none' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#1F3A5C' }}>{faq.q}</span>
                    <motion.div animate={{ rotate: openFaqIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: '#99B6F5', flexShrink: 0, marginLeft: '16px' }}>
                      <ChevronDown size={24} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 24px 24px 24px', fontSize: '16px', color: '#4B5563', lineHeight: 1.6 }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Ask Your Question Box */}
            <div style={{ marginTop: '80px', padding: '48px', backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '28px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 16px 0', textAlign: 'center' }}>Still have questions?</h3>
              <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 32px 0', textAlign: 'center' }}>Drop your question below and our experts will reply via email.</p>
              
              <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: '1 1 200px', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(31,58,92,0.15)', backgroundColor: '#F8F9FA', fontSize: '16px', color: '#1F3A5C', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#99B6F5'} onBlur={(e) => e.target.style.borderColor = 'rgba(31,58,92,0.15)'} />
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: '1 1 200px', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(31,58,92,0.15)', backgroundColor: '#F8F9FA', fontSize: '16px', color: '#1F3A5C', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#99B6F5'} onBlur={(e) => e.target.style.borderColor = 'rgba(31,58,92,0.15)'} />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                  <input 
                    type="text"
                    placeholder="Type your question here..."
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{ flexGrow: 1, padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(31,58,92,0.15)', backgroundColor: '#F8F9FA', fontSize: '16px', color: '#1F3A5C', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#99B6F5'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(31,58,92,0.15)'}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isSending || isSent || isFormInvalid}
                    style={{ backgroundColor: isSent ? '#10B981' : '#1F3A5C', opacity: (isFormInvalid && !isSent) ? 0.5 : 1, color: '#FFFFFF', border: 'none', borderRadius: '16px', padding: '0 32px', fontSize: '16px', fontWeight: 600, cursor: (isSending || isSent || isFormInvalid) ? 'default' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}
                    onMouseOver={(e) => { if(!isSending && !isSent && !isFormInvalid) { e.currentTarget.style.backgroundColor = '#99B6F5'; e.currentTarget.style.color = '#1F3A5C'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(153,182,245,0.3)'; } }}
                    onMouseOut={(e) => { if(!isSending && !isSent && !isFormInvalid) { e.currentTarget.style.backgroundColor = '#1F3A5C'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
                  >
                    {isSending ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '18px', height: '18px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    ) : isSent ? (
                      <>Sent! <CheckCircle2 size={18} /></>
                    ) : (
                      <>Send <Send size={18} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </section>
        
        {/* CTA SECTION */}
        <section style={{ backgroundColor: '#EBF1FA', padding: '100px 5%', marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 6vw, 5rem)', color: '#1F3A5C', margin: '0 0 40px 0', lineHeight: 1, fontWeight: 700 }}>Ready to start your journey?</h2>
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
