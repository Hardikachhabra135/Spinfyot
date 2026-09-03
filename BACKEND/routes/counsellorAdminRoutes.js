const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Counsellor, Appointment, Contact, sequelize } = require('../models');

// Admin Auth Middleware (duplicate to avoid breaking adminRoutes)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'counsellor') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admins only' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error in counsellorAdminRoutes:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// GET all counsellors (with stats)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const counsellors = await Counsellor.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Get stats
    const detailed = await Promise.all(counsellors.map(async (c) => {
      const leads = await Contact.count({ where: { counsellorId: c.id } });
      const appointments = await Appointment.count({ where: { counsellorId: c.id } });
      return { ...c.toJSON(), leads, appointments };
    }));
    
    res.json({ success: true, data: detailed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new counsellor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, counsellorId, email, phone, password, specialization, bio, status } = req.body;
    
    // Check if exists
    const existing = await Counsellor.findOne({ where: { counsellorId } });
    if (existing) return res.status(400).json({ success: false, error: 'Counsellor ID already exists' });
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random()*1000);
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newCounsellor = await Counsellor.create({
      name, counsellorId, email, phone, passwordHash, slug, specialization, bio, status: status || 'Active'
    });
    
    res.status(201).json({ success: true, data: newCounsellor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update counsellor status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const counsellor = await Counsellor.findByPk(req.params.id);
    if (!counsellor) return res.status(404).json({ success: false, error: 'Not found' });
    counsellor.status = req.body.status;
    await counsellor.save();
    res.json({ success: true, data: counsellor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE counsellor (soft delete or hard delete depending on requirement, we'll just hard delete for simplicity or leave as disabled)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const counsellor = await Counsellor.findByPk(req.params.id);
    if (!counsellor) return res.status(404).json({ success: false, error: 'Not found' });
    await counsellor.destroy();
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset password
router.put('/:id/reset-password', authMiddleware, async (req, res) => {
  try {
    const counsellor = await Counsellor.findByPk(req.params.id);
    if (!counsellor) return res.status(404).json({ success: false, error: 'Not found' });
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    counsellor.passwordHash = passwordHash;
    await counsellor.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
