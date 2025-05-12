const { DataTypes } = require('sequelize')
const db = require('../config/db')

const Enterprise = db.define('Enterprise', {
  idEnterprise: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  sector: { type: DataTypes.STRING },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Enterprise',
  timestamps: false,
});
module.exports = Enterprise