const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Competitor = db.define('Competitor', {
  idCompetitor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  website: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  createdDate: { type: DataTypes.STRING }
}, {
  tableName: 'Competitor',
  timestamps: false,
});
module.exports = Competitor