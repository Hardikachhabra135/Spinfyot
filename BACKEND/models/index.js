const sequelize = require('../config/database');
const Admin = require('./Admin');
const Appointment = require('./Appointment');
const Contact = require('./Contact');
const Question = require('./Question');
const Testimonial = require('./Testimonial');
const Blog = require('./Blog');
const EventLog = require('./EventLog');
const Referral = require('./Referral');
const ReferralClick = require('./ReferralClick');
const ReferralConversion = require('./ReferralConversion');

const Counsellor = require('./Counsellor');
const Student = require('./Student');
const Assignment = require('./Assignment');
const Message = require('./Message');

// Associations
Referral.hasMany(ReferralClick, { foreignKey: 'referralId' });
ReferralClick.belongsTo(Referral, { foreignKey: 'referralId' });

Referral.hasMany(ReferralConversion, { foreignKey: 'referralId' });
ReferralConversion.belongsTo(Referral, { foreignKey: 'referralId' });

Counsellor.hasMany(Appointment, { foreignKey: 'counsellorId' });
Appointment.belongsTo(Counsellor, { foreignKey: 'counsellorId' });

Counsellor.hasMany(Contact, { foreignKey: 'counsellorId' });
Contact.belongsTo(Counsellor, { foreignKey: 'counsellorId' });

Counsellor.hasMany(Student, { foreignKey: 'counsellorId' });
Student.belongsTo(Counsellor, { foreignKey: 'counsellorId' });

Appointment.hasMany(Assignment, { foreignKey: 'appointmentId' });
Assignment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Counsellor.hasMany(Assignment, { foreignKey: 'counsellorId' });
Assignment.belongsTo(Counsellor, { foreignKey: 'counsellorId' });

Admin.hasMany(Message, { foreignKey: 'adminId' });
Message.belongsTo(Admin, { foreignKey: 'adminId' });

Counsellor.hasMany(Message, { foreignKey: 'counsellorId' });
Message.belongsTo(Counsellor, { foreignKey: 'counsellorId' });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Safely add columns using raw SQL since TiDB crashes on sync({ alter: true }) for unique keys
    try {
      await sequelize.query('ALTER TABLE `appointments` ADD COLUMN `referralSlug` VARCHAR(255);');
    } catch (e) {}
    
    try {
      await sequelize.query('ALTER TABLE `contacts` ADD COLUMN `referralSlug` VARCHAR(255);');
    } catch (e) {}
    
    try {
      await sequelize.query('ALTER TABLE `appointments` ADD COLUMN `counsellorId` INTEGER;');
    } catch (e) {}

    try {
      await sequelize.query('ALTER TABLE `contacts` ADD COLUMN `counsellorId` INTEGER;');
    } catch (e) {}

    try {
      await sequelize.query('ALTER TABLE `students` MODIFY `counsellorId` INTEGER NULL;');
    } catch (e) {}

    // Add new fields to students
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `age` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `currentEducation` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `otherQualification` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `currentCountry` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `currentCity` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `targetCountry` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `targetCourse` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `visaApplied` TINYINT(1) DEFAULT 0;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `budget` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `totalConsultancyAmount` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `advancePaid` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `remainingAmount` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `intakeTerm` VARCHAR(255);'); } catch (e) {}
    
    // New fields from 20+ fields revamp
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `passportNo` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `sourceOfIncome` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `familyContact` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `address` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `edu10th` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `edu12th` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `eduDiploma` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `eduGraduation` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `eduMasters` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `jobExperience` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `englishLevel` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `languageTests` TEXT;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `prefCountry` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `targetUniversity` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `referredBy` VARCHAR(255);'); } catch (e) {}

    // Add new fields to assignments
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `interestLevel` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `reminderDate` DATE;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `totalAmount` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `amountReceived` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `advanceReceived` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `assignments` ADD COLUMN `amountUsed` INTEGER;'); } catch (e) {}

    // Add unread tracking for Everyone messages
    try { await sequelize.query('ALTER TABLE `admins` ADD COLUMN `lastReadEveryoneMessageId` INTEGER DEFAULT 0;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `counsellors` ADD COLUMN `lastReadEveryoneMessageId` INTEGER DEFAULT 0;'); } catch (e) {}

    // Create messages table explicitly (for production MySQL/TiDB compatibility)
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`messages\` (
          \`id\` INTEGER NOT NULL AUTO_INCREMENT,
          \`adminId\` INTEGER,
          \`counsellorId\` INTEGER,
          \`sender\` ENUM('Admin','Counsellor') NOT NULL,
          \`conversationType\` ENUM('DIRECT','EVERYONE') DEFAULT 'DIRECT',
          \`content\` TEXT NOT NULL,
          \`isRead\` TINYINT(1) DEFAULT 0,
          \`createdAt\` DATETIME NOT NULL,
          \`updatedAt\` DATETIME NOT NULL,
          PRIMARY KEY (\`id\`)
        );
      `);
    } catch (e) {}

    // Alter existing messages table if it already exists (make foreign keys nullable for EVERYONE chat)
    try { await sequelize.query('ALTER TABLE `messages` MODIFY `adminId` INTEGER NULL;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `messages` MODIFY `counsellorId` INTEGER NULL;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `messages` ADD COLUMN `conversationType` VARCHAR(255) DEFAULT \'DIRECT\';'); } catch (e) {}

    // Run normal sync to create missing tables without altering existing ones
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  Admin,
  Appointment,
  Contact,
  Question,
  Testimonial,
  Blog,
  EventLog,
  Referral,
  ReferralClick,
  ReferralConversion,
  Counsellor,
  Student,
  Assignment,
  Message
};
