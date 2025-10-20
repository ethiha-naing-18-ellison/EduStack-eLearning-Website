const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseSection = sequelize.define('CourseSection', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  course_id: DataTypes.INTEGER,
  title: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: DataTypes.TEXT,
  order_index: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  is_published: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  tableName: 'course_sections', 
  timestamps: true 
});

module.exports = CourseSection;
