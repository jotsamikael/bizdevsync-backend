const express = require('express');
const router = express.Router();
const controller = require('../controller/contactHasMeeting.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['biz_dev', 'solo_biz_dev'];

//link contact to meeting
router.post('/contacts/:id/link-meeting', authMiddleware, requireRole(allowedRoles), controller.linkContactToMeeting);
//Remove or unlink contact to meeting
router.delete('/contacts/:id/unlink-meeting/:meetingId', authMiddleware, requireRole(allowedRoles), controller.unlinkContactFromMeeting);
//update contact meeting relation
router.get('/contacts/:id/meetings', authMiddleware, requireRole(allowedRoles), controller.getContactMeetings);

module.exports = router;
