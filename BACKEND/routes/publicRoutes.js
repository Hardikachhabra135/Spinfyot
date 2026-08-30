const express = require('express');
const router = express.Router();
const { Appointment, Contact, Question, Testimonial, Blog, EventLog, Referral, ReferralClick, ReferralConversion } = require('../models');

// POST /api/public/appointments
router.post('/appointments', async (req, res) => {
  try {
    const { name, classType, phoneNumber, email, sourcePage, referralSlug } = req.body;
    const appointment = await Appointment.create({
      name, email, phoneNumber, classType, sourcePage, referralSlug
    });
    
    // Log conversion if referral exists
    if (referralSlug) {
      const ref = await Referral.findOne({ where: { slug: referralSlug, status: 'Active' } });
      if (ref) {
        await ReferralConversion.create({
          referralId: ref.id,
          visitorId: req.body.visitorId || 'unknown',
          conversionType: 'Appointment',
          recordId: appointment.id
        });
      }
    }
    
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/public/contacts
router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, interest, message, referralSlug } = req.body;
    const contact = await Contact.create({
      name, email, phone, interest, message, referralSlug
    });

    if (referralSlug) {
      const ref = await Referral.findOne({ where: { slug: referralSlug, status: 'Active' } });
      if (ref) {
        await ReferralConversion.create({
          referralId: ref.id,
          visitorId: req.body.visitorId || 'unknown',
          conversionType: 'Contact',
          recordId: contact.id
        });
      }
    }

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

// GET /api/public/referrals/:slug
router.get('/referrals/:slug', async (req, res) => {
  try {
    const ref = await Referral.findOne({
      where: { slug: req.params.slug, status: 'Active' }
    });
    if (!ref) return res.status(404).json({ success: false, error: 'Referral not found or inactive' });
    res.status(200).json({ success: true, data: { influencerName: ref.influencerName, slug: ref.slug } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/public/referrals/track
router.post('/referrals/track', async (req, res) => {
  try {
    const { slug, visitorId, landingPage, deviceType, referrer } = req.body;
    const ref = await Referral.findOne({ where: { slug, status: 'Active' } });
    if (!ref) return res.status(404).json({ success: false, error: 'Referral not found' });
    
    await ReferralClick.create({
      referralId: ref.id,
      visitorId,
      landingPage,
      deviceType,
      referrer
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
