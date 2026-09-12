const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const ReferralClick = sequelize.define('ReferralClick', {
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
  landingPage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'referral_clicks'
});

module.exports = ReferralClick;
