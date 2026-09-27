import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CounsellingModal from '../components/ui/CounsellingModal';
import { apiUrl, getImageUrl } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(apiUrl('/api/public/blogs'))
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const found = data.data.find(b => b.slug === slug);
          if (found) {
            setBlog(found);
          } else {
            setError('Blog not found');
          }
        } else {
          setError('Failed to load blog');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    
    // Dynamic SEO
    const prevTitle = document.title;
    document.title = `${blog.title} | Spinfyot Blog`;
    
    const updateOrCreateMeta = (selector, nameAttr, nameVal, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    updateOrCreateMeta('meta[name="description"]', 'name', 'description', blog.excerpt || '');
    updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', blog.title);
    updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', blog.excerpt || '');
    updateOrCreateMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', `https://spinfyot.com/blog/${slug}`);

    if (blog.featuredImage) {
      updateOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', getImageUrl(blog.featuredImage));
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://spinfyot.com/blog/${slug}`);

    return () => {
      document.title = prevTitle;
    };
  }, [blog, slug]);

  const isVideo = blog?.content && (blog.content.includes('youtube.com') || blog.content.includes('youtu.be') || blog.content.includes('vimeo.com'));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Blog not found'}</h1>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'Poppins, sans-serif' }}>
      <Header onInquireClick={() => setIsModalOpen(true)} />
      <div style={{ paddingTop: '100px' }} />

      <main style={{ flexGrow: 1, paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '800px', padding: '0 20px' }}
        >
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '14px', textDecoration: 'none', marginBottom: '30px', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to all blogs
          </Link>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
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

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1F3A5C', lineHeight: 1.25, margin: '0 0 24px 0' }}>
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p style={{ fontSize: '18px', color: '#4B5563', lineHeight: 1.7, margin: '0 0 32px 0', borderLeft: '4px solid #99B6F5', paddingLeft: '16px' }}>
              {blog.excerpt}
            </p>
          )}

          {blog.featuredImage && (
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img src={getImageUrl(blog.featuredImage)} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {isVideo ? (
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', background: '#000', marginBottom: '40px' }}>
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
        </motion.article>
      </main>

      <Footer onInquireClick={() => setIsModalOpen(true)} />
      <CounsellingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
