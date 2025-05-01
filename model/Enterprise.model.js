const { DataTypes } = require('sequelize')
const db = require('../config/db')

const Enterprise = db.define('Enterprise', {
  idEnterprise: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  sector: { type: DataTypes.STRING }
}, {
  tableName: 'Enterprise',
  timestamps: false,
});
module.exports = Enterprise