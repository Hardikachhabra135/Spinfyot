const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const EventLog = sequelize.define('EventLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'event_logs',
  updatedAt: false // We only care about createdAt for analytics
});

module.exports = EventLog;
