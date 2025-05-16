const express = require('express');
const router = express.Router();
const controller = require('../controller/Business.controller');
const { CreateBusinessSchema } = require('../validator/business.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/businesses', authMiddleware, requireRole(allowedRoles), validate(CreateBusinessSchema), controller.createBusiness);
router.get('/businesses', authMiddleware, requireRole(allowedRoles), controller.getAllBusinesses);
router.get('/businesses/:id', authMiddleware, requireRole(allowedRoles), controller.getBusinessById);
router.put('/businesses/:id', authMiddleware, requireRole(allowedRoles), controller.updateBusiness);
router.delete('/businesses/:id', authMiddleware, requireRole(allowedRoles), controller.archiveBusiness);

router.get('/businesses/:businessId/next-action', authMiddleware, requireRole(allowedRoles), controller.getNextActionForBusiness);
router.get('/businesses/:businessId/overdue-actions', authMiddleware, requireRole(allowedRoles), controller.getOverdueActionsForBusiness);


module.exports = router;
