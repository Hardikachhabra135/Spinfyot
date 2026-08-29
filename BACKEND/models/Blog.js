const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'blogs'
});

module.exports = Blog;
