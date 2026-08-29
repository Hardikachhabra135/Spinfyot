const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { Admin, Appointment, Contact, Question, Testimonial, Blog, EventLog, sequelize } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
  fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
}

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    
    if (!admin) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const totalAppointments = await Appointment.count();
    const newAppointments = await Appointment.count({ where: { status: 'New' } });
    const totalContacts = await Contact.count();
    const totalQuestions = await Question.count();
    const publishedBlogs = await Blog.count({ where: { isPublished: true } });
    const activeTestimonials = await Testimonial.count({ where: { isActive: true } });

    res.json({
      success: true,
      data: {
        totalAppointments,
        newAppointments,
        totalContacts,
        totalQuestions,
        publishedBlogs,
        activeTestimonials
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/appointments
router.get('/appointments', authMiddleware, async (req, res) => {
  try {
    const data = await Appointment.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/appointments/:id/status
router.put('/appointments/:id/status', authMiddleware, async (req, res) => {
  try {
    await Appointment.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/contacts
router.get('/contacts', authMiddleware, async (req, res) => {
  try {
    const data = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/contacts/:id/status
router.put('/contacts/:id/status', authMiddleware, async (req, res) => {
  try {
    await Contact.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/questions
router.get('/questions', authMiddleware, async (req, res) => {
  try {
    const data = await Question.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/questions/:id/status
router.put('/questions/:id/status', authMiddleware, async (req, res) => {
  try {
    await Question.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// CRUD Testimonials
router.get('/testimonials', authMiddleware, async (req, res) => {
  const data = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ success: true, data });
});

router.post('/testimonials', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const activeCount = await Testimonial.count({ where: { isActive: true } });
    const isActive = req.body.isActive === 'true' || req.body.isActive === true;
    
    if (isActive && activeCount >= 6) {
      return res.status(400).json({ success: false, error: 'Maximum of 6 active testimonials allowed.' });
    }

    const { name, quote } = req.body;
    let photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!photoUrl && req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    }

    const t = await Testimonial.create({ name, quote, isActive, photoUrl });
    res.json({ success: true, data: t });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/testimonials/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, quote } = req.body;
    const isActive = req.body.isActive === 'true' || req.body.isActive === true;
    
    if (isActive) {
      const activeCount = await Testimonial.count({ where: { isActive: true, id: { [sequelize.Sequelize.Op.ne]: req.params.id } } });
      if (activeCount >= 6) {
        return res.status(400).json({ success: false, error: 'Maximum of 6 active testimonials allowed.' });
      }
    }

    const updateData = { name, quote, isActive };
    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    await Testimonial.update(updateData, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CRUD Blogs
router.get('/blogs', authMiddleware, async (req, res) => {
  const data = await Blog.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ success: true, data });
});

router.post('/blogs', authMiddleware, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, author, category, videoUrl } = req.body;
    const isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
    const publishedAt = isPublished ? new Date() : null;
    let featuredImage = req.file ? `/uploads/${req.file.filename}` : null;
    if (!featuredImage && req.body.featuredImageUrl) featuredImage = req.body.featuredImageUrl;

    const b = await Blog.create({ title, slug, excerpt, content, author, category, featuredImage, isPublished, publishedAt });
    res.json({ success: true, data: b });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/blogs/:id', authMiddleware, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, author, category } = req.body;
    const isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
    
    const blog = await Blog.findByPk(req.params.id);
    let publishedAt = blog.publishedAt;
    if (isPublished && !blog.isPublished) publishedAt = new Date();
    
    const updateData = { title, slug, excerpt, content, author, category, isPublished, publishedAt };
    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    await Blog.update(updateData, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    await Blog.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics Export or Raw data (for charts)
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    // For simplicity, we just return the last 1000 events or group by date
    // A better approach would be to aggregate in SQL, but for demonstration:
    const logs = await EventLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      limit: 30
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
