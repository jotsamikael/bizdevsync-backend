const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Activity = db.define('Activity', {
  idActivity: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  detail: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, ////COMPLETED, PENDING, IN_PROGRESS, NOT_STARTED, WAITING_FEEDBACK
    defaultValue: "IN_PROGRESS"
   },
  start_date:{
        type: DataTypes.DATE,
        allowNull: false,
    },
  due_date:{
        type: DataTypes.DATE,
        allowNull: false,
    },
  end_date:{
        type: DataTypes.DATE,
        allowNull: true,
    },
  tags:{
        type: DataTypes.STRING,
        allowNull: true,
    },
   priority:{
        type: DataTypes.STRING, //Enum: CRITICAL, IMPORTANT, HIGH, MEDIUM, LOW
        allowNull: false,
    },
  last_action: { type: DataTypes.STRING },
  last_action_date: { type: DataTypes.STRING },
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
  tableName: 'activity',
  timestamps: true,
});

module.exports = Activity
