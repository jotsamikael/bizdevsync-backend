const express = require('express');
const router = express.Router();
const controller = require('../controller/CompetitorHasBusiness.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');
const CreateCompetitorHasBusinessSchema = require('../validator/competitorHasBusiness.validator')
const allowedRoles = ['enterprise_admin', 'solo_biz_dev', 'biz_dev'];
const validate = require('../middleware/validator.middleware');



router.post('/link-business/:id', authMiddleware, requireRole(allowedRoles), validate(CreateCompetitorHasBusinessSchema), controller.linkCompetitorToBusiness);
router.put('/link-business/:businessId/:id', authMiddleware, requireRole(allowedRoles), controller.updateCompetitorBusinessLink);
router.delete('/unlink-business/:businessId/:id', authMiddleware, requireRole(allowedRoles), controller.unlinkCompetitorFromBusiness);
router.get('/businesses/:id', authMiddleware, requireRole(allowedRoles), controller.getCompetitorBusinesses);

module.exports = router;
