
const {DataTypes} = require('sequelize')
const db = require('../config/db')

 const ContactHasMeeting = db.define('ContactHasMeeting', {
  contact_idContact: { type: DataTypes.INTEGER },
  meeting_idMeeting: { type: DataTypes.INTEGER }
}, {
  tableName: 'contact_has_meeting',
  timestamps: false,
});
module.exports =ContactHasMeeting