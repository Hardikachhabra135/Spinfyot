import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquareText } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CounsellingModal from '../components/ui/CounsellingModal';
import { apiUrl } from '../utils/api';

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | Spinfyot";
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        interest: e.target.interest.value,
        message: e.target.message.value,
        referralSlug: localStorage.getItem('referral_slug') || undefined,
        visitorId: localStorage.getItem('visitorId') || undefined
      };
      const response = await fetch(apiUrl('/api/public/contacts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
      e.target.reset();
    } catch (error) {
      console.error('Contact submission failed:', error);
      alert('Failed to submit: ' + error.message);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "EMAIL ADDRESS", text: "Ketan@spinfyot.in", link: "mailto:Ketan@spinfyot.in" },
    { icon: Phone, label: "PHONE NUMBER", text: "+91 98765 43210", link: "tel:+919876543210" },
    { icon: MapPin, label: "OFFICE LOCATION", text: "123 Education Hub, Global City, State, 123456", link: "https://maps.google.com/?q=123+Education+Hub" }
  ];

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
                <MessageSquareText style={{ color: '#99B6F5', width: '40px', height: '40px' }} />
              </div>
              <h1 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 7vw, 6rem)', color: '#99B6F5', margin: '0 0 24px 0', lineHeight: 1, fontWeight: 700, textShadow: '0 4px 20px rgba(153, 182, 245, 0.15)' }}>
                Get In Touch
              </h1>
              <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#F8F9FA', maxWidth: '750px', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
                Have questions about studying abroad? Our expert counselors are here to guide you at every step.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section style={{ maxWidth: '1200px', margin: '-40px auto 0 auto', padding: '0 5%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          
          {/* Main White Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: 'clamp(32px, 5vw, 64px)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
            
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              
              {/* Left: Contact Info */}
              <div className="w-full lg:w-[35%] flex flex-col gap-10">
                <h2 style={{ fontSize: '28px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 8px 0' }}>Contact Details</h2>
                
                <div className="flex flex-col gap-8">
                  {contactInfo.map((item, idx) => (
                    <a key={idx} href={item.link} target={item.icon === MapPin ? "_blank" : "_self"} rel="noopener noreferrer" className="group flex items-start gap-5 cursor-pointer">
                      <div className="flex-shrink-0 w-12 h-12 rounded-[14px] bg-[#EBF1FA] flex items-center justify-center transition-all duration-300 group-hover:bg-[#1F3A5C] group-hover:scale-105">
                        <item.icon size={22} className="text-[#1F3A5C] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#8A9EBD', letterSpacing: '1px', marginBottom: '4px' }}>{item.label}</span>
                        <span style={{ fontSize: '18px', fontWeight: 500, color: '#1F3A5C', transition: 'color 0.3s' }} className="group-hover:text-[#99B6F5]">{item.text}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="w-full lg:w-[65%]">
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#EBF1FA', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <CheckCircle2 style={{ color: '#1F3A5C', width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1F3A5C', marginBottom: '12px' }}>Message Sent Successfully!</h3>
                    <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.6, maxWidth: '400px' }}>Our counseling team has received your inquiry and will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.5px' }}>FULL NAME</label>
                        <input type="text" id="name" required style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', fontSize: '16px', color: '#1F3A5C', outline: 'none', transition: 'all 0.3s' }} placeholder="John Doe" onFocus={(e) => { e.target.style.borderColor = '#99B6F5'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 4px rgba(153,182,245,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F8F9FA'; e.target.style.boxShadow = 'none' }} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                        <input type="email" id="email" required style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', fontSize: '16px', color: '#1F3A5C', outline: 'none', transition: 'all 0.3s' }} placeholder="john@example.com" onFocus={(e) => { e.target.style.borderColor = '#99B6F5'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 4px rgba(153,182,245,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F8F9FA'; e.target.style.boxShadow = 'none' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="phone" style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.5px' }}>PHONE NUMBER</label>
                        <input type="tel" id="phone" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', fontSize: '16px', color: '#1F3A5C', outline: 'none', transition: 'all 0.3s' }} placeholder="+1 (234) 567-8900" onFocus={(e) => { e.target.style.borderColor = '#99B6F5'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 4px rgba(153,182,245,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F8F9FA'; e.target.style.boxShadow = 'none' }} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="interest" style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.5px' }}>INTEREST</label>
                        <select id="interest" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', fontSize: '16px', color: '#1F3A5C', outline: 'none', transition: 'all 0.3s', cursor: 'pointer' }} onFocus={(e) => { e.target.style.borderColor = '#99B6F5'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 4px rgba(153,182,245,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F8F9FA'; e.target.style.boxShadow = 'none' }}>
                          <option value="counseling">Study Abroad Counseling</option>
                          <option value="visa">Visa Support</option>
                          <option value="post-arrival">Post-Arrival Support</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.5px' }}>MESSAGE</label>
                      <textarea id="message" required rows="4" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', fontSize: '16px', color: '#1F3A5C', outline: 'none', transition: 'all 0.3s', resize: 'none' }} placeholder="Tell us how we can help..." onFocus={(e) => { e.target.style.borderColor = '#99B6F5'; e.target.style.backgroundColor = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 4px rgba(153,182,245,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F8F9FA'; e.target.style.boxShadow = 'none' }}></textarea>
                    </div>

                    <div className="mt-4 flex justify-start">
                      <button type="submit" style={{ backgroundColor: '#1F3A5C', color: '#FFFFFF', fontSize: '16px', fontWeight: 600, padding: '16px 40px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 8px 20px rgba(31, 58, 92, 0.15)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#99B6F5'; e.currentTarget.style.color = '#1F3A5C'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1F3A5C'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
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
