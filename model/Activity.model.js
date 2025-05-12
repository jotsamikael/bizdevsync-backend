const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Activity = db.define('Activity', {
  idActivity: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action_detail: { type: DataTypes.STRING },
  last_action: { type: DataTypes.STRING },
  last_action_date: { type: DataTypes.STRING },
  next_action: { type: DataTypes.STRING },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Activity',
  timestamps: false,
});

module.exports = Activity