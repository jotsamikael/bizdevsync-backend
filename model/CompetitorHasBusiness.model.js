const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const CompetitorHasBusiness = db.define('CompetitorHasBusiness', {
  Competitor_idCompetitor: { type: DataTypes.INTEGER },
  Business_idBusiness: { type: DataTypes.INTEGER },
  weaknesses: { type: DataTypes.STRING },
  strengths: { type: DataTypes.STRING },
  risk_level: { type: DataTypes.STRING }
}, {
  tableName: 'Competitor_has_Business',
  timestamps: false,
});
module.exports = CompetitorHasBusiness


