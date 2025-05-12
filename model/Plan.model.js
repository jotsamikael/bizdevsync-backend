const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Plan = db.define('Plan', {
  title: { type: DataTypes.STRING, allowNull: false },
  labelcolor: { type: DataTypes.STRING },
  iconname: { type: DataTypes.STRING },
  price: { type: DataTypes.DOUBLE, allowNull: false },
  is_featured: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_recommended: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_trial: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.INTEGER, defaultValue: 1 },
  days: { type: DataTypes.INTEGER },
  trial_days: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'plans',
  timestamps: false
});

module.exports = Plan;
