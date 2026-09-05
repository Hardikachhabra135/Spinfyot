const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Counsellor, Appointment, Contact, Student, Assignment, sequelize } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '../uploads/students/');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Portal Auth Middleware
const portalAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'counsellor') {
      return res.status(403).json({ success: false, error: 'Forbidden: Counsellors only' });
    }
    req.counsellor = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { counsellorId, password } = req.body;
    
    const { Op } = require('sequelize');
    const counsellor = await Counsellor.findOne({ 
      where: { 
        [Op.or]: [
          { counsellorId: counsellorId },
          { email: counsellorId }
        ]
      } 
    });
    
    if (!counsellor) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    
    if (counsellor.status !== 'Active') {
      return res.status(403).json({ success: false, error: 'Your account is disabled. Please contact the administrator.' });
    }

    const isValid = await counsellor.validatePassword(password);
    if (!isValid) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    counsellor.lastLoginAt = new Date();
    await counsellor.save();

    const token = jwt.sign({ id: counsellor.id, role: 'counsellor', slug: counsellor.slug }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ success: true, token, counsellor: { id: counsellor.id, name: counsellor.name, slug: counsellor.slug, counsellorId: counsellor.counsellorId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Dashboard Data
router.get('/dashboard', portalAuthMiddleware, async (req, res) => {
  try {
    const cId = req.counsellor.id;
    
    // Student metrics
    const totalStudents = await Student.count({ where: { counsellorId: cId } });
    const newStudents = await Student.count({ where: { counsellorId: cId, status: 'New' } });
    const pendingCallbacks = await Student.count({ where: { counsellorId: cId, callbackRequested: true } });
    const enrolledStudents = await Student.count({ where: { counsellorId: cId, status: 'Enrolled' } });
    
    // Optional: Get upcoming callbacks to display in the dashboard
    const upcomingCallbacks = await Student.findAll({
      where: { counsellorId: cId, callbackRequested: true },
      order: [['callbackTime', 'ASC']],
      limit: 5
    });

    res.json({ 
      success: true, 
      data: { totalStudents, newStudents, pendingCallbacks, enrolledStudents, upcomingCallbacks } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Leads
router.get('/leads', portalAuthMiddleware, async (req, res) => {
  try {
    const leads = await Contact.findAll({ where: { counsellorId: req.counsellor.id }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Appointments
router.get('/appointments', portalAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { counsellorId: req.counsellor.id }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Profile
router.get('/profile', portalAuthMiddleware, async (req, res) => {
  try {
    const counsellor = await Counsellor.findByPk(req.counsellor.id, { attributes: { exclude: ['passwordHash'] } });
    res.json({ success: true, data: counsellor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---- STUDENTS & CALLBACKS ---- //

router.get('/students', portalAuthMiddleware, async (req, res) => {
  try {
    const students = await Student.findAll({ where: { counsellorId: req.counsellor.id }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/students', portalAuthMiddleware, async (req, res) => {
  try {
    const { name, email, phone, notes, callbackRequested, callbackTime, status, age, currentEducation, currentCity, targetCountry, targetCourse, visaApplied, budget, intakeTerm } = req.body;
    const student = await Student.create({
      counsellorId: req.counsellor.id,
      name, email, phone, notes,
      age, currentEducation, currentCity, targetCountry, targetCourse, visaApplied, budget, intakeTerm,
      callbackRequested: callbackRequested === true || callbackRequested === 'true',
      callbackTime: callbackTime || null,
      status: status || 'New',
      documents: JSON.stringify([])
    });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/students/:id/upload', portalAuthMiddleware, upload.array('documents', 5), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, counsellorId: req.counsellor.id } });
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    let existingDocs = [];
    if (student.documents) {
      try { existingDocs = JSON.parse(student.documents); } catch (e) { existingDocs = []; }
    }

    const newDocs = req.files.map(f => ({
      name: f.originalname,
      path: '/uploads/students/' + f.filename,
      uploadedAt: new Date()
    }));

    student.documents = JSON.stringify([...existingDocs, ...newDocs]);
    await student.save();
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/students/:id', portalAuthMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, counsellorId: req.counsellor.id } });
    if (!student) return res.status(404).json({ success: false, error: 'Not found' });
    
    const { name, email, phone, notes, callbackRequested, callbackTime, status, age, currentEducation, currentCity, targetCountry, targetCourse, visaApplied, budget, intakeTerm } = req.body;
    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (notes !== undefined) student.notes = notes;
    if (age !== undefined) student.age = age;
    if (currentEducation !== undefined) student.currentEducation = currentEducation;
    if (currentCity !== undefined) student.currentCity = currentCity;
    if (targetCountry !== undefined) student.targetCountry = targetCountry;
    if (targetCourse !== undefined) student.targetCourse = targetCourse;
    if (visaApplied !== undefined) student.visaApplied = visaApplied;
    if (budget !== undefined) student.budget = budget;
    if (intakeTerm !== undefined) student.intakeTerm = intakeTerm;
    
    if (callbackRequested !== undefined) student.callbackRequested = callbackRequested === true || callbackRequested === 'true';
    if (callbackTime !== undefined) student.callbackTime = callbackTime || null;
    if (status !== undefined) student.status = status;
    
    await student.save();
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/students/:id', portalAuthMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, counsellorId: req.counsellor.id } });
    if (!student) return res.status(404).json({ success: false, error: 'Not found' });
    
    await student.destroy();
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- NEW ASSIGNMENT SYSTEM ROUTES (COUNSELLOR) ---

// Get all students assigned to this counsellor
router.get('/assigned-students', portalAuthMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { 
        counsellorId: req.counsellor.id,
        isActive: true 
      },
      include: [
        { model: Appointment }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update assignment tracking (status, notes, followup)
router.put('/assigned-students/:id', portalAuthMiddleware, async (req, res) => {
  try {
    // Ensure the assignment actually belongs to this counsellor and is active
    const assignment = await Assignment.findOne({
      where: {
        id: req.params.id,
        counsellorId: req.counsellor.id,
        isActive: true
      }
    });

    if (!assignment) return res.status(404).json({ success: false, error: 'Not found or not assigned to you' });

    const { counsellorStatus, counsellorNote, nextFollowUp } = req.body;
    
    if (counsellorStatus !== undefined) assignment.counsellorStatus = counsellorStatus;
    if (counsellorNote !== undefined) assignment.counsellorNote = counsellorNote;
    if (nextFollowUp !== undefined) assignment.nextFollowUp = nextFollowUp;

    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add assigned student to "My Students" CRM
router.post('/assigned-students/:id/add-to-mystudents', portalAuthMiddleware, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      where: {
        id: req.params.id,
        counsellorId: req.counsellor.id,
        isActive: true
      },
      include: [{ model: Appointment }]
    });

    if (!assignment) return res.status(404).json({ success: false, error: 'Not found' });

    const appt = assignment.Appointment;

    // Note: We deliberately do not check for existing emails here,
    // as the manual "Add New Student" form also allows multiple entries 
    // with the same email if needed.

    const newStudent = await Student.create({
      counsellorId: req.counsellor.id,
      name: appt.name,
      email: appt.email,
      phone: appt.phoneNumber,
      currentEducation: appt.classType,
      status: 'New'
    });

    // Optionally update assignment status to Converted
    assignment.counsellorStatus = 'Converted';
    await assignment.save();

    res.json({ success: true, data: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// --- COUNSELLOR MESSAGING ROUTES ---
const { Message, Admin } = require('../models');

// 1. Get all admins (usually just one, but we return a list for flexibility)
router.get('/messages/admins', portalAuthMiddleware, async (req, res) => {
  try {
    console.log("Fetching admins for counsellor:", req.counsellor);
    const admins = await Admin.findAll({
      attributes: ['id', 'email']
    });
    console.log("Found admins:", admins.map(a => a.id));

    const chatList = await Promise.all(admins.map(async (admin) => {
      console.log("Querying messages for adminId:", admin.id, "counsellorId:", req.counsellor.id);
      const messages = await Message.findAll({
        where: { adminId: admin.id, counsellorId: req.counsellor.id },
        order: [['createdAt', 'DESC']]
      });
      console.log("Messages found:", messages.length);

      const unreadCount = messages.filter(m => m.sender === 'Admin' && !m.isRead).length;
      const lastMessage = messages[0] || null;

      return {
        id: admin.id,
        name: 'Administrator', // Mask email with a professional name
        email: admin.email,
        unreadCount,
        lastMessage
      };
    }));

    chatList.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    console.log("Returning chatList:", chatList.length);
    res.json({ success: true, admins: chatList });
  } catch (error) {
    console.error('Error fetching admin chat list:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// IMPORTANT: unread-count must be BEFORE /:adminId to avoid Express treating "unread-count" as a param
router.get('/messages/unread-count', portalAuthMiddleware, async (req, res) => {
  try {
    const count = await Message.count({ where: { counsellorId: req.counsellor.id, sender: 'Admin', isRead: false } });
    res.json({ success: true, count });
  } catch (error) {
    res.json({ success: false, count: 0 });
  }
});

// 2. Get messages with a specific admin
router.get('/messages/:adminId', portalAuthMiddleware, async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Mark unread messages from Admin to this Counsellor as read
    await Message.update(
      { isRead: true },
      { where: { adminId, counsellorId: req.counsellor.id, sender: 'Admin', isRead: false } }
    );

    const messages = await Message.findAll({
      where: { adminId, counsellorId: req.counsellor.id },
      order: [['createdAt', 'ASC']]
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// 3. Send a message to an admin
router.post('/messages/:adminId', portalAuthMiddleware, async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const message = await Message.create({
      adminId,
      counsellorId: req.counsellor.id,
      sender: 'Counsellor',
      content: content.trim(),
      isRead: false
    });

    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


module.exports = router;
