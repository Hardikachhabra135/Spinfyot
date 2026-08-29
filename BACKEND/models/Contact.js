const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Contact = sequelize.define('Contact', {
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
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  interest: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'In Progress', 'Resolved'),
    defaultValue: 'New'
  }
}, {
  timestamps: true,
  tableName: 'contacts'
});

module.exports = Contact;
