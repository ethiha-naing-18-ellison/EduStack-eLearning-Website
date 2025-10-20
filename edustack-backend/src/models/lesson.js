const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  section_id: DataTypes.INTEGER,
  title: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: DataTypes.TEXT,
  lesson_type: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  content: DataTypes.TEXT,
  video_url: DataTypes.STRING(500),
  file_url: DataTypes.STRING(500),
  duration_minutes: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  order_index: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  is_published: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  is_preview: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  tableName: 'lessons', 
  timestamps: true 
});

module.exports = Lesson;
