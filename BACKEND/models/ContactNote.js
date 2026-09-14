const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const ContactNote = sequelize.define('ContactNote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  addedBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'contact_notes'
});

module.exports = ContactNote;
