const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  counsellorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  currentEducation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currentCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  targetCountry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  targetCourse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visaApplied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true
  },
  intakeTerm: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  callbackRequested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  callbackTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  documents: {
    type: DataTypes.TEXT, // Storing JSON stringified array of file paths
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'In Progress', 'Enrolled', 'Closed'),
    defaultValue: 'New'
  }
}, {
  timestamps: true,
  tableName: 'students'
});

module.exports = Student;
