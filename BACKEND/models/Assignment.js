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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'assignments'
});

module.exports = Assignment;
