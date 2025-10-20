const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LessonProgress = sequelize.define('LessonProgress', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  student_id: DataTypes.INTEGER,
  lesson_id: DataTypes.INTEGER,
  is_completed: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  time_spent_minutes: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  last_position_seconds: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, { 
  tableName: 'lesson_progress', 
  timestamps: true 
});

module.exports = LessonProgress;
