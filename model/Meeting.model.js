const {DataTypes} = require('sequelize')
const db = require('../config/db')

const Meeting = db.define('Meeting', {
  idMeeting: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.STRING },
  summary: { type: DataTypes.STRING },
  next_action: { type: DataTypes.STRING },
   next_action_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Meeting',
  timestamps: false,
});

module.exports = Meeting

