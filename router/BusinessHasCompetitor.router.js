const express = require('express');
const router = express.Router();
const controller = require('../controller/CompetitorHasBusiness.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev', 'biz_dev'];

router.post('/competitors/:id/link-business', authMiddleware, requireRole(allowedRoles), controller.linkCompetitorToBusiness);
router.put('/competitors/:id/link-business/:businessId', authMiddleware, requireRole(allowedRoles), controller.updateCompetitorBusinessLink);
router.delete('/competitors/:id/unlink-business/:businessId', authMiddleware, requireRole(allowedRoles), controller.unlinkCompetitorFromBusiness);
router.get('/competitors/:id/businesses', authMiddleware, requireRole(allowedRoles), controller.getCompetitorBusinesses);

module.exports = router;
