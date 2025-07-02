const express = require('express');
const router = express.Router();
const controller = require('../controller/ContactHasMeeting.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['business_developer', 'solo_business_developer'];

//link contact to meeting
router.post('/link-meeting/:id', authMiddleware, requireRole(allowedRoles), controller.linkContactToMeeting);
//Remove or unlink contact to meeting
router.delete('/unlink-meeting/:meetingId/:id', authMiddleware, requireRole(allowedRoles), controller.unlinkContactFromMeeting);

router.get('/meetings/:id', authMiddleware, requireRole(allowedRoles), controller.getMeetingsOfContact);

router.get('/contacts/:id', authMiddleware, requireRole(allowedRoles), controller.getContactsLinkedToMeeting);


module.exports = router;
