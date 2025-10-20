const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: DataTypes.INTEGER,
  course_id: DataTypes.INTEGER,
  amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  currency: { 
    type: DataTypes.STRING(3), 
    defaultValue: 'USD' 
  },
  payment_method: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  payment_status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' 
  },
  transaction_id: DataTypes.STRING(255),
  gateway_response: DataTypes.JSONB
}, { 
  tableName: 'payments', 
  timestamps: true 
});

module.exports = Payment;
