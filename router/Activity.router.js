const express = require('express');
const router = express.Router();
const controller = require('../controller/Activity.controller');
const { CreateActivitySchema } = require('../validator/activity.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/activities', authMiddleware, requireRole(allowedRoles), validate(CreateActivitySchema), controller.createActivity);
router.get('/activities', authMiddleware, requireRole(allowedRoles), controller.getAllActivities);
router.get('/activities/:id', authMiddleware, requireRole(allowedRoles), controller.getActivityById);
router.put('/activities/:id', authMiddleware, requireRole(allowedRoles), controller.updateActivity);
router.delete('/activities/:id', authMiddleware, requireRole(allowedRoles), controller.archiveActivity);

router.get('/activities/followups/:followupId', controller.getActivitiesByFollowupId);
router.get('/activities/businesses/:businessId', controller.getActivitiesByBusinessId);


module.exports = router;
