const express = require('express');
const router = express.Router();
const controller = require('../controller/Meeting.controller');
const { CreateMeetingSchema } = require('../validator/meeting.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/meetings', authMiddleware, requireRole(allowedRoles), validate(CreateMeetingSchema), controller.createMeeting);
router.get('/meetings', authMiddleware, requireRole(allowedRoles), controller.getAllMeetings);
router.get('/meetings/:id', authMiddleware, requireRole(allowedRoles), controller.getMeetingById);
router.put('/meetings/:id', authMiddleware, requireRole(allowedRoles), controller.updateMeeting);
router.delete('/meetings/:id', authMiddleware, requireRole(allowedRoles), controller.archiveMeeting);

module.exports = router;
