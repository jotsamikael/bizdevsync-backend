const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Enterprise = db.define('Enterprise', {
  idEnterprise: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, unique: true },
  sector: { type: DataTypes.ENUM('Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Logistics', 'Manufacturing', 'Media'), },
  website: { type: DataTypes.STRING },
  email_domain: { type: DataTypes.STRING },
  contact_email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  plan: { type: DataTypes.INTEGER },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  subscription_status: { type: DataTypes.STRING, defaultValue: 'active' },
  expires_at: { type: DataTypes.DATE, allowNull: true },
  is_archived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: 'Enterprise',
  timestamps: false
});

module.exports = Enterprise