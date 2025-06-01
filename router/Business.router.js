const express = require('express');
const router = express.Router();
const controller = require('../controller/Business.controller');
const { CreateBusinessSchema } = require('../validator/business.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_business_developer','business_developer'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateBusinessSchema), controller.createBusiness);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllBusinesses);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getBusinessById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateBusiness);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveBusiness);

router.get('/next-action/:businessId', authMiddleware, requireRole(allowedRoles), controller.getNextActionForBusiness);
router.get('/overdue-actions/:businessId', authMiddleware, requireRole(allowedRoles), controller.getOverdueActionsForBusiness);
router.get('/get-by-lead-id/:idLead',authMiddleware, requireRole(allowedRoles), controller.getBusinessByLeadId);

module.exports = router;
