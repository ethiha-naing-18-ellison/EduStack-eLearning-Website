const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  student_id: DataTypes.INTEGER,
  course_id: DataTypes.INTEGER,
  rating: { 
    type: DataTypes.INTEGER, 
    validate: { min: 1, max: 5 } 
  },
  comment: DataTypes.TEXT,
  is_approved: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  tableName: 'reviews', 
  timestamps: true 
});

module.exports = Review;
