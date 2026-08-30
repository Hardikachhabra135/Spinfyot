const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const ReferralConversion = sequelize.define('ReferralConversion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  referralId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visitorId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conversionType: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'Appointment', 'Contact'
  },
  recordId: {
    type: DataTypes.INTEGER,
    allowNull: false // the ID of the created Appointment or Contact
  }
}, {
  timestamps: true,
  tableName: 'referral_conversions'
});

module.exports = ReferralConversion;
