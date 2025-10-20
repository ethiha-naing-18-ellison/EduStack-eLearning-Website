const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  lesson_id: DataTypes.INTEGER,
  file_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  file_url: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  file_type: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  file_size: DataTypes.BIGINT,
  download_count: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, { 
  tableName: 'resources', 
  timestamps: true 
});

module.exports = Resource;
