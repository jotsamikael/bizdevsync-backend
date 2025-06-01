const express = require('express');
const router = express.Router();
const controller = require('../controller/Meeting.controller');
const { CreateMeetingSchema } = require('../validator/meeting.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_business_developer','business_developer'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateMeetingSchema), controller.createMeeting);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllMeetings);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getMeetingById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateMeeting);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveMeeting);

router.get('/meetings/get-by-followup/:followupId', controller.getMeetingsByFollowupId);
router.get('/meetings/get-by-business/:businessId', controller.getMeetingsByBusinessId);

module.exports = router;
