const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  student_id: DataTypes.INTEGER,
  course_id: DataTypes.INTEGER,
  progress_percentage: { 
    type: DataTypes.DECIMAL(5, 2), 
    defaultValue: 0.00 
  },
  payment_status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: 'enrollments', 
  timestamps: true 
});

module.exports = Enrollment;
