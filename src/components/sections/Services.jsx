import { motion } from 'framer-motion';
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

export default function Services() {
  return (
    <section 
      id="services" 
      style={{
        backgroundColor: 'transparent',
        padding: '120px 5%',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Premium Centered Heading */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
          <motion.h2
            initial={{ clipPath: "polygon(0 -20%, 0 -20%, 0 120%, 0 120%)", opacity: 0, y: 20 }}
            whileInView={{ clipPath: "polygon(0 -20%, 110% -20%, 110% 120%, 0 120%)", opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
          {services.map((service, index) => (
            <motion.div key={service.slug} variants={itemVariants} style={{ display: 'flex', width: '100%' }}>
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
