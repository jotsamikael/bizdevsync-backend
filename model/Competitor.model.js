const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Competitor = db.define('Competitor', {
  idCompetitor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  last_updated:{type: DataTypes.DATE},
  name: { type: DataTypes.STRING },
  sector:{ type: DataTypes.STRING },
  headquater_location: { type: DataTypes.STRING },
  reference_clients:{ type: DataTypes.STRING },
  product_line:{ type: DataTypes.STRING }, //Overview of their key product or service offerings
  website: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Competitor',
  timestamps: true,
});
module.exports = Competitor