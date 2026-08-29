const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Question = sequelize.define('Question', {
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
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  serviceSlug: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'Answered'),
    defaultValue: 'New'
  }
}, {
  timestamps: true,
  tableName: 'questions'
});

module.exports = Question;
