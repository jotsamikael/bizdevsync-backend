/**
 * This model contains data used for activation code validation
 */

const {DataTypes} = require('sequelize')
const db = require('../config/db')

const Activation = db.define('Activation', {
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'activation',
  timestamps: false
});

module.exports = Activation;
