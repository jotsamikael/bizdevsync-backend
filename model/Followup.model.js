const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Followup = db.define('Followup', {
  idFollowup: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  start_date: { type: DataTypes.STRING },
  outcome: { type: DataTypes.STRING }, //Result of the engagement up to this point
  notes: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }, //General status: "in_progress", "paused", "awaiting_response", etc
  lead_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  priority:{
        type: DataTypes.STRING, //Enum: CRITICAL, IMPORTANT, HIGH, MEDIUM, LOW
        allowNull: false,
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
  timestamps: true,
});
module.exports = Followup