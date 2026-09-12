const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sourcePage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referralSlug: {
    type: DataTypes.STRING,
    allowNull: true
  },
  counsellorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'Resolved'),
    defaultValue: 'New'
  }
}, {
  timestamps: true,
  tableName: 'appointments'
});

module.exports = Appointment;
