import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#F8F9FA',
        background: 'linear-gradient(to bottom, #F8F9FA, #DCE6FA)',
        borderRadius: '24px',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 0,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease',
      }}
      onMouseLeave={() => setIsBtnHovered(false)} // Safety catch
    >
      {/* Expanding Circle Background (Uiverse animation) */}
      <motion.div
        animate={{ scale: isBtnHovered ? 28 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          content: '""',
          position: 'absolute',
          zIndex: -1,
          top: '-16px',
          right: '-16px',
          background: 'linear-gradient(135deg, #1F3A5C, #050B14)',
          height: '48px',
          width: '48px',
          borderRadius: '50%',
          transformOrigin: '50% 50%',
        }}
      />

      {/* Top Right Corner Ribbon (go-corner) */}
      <a 
        href={`/services/${service.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: '64px',
          height: '64px',
          top: 0,
          right: 0,
          background: 'linear-gradient(135deg, #99B6F5, #1F3A5C)',
          borderRadius: '0 24px 0 32px',
          zIndex: 10,
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowRight 
          size={24} 
          style={{ 
            color: 'white', 
            marginTop: '-6px', 
            marginRight: '-6px',
            transform: isBtnHovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s easeOut'
          }} 
        />
      </a>

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Icon */}
        <div style={{ marginBottom: '24px' }}>
          {service.icon ? (
            <service.icon 
              style={{ 
                width: '36px', 
                height: '36px', 
                color: isBtnHovered ? '#99B6F5' : '#1F3A5C',
                transition: 'color 0.45s easeOut'
              }} 
            />
          ) : null}
        </div>
        
        {/* Title */}
        <h3 style={{
          fontFamily: 'Poppins, Inter, sans-serif',
          fontWeight: 700,
          fontSize: '24px',
          color: isBtnHovered ? '#FFFFFF' : '#122137',
          margin: '0 0 16px 0',
          lineHeight: 1.3,
          transition: 'color 0.45s easeOut'
        }}>
          {service.title}
        </h3>
        
        {/* Description */}
        <p style={{
          fontFamily: 'Poppins, Inter, sans-serif',
          color: isBtnHovered ? 'rgba(255,255,255,0.85)' : '#4B5563',
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 32px 0',
          flexGrow: 1,
          transition: 'color 0.45s easeOut'
        }}>
          {service.shortDescription}
        </p>
        
        {/* Trigger Button */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: isBtnHovered ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', transition: 'border-color 0.45s easeOut' }}>
          <a 
            href={`/services/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: isBtnHovered ? '#99B6F5' : '#1F3A5C',
              fontWeight: 700,
              fontFamily: 'Poppins, Inter, sans-serif',
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: 'color 0.45s easeOut',
              padding: '8px 16px 8px 0', // larger hover target
            }}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
