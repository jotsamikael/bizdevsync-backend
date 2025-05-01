const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Business = db.define('Business', {
  idBusiness: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  need: { type: DataTypes.STRING },
  approach: { type: DataTypes.STRING },
  business_type: { type: DataTypes.STRING },
  case_level: { type: DataTypes.STRING },
  total_turnover: { type: DataTypes.STRING },
  potential_time_for_delivery: { type: DataTypes.STRING },
  case_started_date: { type: DataTypes.STRING },
  current_supplier: { type: DataTypes.STRING },
  source: { type: DataTypes.STRING },
  previous_vc: { type: DataTypes.STRING },
  turnover_signable: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  closed_date: { type: DataTypes.DATE }
}, {
  tableName: 'Business',
  timestamps: false,
});
module.exports = Business
