import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, ArrowRight, X, User, Calendar, Tag, Play } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CounsellingModal from '../components/ui/CounsellingModal';
import { apiUrl, getImageUrl } from '../utils/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isYoutubeUrl(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, onClick, index }) {
  const isVideo = blog.content && (blog.content.includes('youtube.com') || blog.content.includes('youtu.be') || blog.content.includes('vimeo.com'));
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(blog)}
      style={{
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(31,58,92,0.14)' }}
    >
      {/* Cover Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#EBF1FA', overflow: 'hidden', flexShrink: 0 }}>
        {blog.featuredImage ? (
          <img
            src={getImageUrl(blog.featuredImage)}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.parentElement.style.background = 'linear-gradient(135deg, #1F3A5C 0%, #99B6F5 100%)'; e.target.remove(); }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1F3A5C 0%, #99B6F5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={40} color="rgba(255,255,255,0.5)" />
          </div>
        )}
        {/* Category badge */}
        {blog.category && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#1F3A5C', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
            {blog.category}
          </div>
        )}
        {/* Video indicator */}
        {isVideo && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <Play size={22} color="#1F3A5C" style={{ marginLeft: '3px' }} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1F3A5C', margin: '0 0 10px 0', lineHeight: 1.4 }}>
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 16px 0', flexGrow: 1 }}>
            {blog.excerpt.length > 120 ? blog.excerpt.slice(0, 120) + '…' : blog.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
            <User size={13} /> {blog.author || 'Spinfyot Team'}
            {blog.publishedAt && (
              <><span style={{ margin: '0 4px' }}>·</span><Calendar size={13} /> {formatDate(blog.publishedAt)}</>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1F3A5C', fontSize: '13px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
            Read <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Flash Card Popup (Blog Viewer) ───────────────────────────────────────────
function BlogFlashCard({ blog, onClose }) {
  const isVideo = blog.content && (blog.content.includes('youtube.com') || blog.content.includes('youtu.be') || blog.content.includes('vimeo.com'));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler); };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5, 11, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh', // Fixed max-height so it stays within viewport
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Contains the inner scroll and image radius
          }}
        >
          {/* Close - Absolute to Modal so it never scrolls away */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 10,
              width: '36px', height: '36px',
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <X size={18} color="#374151" />
          </button>

          {/* Inner Scroll Container */}
          <div data-lenis-prevent="true" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="custom-blog-scrollbar">
            {/* Cover Image */}
            {blog.featuredImage && (
              <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={getImageUrl(blog.featuredImage)} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ padding: '36px 40px 48px', fontFamily: 'Poppins, sans-serif' }}>
            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              {blog.category && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EBF1FA', color: '#1F3A5C', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>
                  <Tag size={12} /> {blog.category}
                </span>
              )}
              {blog.publishedAt && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#9CA3AF', fontSize: '12px' }}>
                  <Calendar size={12} /> {formatDate(blog.publishedAt)}
                </span>
              )}
              {blog.author && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#9CA3AF', fontSize: '12px' }}>
                  <User size={12} /> {blog.author}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#1F3A5C', lineHeight: 1.3, margin: '0 0 20px 0' }}>
              {blog.title}
            </h2>

            {/* Excerpt */}
            {blog.excerpt && (
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.7, borderLeft: '4px solid #99B6F5', paddingLeft: '16px', margin: '0 0 28px 0', fontStyle: 'italic' }}>
                {blog.excerpt}
              </p>
            )}

            {/* Main Content — Video or Text */}
            {isVideo ? (
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
                <iframe
                  src={blog.content}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block' }}
                  title={blog.title}
                />
              </div>
            ) : (
              <div style={{ fontSize: '16px', color: '#374151', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {blog.content}
              </div>
            )}
          </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
      <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#F3F4F6' }} className="animate-pulse" />
      <div style={{ padding: '24px' }}>
        <div style={{ height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '12px', width: '40%' }} className="animate-pulse" />
        <div style={{ height: '20px', backgroundColor: '#E5E7EB', borderRadius: '6px', marginBottom: '8px' }} className="animate-pulse" />
        <div style={{ height: '20px', backgroundColor: '#E5E7EB', borderRadius: '6px', width: '70%', marginBottom: '20px' }} className="animate-pulse" />
        <div style={{ height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', width: '50%' }} className="animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main BlogPage ────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    document.title = 'Our Blog | Spinfyot';
    window.scrollTo(0, 0);
    fetch(apiUrl('/api/public/blogs'))
      .then(r => r.json())
      .then(data => { if (data.success) setBlogs(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const hasBlogs = !loading && blogs.length > 0;
  const isEmpty = !loading && blogs.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'Poppins, sans-serif' }}>
      <Header onInquireClick={openModal} />
      <div style={{ paddingTop: '100px' }} />

      <main style={{ flexGrow: 1, paddingBottom: '0' }}>
        {/* HERO */}
        <section style={{ backgroundColor: '#050B14', padding: '60px 5% 80px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '80px', height: '80px', backgroundColor: 'rgba(153, 182, 245, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '1px solid rgba(153, 182, 245, 0.2)' }}
            >
              <BookOpen style={{ color: '#99B6F5', width: '40px', height: '40px' }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3.5rem, 7vw, 6rem)', color: '#99B6F5', margin: '0 0 24px 0', lineHeight: 1, fontWeight: 700 }}
            >
              Our Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(248,249,250,0.8)', maxWidth: '680px', margin: 0, lineHeight: 1.7 }}
            >
              Tips, stories, and guides to make your study abroad journey smoother.
            </motion.p>
          </div>
        </section>

        {/* BLOG GRID or EMPTY STATE */}
        <section style={{ maxWidth: '1200px', margin: '-40px auto 0 auto', padding: '0 5% 80px' }}>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px', paddingTop: '60px' }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Real blogs grid */}
          {hasBlogs && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px', paddingTop: '60px' }}>
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} onClick={setSelectedBlog} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: 'clamp(40px, 5vw, 80px)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '40px' }}
            >
              <Coffee size={48} style={{ color: '#E57A44', marginBottom: '24px', opacity: 0.8 }} />
              <h2 style={{ fontSize: '28px', color: '#1F3A5C', fontWeight: 700, margin: '0 0 16px 0' }}>We're brewing something special.</h2>
              <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: 1.8, maxWidth: '700px', margin: '0 0 40px 0' }}>
                Our team is working on guides, student success stories, and university spotlights. Check back soon!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', marginBottom: '40px' }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            </motion.div>
          )}
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#EBF1FA', padding: '100px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Caveat", cursive', fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#1F3A5C', margin: '0 0 24px 0', lineHeight: 1, fontWeight: 700 }}>Want personalized advice?</h2>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#4B5563', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
            Schedule a free 1-on-1 session with our expert counselors to map out your exact study abroad journey.
          </p>
          <button
            onClick={openModal}
            style={{ backgroundColor: '#1F3A5C', color: '#FFFFFF', fontSize: '18px', fontWeight: 600, padding: '20px 48px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px rgba(31, 58, 92, 0.2)' }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#99B6F5'; e.currentTarget.style.color = '#1F3A5C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#1F3A5C'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Book Free Counselling
          </button>
        </section>
      </main>

      <Footer onInquireClick={openModal} />
      <CounsellingModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Flash Card Popup */}
      {selectedBlog && <BlogFlashCard blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
    </div>
  );
}
