import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../ui/ServiceCard';
import services from '../../data/services';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

export default function Services({ isHome = false }) {
  const displayServices = isHome 
    ? [
        ...services.slice(0, 8),
        {
          slug: '',
          link: '/services',
          title: 'All Services',
          shortDescription: 'Explore our complete range of global education and student support services.',
          icon: LayoutGrid
        }
      ]
    : services;

  return (
    <section 
      id="services" 
      style={{
        backgroundColor: 'transparent',
        padding: 'clamp(60px, 10vw, 120px) 5%',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Premium Centered Heading */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: 'clamp(4rem, 8vw, 6.5rem)',
              color: '#99B6F5',
              textAlign: 'center',
              margin: '0 0 20px 0',
              fontWeight: 700,
              lineHeight: 1,
              textShadow: '0 4px 20px rgba(153, 182, 245, 0.15)'
            }}
          >
            Our Services
          </motion.h2>
          
          
          
          
        </div>

        {/* Responsive Grid */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '32px',
            width: '100%',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayServices.map((service, index) => (
            <motion.div key={service.slug || 'all-services'} variants={itemVariants} style={{ display: 'flex', width: '100%' }}>
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
