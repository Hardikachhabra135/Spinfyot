const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  influencerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  promoCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: true // e.g., 'Percentage', 'Fixed Amount'
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  timestamps: true,
  tableName: 'referrals'
});

module.exports = Referral;
