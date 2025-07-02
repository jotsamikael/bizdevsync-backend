const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Country = db.define('Country', {
  idCountry: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  short_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  long_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  iso2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  iso3: {
    type: DataTypes.STRING,
    allowNull: true
  },
   calling_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
   is_un_member: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'country',
  timestamps: true,
});

module.exports = Country
