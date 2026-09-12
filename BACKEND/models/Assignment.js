const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  counsellorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  counsellorNote: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nextFollowUp: {
    type: DataTypes.DATE,
    allowNull: true
  },
  counsellorStatus: {
    type: DataTypes.ENUM('New', 'Contacted', 'Follow-up', 'Interested', 'Not Interested', 'Application Started', 'Converted', 'Closed'),
    defaultValue: 'New'
  },
  interestLevel: {
    type: DataTypes.ENUM('Most Interested', 'Mid Interested', 'Least Interested'),
    allowNull: true
  },
  reminderDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amountReceived: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  advanceReceived: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amountUsed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'assignments'
});

module.exports = Assignment;
