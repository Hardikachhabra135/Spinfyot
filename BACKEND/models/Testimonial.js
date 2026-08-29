const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'testimonials'
});

module.exports = Testimonial;
