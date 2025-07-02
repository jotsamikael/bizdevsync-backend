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
  },
   description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'product_category',
  timestamps: true,
});
module.exports = ProductCategory