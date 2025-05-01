const {DataTypes} = require('sequelize')
const db = require('../config/db')

const Meeting = db.define('Meeting', {
  idMeeting: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.STRING },
  summary: { type: DataTypes.STRING },
  next_action: { type: DataTypes.STRING }
}, {
  tableName: 'Meeting',
  timestamps: false,
});

module.exports = Meeting

