const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  submission_id: {
    type: DataTypes.STRING,
    allowNull: true
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
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true
  },
  course: {
    type: DataTypes.STRING,
    allowNull: true
  },
  service: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
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
  referralSlug: {
    type: DataTypes.STRING,
    allowNull: true
  },
  counsellorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'In Progress', 'Resolved', 'NEW', 'VIEWED', 'CONTACTED', 'FOLLOW-UP', 'CONVERTED', 'CLOSED'),
    defaultValue: 'NEW'
  },
  follow_up_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  follow_up_time: {
    type: DataTypes.STRING,
    allowNull: true
  },
  follow_up_note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  viewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  converted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  archived_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'contacts'
});

module.exports = Contact;
