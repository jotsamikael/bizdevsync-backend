
const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const ContactHasMeeting = db.define('ContactHasMeeting', {
  contact_idContact: { type: DataTypes.INTEGER },
  meeting_idMeeting: { type: DataTypes.INTEGER },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'contact_has_meeting',
  timestamps: true,
});
module.exports = ContactHasMeeting