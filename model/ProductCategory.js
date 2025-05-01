const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const ProductCategory = db.define('ProductCategory', {
  idProductCategory: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'ProductCategory',
  timestamps: false,
});
module.exports = ProductCategory