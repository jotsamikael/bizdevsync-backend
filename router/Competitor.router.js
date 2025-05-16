const express = require('express');
const router = express.Router();
const controller = require('../controller/Competitor.controller');
const { CreateCompetitorSchema } = require('../validator/competitor.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev','biz_dev'];

router.post('/competitors', authMiddleware, requireRole(allowedRoles), validate(CreateCompetitorSchema), controller.createCompetitor);
router.get('/competitors', authMiddleware, requireRole(allowedRoles), controller.getAllCompetitors);
router.get('/competitors/:id', authMiddleware, requireRole(allowedRoles), controller.getCompetitorById);
router.put('/competitors/:id', authMiddleware, requireRole(allowedRoles), controller.updateCompetitor);
router.delete('/competitors/:id', authMiddleware, requireRole(allowedRoles), controller.archiveCompetitor);
router.get('/competitors/businesses/:businessId', controller.getCompetitorsByBusinessId);

module.exports = router;
