const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  counsellorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sender: {
    type: DataTypes.ENUM('Admin', 'Counsellor'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'messages'
});

module.exports = Message;

