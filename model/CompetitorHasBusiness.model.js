const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const CompetitorHasBusiness = db.define('CompetitorHasBusiness', {
  _idCompetitor: { type: DataTypes.INTEGER },
  _idBusiness: { type: DataTypes.INTEGER },
  market_position: { type: DataTypes.STRING }, //"market leader", "niche player", "new entrant"
  weaknesses: { type: DataTypes.STRING },
  strengths: { type: DataTypes.STRING },
  risk_level: { type: DataTypes.STRING },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Competitor_has_Business',
  timestamps: true,
});
module.exports = CompetitorHasBusiness


