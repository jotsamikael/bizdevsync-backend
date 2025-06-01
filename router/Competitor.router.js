const express = require('express');
const router = express.Router();
const controller = require('../controller/Competitor.controller');
const { CreateCompetitorSchema } = require('../validator/competitor.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_business_developer','business_developer'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateCompetitorSchema), controller.createCompetitor);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllCompetitors);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getCompetitorById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateCompetitor);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveCompetitor);
router.get('/get-by-business/:businessId', controller.getCompetitorsByBusinessId);

module.exports = router;
