const express = require('express');
const router = express.Router();
const { Contact, ContactNote, Student, Assignment, sequelize } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// GET /api/admin/contact-forms
router.get('/', async (req, res) => {
  try {
    const { search, status, dateRange, country, service, sort } = req.query;
    
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (country && country !== 'All') {
      whereClause.country = country;
    }

    if (service && service !== 'All') {
      whereClause.service = service;
    }

    // Default Sort
    let orderClause = [['createdAt', 'DESC']];
    if (sort === 'Oldest First') orderClause = [['createdAt', 'ASC']];
    else if (sort === 'Recently Updated') orderClause = [['updatedAt', 'DESC']];

    let contacts = await Contact.findAll({
      where: whereClause,
      order: orderClause
    });

    contacts = contacts.map(c => {
      const json = c.toJSON();
      if (json.status === 'NEW') json.status = 'New';
      if (json.status === 'CONTACTED') json.status = 'Contacted';
      if (json.status === 'RESOLVED') json.status = 'Resolved';
      return json;
    });

    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/contact-forms/:id
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [{ model: ContactNote, as: 'ContactNotes' }]
    });
    if (!contact) return res.status(404).json({ success: false, error: 'Not found' });
    
    const json = contact.toJSON();
    if (json.status === 'NEW') json.status = 'New';
    if (json.status === 'CONTACTED') json.status = 'Contacted';
    if (json.status === 'RESOLVED') json.status = 'Resolved';

    res.json({ success: true, data: json });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PATCH /api/admin/contact-forms/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: 'Not found' });

    contact.status = status;
    if (status === 'VIEWED' && !contact.viewed_at) contact.viewed_at = new Date();
    await contact.save();

    await ContactNote.create({
      contactId: contact.id,
      note: `Status changed to ${status}`,
      addedBy: 'System'
    });

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/admin/contact-forms/:id/notes
router.post('/:id/notes', async (req, res) => {
  try {
    const { note } = req.body;
    const contactNote = await ContactNote.create({
      contactId: req.params.id,
      note,
      addedBy: 'Admin'
    });
    res.json({ success: true, data: contactNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/admin/contact-forms/:id/follow-up
router.post('/:id/follow-up', async (req, res) => {
  try {
    const { date, time, note } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: 'Not found' });

    contact.follow_up_date = date;
    contact.follow_up_time = time;
    contact.follow_up_note = note;
    contact.status = 'FOLLOW-UP';
    await contact.save();

    await ContactNote.create({
      contactId: contact.id,
      note: `Follow-up scheduled for ${date} at ${time}: ${note}`,
      addedBy: 'Admin'
    });

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/admin/contact-forms/:id/convert
router.post('/:id/convert', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: 'Not found' });

    // Check if student already exists
    const existingStudent = await Student.findOne({ where: { email: contact.email } });
    if (existingStudent) {
      return res.status(400).json({ success: false, error: 'Student with this email already exists' });
    }

    // Create Student
    const student = await Student.create({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      targetCountry: contact.country,
      status: 'New'
    });

    contact.status = 'CONVERTED';
    contact.converted_at = new Date();
    await contact.save();

    await ContactNote.create({
      contactId: contact.id,
      note: `Converted to Student Lead (ID: ${student.id})`,
      addedBy: 'Admin'
    });

    res.json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/admin/contact-forms/:id/archive
router.post('/:id/archive', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: 'Not found' });

    contact.archived_at = new Date();
    contact.status = 'CLOSED';
    await contact.save();

    await ContactNote.create({
      contactId: contact.id,
      note: 'Archived / Closed',
      addedBy: 'Admin'
    });

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
