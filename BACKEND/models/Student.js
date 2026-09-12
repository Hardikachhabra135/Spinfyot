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
    allowNull: true
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
  otherQualification: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currentCountry: {
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
  totalConsultancyAmount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  advancePaid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  remainingAmount: {
    type: DataTypes.INTEGER,
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
  },
  passportNo: { type: DataTypes.STRING, allowNull: true },
  sourceOfIncome: { type: DataTypes.STRING, allowNull: true },
  familyContact: { type: DataTypes.TEXT, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  edu10th: { type: DataTypes.TEXT, allowNull: true },
  edu12th: { type: DataTypes.TEXT, allowNull: true },
  eduDiploma: { type: DataTypes.TEXT, allowNull: true },
  eduGraduation: { type: DataTypes.TEXT, allowNull: true },
  eduMasters: { type: DataTypes.TEXT, allowNull: true },
  jobExperience: { type: DataTypes.TEXT, allowNull: true },
  englishLevel: { type: DataTypes.STRING, allowNull: true },
  languageTests: { type: DataTypes.TEXT, allowNull: true },
  prefCountry: { type: DataTypes.STRING, allowNull: true },
  targetUniversity: { type: DataTypes.STRING, allowNull: true },
  referredBy: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
  tableName: 'students'
});

module.exports = Student;
