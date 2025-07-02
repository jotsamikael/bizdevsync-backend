const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Business = db.define('Business', {
  idBusiness: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  need: { type: DataTypes.STRING },
  created_date: { type: DataTypes.STRING },
  stage: { type: DataTypes.STRING,
            defaultValue:"OPPORTUNITY"
   }, //General stages: "OPPORTUNITY", "PORPOSAL_SENT", "NEGOCIATION", "WON" etc
  approach: { type: DataTypes.STRING },
  engagement_score:{
     type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0 //Computed from activities/meetings frequency
  },
  client_constraints:{ type: DataTypes.STRING },
  business_type: { type: DataTypes.STRING },
  case_level: { type: DataTypes.STRING },
  total_turnover: { type: DataTypes.STRING },
  potential_time_for_delivery: { type: DataTypes.STRING },
  case_started_date: { type: DataTypes.STRING },
  current_supplier: { type: DataTypes.STRING },
  previous_vc: { type: DataTypes.STRING },
  turnover_signable: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  closed_date: { type: DataTypes.DATE },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'business',
  timestamps: true,
});
module.exports = Business
