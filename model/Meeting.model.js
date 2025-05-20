const {DataTypes} = require('sequelize')
const db = require('../config/db')

const Meeting = db.define('Meeting', {
  idMeeting: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.STRING },
   status: { type: DataTypes.STRING, //COMPLETED, PENDING, IN_PROGRESS, NOT STARTED, WAITING FEEDBACK
    defaultValue: "PENDING"
   },
  created_date: { type: DataTypes.DATE },
  due_date:{ type: DataTypes.DATE },
  summary: { type: DataTypes.STRING },
  next_action: { type: DataTypes.STRING },
  next_action_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Followup_idFollowup: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Business_idBusiness: {
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
  timestamps: false,
});

module.exports = Meeting

