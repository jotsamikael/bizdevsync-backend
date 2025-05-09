const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Gateway = db.define('Gateway', {
  name: { type: DataTypes.STRING },
  currency: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  charge: { type: DataTypes.DOUBLE },
  multiply: { type: DataTypes.DOUBLE },
  namespace: { type: DataTypes.STRING },
  min_amount: { type: DataTypes.DOUBLE },
  max_amount: { type: DataTypes.DOUBLE },
  is_auto: { type: DataTypes.INTEGER },
  image_accept: { type: DataTypes.INTEGER },
  test_mode: { type: DataTypes.INTEGER },
  status: { type: DataTypes.INTEGER },
  phone_required: { type: DataTypes.INTEGER },
  data: { type: DataTypes.TEXT },
  comment: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'gateways',
  timestamps: false
});

module.exports = Gateway;
