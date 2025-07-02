const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Order = db.define('Order', {
  invoice_no: { type: DataTypes.STRING },
  payment_id: { type: DataTypes.STRING },
  plan_id: { type: DataTypes.INTEGER },
  user_id: { type: DataTypes.INTEGER },
  gateway_id: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.DOUBLE },
  tax: { type: DataTypes.DOUBLE },
  status: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 = pending, 1 = paid
  will_expire: { type: DataTypes.DATE },
  meta: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'orders',
  timestamps: true 
});

module.exports = Order;
