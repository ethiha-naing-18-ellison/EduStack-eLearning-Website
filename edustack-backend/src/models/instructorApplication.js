const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstructorApplication = sequelize.define('InstructorApplication', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: DataTypes.INTEGER,
  application_status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' 
  },
  qualifications: DataTypes.TEXT,
  experience_years: DataTypes.INTEGER,
  portfolio_url: DataTypes.STRING(500),
  motivation: DataTypes.TEXT,
  admin_remarks: DataTypes.TEXT,
  reviewed_by: DataTypes.INTEGER
}, { 
  tableName: 'instructor_applications', 
  timestamps: true 
});

module.exports = InstructorApplication;
