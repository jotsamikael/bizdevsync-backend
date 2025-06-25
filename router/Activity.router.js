const express = require('express');
const router = express.Router();
const controller = require('../controller/Activity.controller');
const { CreateActivitySchema } = require('../validator/activity.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_business_developer'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateActivitySchema), controller.createActivity);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllActivities);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getActivityById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateActivity);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveActivity);

router.get('/followups/:followupId', controller.getActivitiesByFollowupId);
router.get('/businesses/:businessId', controller.getActivitiesByBusinessId);


module.exports = router;
