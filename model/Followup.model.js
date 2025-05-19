const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Followup = db.define('Followup', {
  idFollowup: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  start_date: { type: DataTypes.STRING },
  lead_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  followup_status: { // Hot, Warm, Cold
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Cold"
  },
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