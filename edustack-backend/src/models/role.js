const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  description: DataTypes.TEXT,
  permissions: DataTypes.JSONB
}, { 
  tableName: 'roles', 
  timestamps: true 
});

module.exports = Role;
