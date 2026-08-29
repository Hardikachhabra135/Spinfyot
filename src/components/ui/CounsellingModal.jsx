import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiUrl } from '../../utils/api';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  classType: z.enum(['Class 10', 'Class 12', 'Undergraduate', 'Postgraduate', 'Working Professional'], {
    errorMap: () => ({ message: 'Please select a valid class' }),
  }),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  email: z.string().email('Please enter a valid email address'),
});

const CounsellingModal = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState('idle'); // idle | loading | success
  const modalRef = useRef(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', classType: '', phoneNumber: '', email: '' }
  });

  // Focus trap and ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      
      // Simple focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first input on open
    setTimeout(() => {
      const firstInput = modalRef.current?.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setFormState('idle');
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    setFormState('loading');
    try {
      const response = await fetch(apiUrl('/api/public/appointments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePage: window.location.pathname }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Submission failed');
      }
      
      setFormState('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit appointment: ' + error.message);
      setFormState('idle');
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' },
    visible: isMobile 
      ? { y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
      : { opacity: 1, scale: 1, y: '-50%', x: '-50%', transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px 20px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    fontSize: '16px',
    fontFamily: 'Poppins, Inter, sans-serif',
    color: '#111827',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
    fontFamily: 'Poppins, Inter, sans-serif'
  };

  const errorStyle = {
    color: '#EF4444',
    fontSize: '13px',
    marginTop: '6px',
    fontFamily: 'Poppins, Inter, sans-serif'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 50
            }}
            onClick={onClose}
            aria-hidden="true"
          />
          
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-heading"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-lenis-prevent="true"
            style={{
              position: 'fixed',
              zIndex: 51,
              backgroundColor: '#ffffff',
              top: isMobile ? 'auto' : '50%',
              left: isMobile ? '0' : '50%',
              bottom: isMobile ? '0' : 'auto',
              right: isMobile ? '0' : 'auto',
              width: isMobile ? '100%' : '600px',
              transform: isMobile ? 'none' : 'translate(-50%, -50%)',
              borderRadius: isMobile ? '40px 40px 0 0' : '32px',
              padding: isMobile ? '40px 24px' : '48px 56px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              overflowY: 'auto',
              maxHeight: '90vh',
              fontFamily: 'Poppins, Inter, sans-serif'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#E5E7EB'}
              onMouseOut={(e) => e.currentTarget.style.background = '#F3F4F6'}
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 id="modal-heading" style={{
                fontFamily: 'Poppins, Inter, sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                color: '#122137',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px'
              }}>
                Book Your Session
              </h2>
              <p style={{
                color: '#6B7280',
                fontSize: '16px',
                margin: 0
              }}>
                Fill in your details and we'll contact you shortly.
              </p>
            </div>

            {formState === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle size={80} color="#10B981" style={{ marginBottom: '24px', filter: 'drop-shadow(0 4px 6px rgba(16,185,129,0.2))' }} />
                </motion.div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#122137', margin: '0 0 8px 0' }}>Request Received!</p>
                <p style={{ color: '#6B7280', fontSize: '16px', margin: 0 }}>Our experts will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="name" style={labelStyle}>Full Name</label>
                  <input
                    id="name"
                    {...register('name')}
                    style={inputStyle}
                    placeholder="John Doe"
                    onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.backgroundColor = '#ffffff'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="classType" style={labelStyle}>Current Education Level</label>
                  <select
                    id="classType"
                    {...register('classType')}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      cursor: 'pointer',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.backgroundColor = '#ffffff'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select your current stage</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Undergraduate">Undergraduate / College</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                  {errors.classType && <p style={errorStyle}>{errors.classType.message}</p>}
                </div>

                <div style={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="phoneNumber" style={labelStyle}>Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      {...register('phoneNumber')}
                      style={inputStyle}
                      placeholder="9876543210"
                      onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.backgroundColor = '#ffffff'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                    />
                    {errors.phoneNumber && <p style={errorStyle}>{errors.phoneNumber.message}</p>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <label htmlFor="email" style={labelStyle}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      style={inputStyle}
                      placeholder="john@example.com"
                      onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; e.target.style.backgroundColor = '#ffffff'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                    />
                    {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={formState === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #2A4870 0%, #122137 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 24px rgba(18,33,55,0.3)',
                    fontFamily: 'Poppins, Inter, sans-serif',
                    opacity: formState === 'loading' ? 0.7 : 1
                  }}
                >
                  {formState === 'loading' ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CounsellingModal;
