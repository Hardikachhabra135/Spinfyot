import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from '../App';
import { Plus, Edit2, Trash2, X, Image, Play, FileText, Upload } from 'lucide-react';

const CATEGORIES = ['Study Tips', 'University Spotlight', 'Visa & Documents', 'Student Life', 'Scholarships', 'Destinations', 'Success Stories', 'General'];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editBlog, setEditBlog] = useState(null); // null = add new, object = edit
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', author: 'Spinfyot Team',
    category: 'General', isPublished: false, coverPhoto: null, coverUrl: '',
    videoUrl: '',
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [contentType, setContentType] = useState('text'); // 'text' | 'video'
  const { token } = useAuth();

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setBlogs(res.data.data);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const openAdd = () => {
    setEditBlog(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', author: 'Spinfyot Team', category: 'General', isPublished: false, coverPhoto: null, coverUrl: '', videoUrl: '' });
    setCoverPreview(null);
    setContentType('text');
    setIsModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditBlog(blog);
    setForm({
      title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '',
      content: blog.content, author: blog.author || 'Spinfyot Team',
      category: blog.category || 'General', isPublished: blog.isPublished,
      coverPhoto: null, coverUrl: blog.featuredImage || '', videoUrl: blog.videoUrl || '',
    });
    setCoverPreview(blog.featuredImage ? blog.featuredImage : null);
    setContentType(blog.videoUrl ? 'video' : 'text');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, coverPhoto: file }));
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleTitleChange = (e) => {
    const t = e.target.value;
    setForm(f => ({ ...f, title: t, slug: slugify(t) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return alert('Title and slug are required.');
    if (contentType === 'text' && !form.content.trim()) return alert('Content is required.');
    if (contentType === 'video' && !form.videoUrl.trim()) return alert('Video URL is required.');

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('slug', form.slug);
      data.append('excerpt', form.excerpt);
      // For video type: store videoUrl in content field + extra field
      data.append('content', contentType === 'video' ? form.videoUrl : form.content);
      data.append('author', form.author);
      data.append('category', form.category);
      data.append('isPublished', form.isPublished);
      data.append('videoUrl', contentType === 'video' ? form.videoUrl : '');
      if (form.coverPhoto) {
        data.append('featuredImage', form.coverPhoto);
      } else if (form.coverUrl) {
        data.append('featuredImageUrl', form.coverUrl);
      }

      let res;
      if (editBlog) {
        res = await api.put(`/api/admin/blogs/${editBlog.id}`, data, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          await fetchBlogs();
          setIsModalOpen(false);
        }
      } else {
        res = await api.post('/api/admin/blogs', data, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          setBlogs([res.data.data, ...blogs]);
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save blog.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/api/admin/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Blog Management</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} /> Add New Blog
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Article</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Published</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading blogs...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No blog posts yet. Click "Add New Blog" to create one.</td></tr>
              ) : (
                blogs.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.featuredImage && (
                          <img src={getImageUrl(item.featuredImage)} alt="" className="w-12 h-10 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{item.title}</div>
                          <div className="text-xs text-slate-400">/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{item.category}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${item.isPublished ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {item.isPublished && item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add / Edit Blog Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-800">{editBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Cover Photo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Photo</label>
                {coverPreview && (
                  <img src={coverPreview.startsWith('blob:') ? coverPreview : coverPreview} alt="Cover" className="w-full h-44 object-cover rounded-xl mb-3" onError={e => e.target.style.display='none'} />
                )}
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
                    <Upload size={16} /> Browse from Device
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  <span className="text-slate-400 text-sm self-center">OR paste URL:</span>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="mt-2 w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  value={form.coverUrl}
                  onChange={e => { setForm(f => ({ ...f, coverUrl: e.target.value })); if (e.target.value) setCoverPreview(e.target.value); }}
                />
              </div>

              {/* Title + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={form.title} onChange={handleTitleChange} placeholder="Blog post title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="my-blog-post" />
                </div>
              </div>

              {/* Author + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Author</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Short Excerpt</label>
                <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm h-16 resize-none" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="A short summary shown on the blog card..." />
              </div>

              {/* Content Type Toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setContentType('text')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${contentType === 'text' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                    <FileText size={16} /> Text / Article
                  </button>
                  <button type="button" onClick={() => setContentType('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${contentType === 'video' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                    <Play size={16} /> Video
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {contentType === 'text' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Article Content *</label>
                  <textarea required={contentType === 'text'} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm h-48 resize-none" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write the full blog content here..." />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Video URL (YouTube / Vimeo embed URL) *</label>
                  <input type="url" required={contentType === 'video'} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
                  <p className="text-xs text-slate-400 mt-1">Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID</p>
                </div>
              )}

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <span className="text-sm font-semibold text-slate-700">Publish immediately</span>
                {!form.isPublished && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Will be saved as Draft</span>}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? 'Saving...' : editBlog ? 'Update Blog' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
