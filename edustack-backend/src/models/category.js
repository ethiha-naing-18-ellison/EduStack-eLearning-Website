const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true 
  },
  description: DataTypes.TEXT,
  parent_id: DataTypes.INTEGER,
  icon_url: DataTypes.STRING(500),
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: 'categories', 
  timestamps: true 
});

module.exports = Category;
