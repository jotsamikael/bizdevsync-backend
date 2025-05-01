const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Country = db.define('Country', {
  idCountry: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Country',
  timestamps: false,
});

module.exports = Country
