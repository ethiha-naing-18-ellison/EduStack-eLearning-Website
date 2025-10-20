const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  title: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: DataTypes.TEXT,
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0.00 
  },
  instructor_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  thumbnail_url: DataTypes.STRING(500),
  is_published: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  difficulty_level: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'beginner' 
  },
  duration_hours: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  language: { 
    type: DataTypes.STRING(10), 
    defaultValue: 'en' 
  }
}, { 
  tableName: 'courses', 
  timestamps: true 
});

module.exports = Course;
