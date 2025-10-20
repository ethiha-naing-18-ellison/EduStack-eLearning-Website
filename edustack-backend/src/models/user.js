const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    unique: true 
  },
  password_hash: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  role_id: DataTypes.INTEGER,
  profile_image: DataTypes.STRING(500),
  phone: DataTypes.STRING(20),
  bio: DataTypes.TEXT,
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  email_verified: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  tableName: 'users', 
  timestamps: true 
});

module.exports = User;
