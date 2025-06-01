const {DataTypes} = require('sequelize')
const db = require('../config/db')

const Meeting = db.define('Meeting', {
  idMeeting: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.STRING },
   status: { type: DataTypes.STRING, //COMPLETED, PENDING, IN_PROGRESS, NOT STARTED, WAITING FEEDBACK
    defaultValue: "PENDING"
   },
  due_date:{ type: DataTypes.DATE },
  summary: { type: DataTypes.STRING },
  next_action: { type: DataTypes.STRING },
  next_action_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  _idFollowup: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  _idBusiness: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Meeting',
  timestamps: true,
});

module.exports = Meeting

