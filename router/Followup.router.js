const express = require('express');
const router = express.Router();
const controller = require('../controller/Followup.controller');
const { CreateFollowupSchema } = require('../validator/followup.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/followups', authMiddleware, requireRole(allowedRoles), validate(CreateFollowupSchema), controller.createFollowup);
router.get('/followups', authMiddleware, requireRole(allowedRoles), controller.getAllFollowups);
router.get('/followups/:id', authMiddleware, requireRole(allowedRoles), controller.getFollowupById);
router.put('/followups/:id', authMiddleware, requireRole(allowedRoles), controller.updateFollowup);
router.delete('/followups/:id', authMiddleware, requireRole(allowedRoles), controller.archiveFollowup);

module.exports = router;
