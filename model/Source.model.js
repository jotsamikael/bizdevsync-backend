const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const Source = db.define('Source', {
  idSource: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'sources',
  timestamps: true,
});

module.exports = Source
