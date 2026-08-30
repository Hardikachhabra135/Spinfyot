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

// Associations
Referral.hasMany(ReferralClick, { foreignKey: 'referralId' });
ReferralClick.belongsTo(Referral, { foreignKey: 'referralId' });

Referral.hasMany(ReferralConversion, { foreignKey: 'referralId' });
ReferralConversion.belongsTo(Referral, { foreignKey: 'referralId' });

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
  ReferralConversion
};
