const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Region = db.define('Region', {
  idRegion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'regions',
  timestamps: false,
});

module.exports = Region
