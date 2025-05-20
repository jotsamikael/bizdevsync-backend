const express = require('express');
const router = express.Router();
const controller = require('../controller/Followup.controller');
const { CreateFollowupSchema } = require('../validator/followup.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateFollowupSchema), controller.createFollowup);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllFollowups);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getFollowupById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateFollowup);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveFollowup);


router.get('/next-action/:followupId', authMiddleware, requireRole(allowedRoles), controller.getNextActionForFollowup);
router.get('/overdue-actions/:followupId', authMiddleware, requireRole(allowedRoles), controller.getOverdueActionsForFollowup);

module.exports = router;
