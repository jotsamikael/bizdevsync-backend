const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Country = db.define('Country', {
  idCountry: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Country',
  timestamps: false,
});

module.exports = Country
