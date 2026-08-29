const express = require('express');
const router = express.Router();
const { Appointment, Contact, Question, Testimonial, Blog, EventLog } = require('../models');

// POST /api/public/appointments
router.post('/appointments', async (req, res) => {
  try {
    const { name, classType, phoneNumber, email, sourcePage } = req.body;
    const appointment = await Appointment.create({
      name, email, phoneNumber, classType, sourcePage
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/public/contacts
router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;
    const contact = await Contact.create({
      name, email, phone, interest, message
    });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/public/questions
router.post('/questions', async (req, res) => {
  try {
    const { name, email, question, serviceSlug } = req.body;
    const q = await Question.create({
      name, email, question, serviceSlug
    });
    res.status(201).json({ success: true, data: q });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/public/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 6
    });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/public/blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/public/blogs/:slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug, isPublished: true }
    });
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/public/analytics/track
router.post('/analytics/track', async (req, res) => {
  try {
    const { eventType, path, metadata } = req.body;
    await EventLog.create({
      eventType: eventType || 'page_view',
      path,
      metadata
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    // Don't fail the request for analytics issues
    res.status(200).json({ success: false });
  }
});

module.exports = router;
