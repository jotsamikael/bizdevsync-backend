const { DataTypes } = require('sequelize');
const db = require('../config/db');

const PasswordResets = db.define('PasswordResets', {
  email: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  new_password:{
    type: DataTypes.STRING,
    allowNull: false
},
}, {
  tableName: 'password_resets',
  timestamps: false
});

module.exports = PasswordResets;
