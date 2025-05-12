const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Followup = db.define('Followup', {
  idFollowup: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  start_date: { type: DataTypes.STRING },
  source: { type: DataTypes.STRING },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Followup',
  timestamps: false,
});
module.exports = Followup