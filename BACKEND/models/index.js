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

    // Add new fields to students
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `age` INTEGER;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `currentEducation` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `currentCity` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `targetCountry` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `targetCourse` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `visaApplied` TINYINT(1) DEFAULT 0;'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `budget` VARCHAR(255);'); } catch (e) {}
    try { await sequelize.query('ALTER TABLE `students` ADD COLUMN `intakeTerm` VARCHAR(255);'); } catch (e) {}

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
  Assignment
};
