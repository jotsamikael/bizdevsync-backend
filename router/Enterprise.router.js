const express = require('express');
const router = express.Router();
const controller = require('../controller/Enterprise.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const onlyEnterpriseAdmin = ['enterprise_admin'];

router.post('/enterprises', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.createEnterprise);
router.get('/enterprises', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.getAllEnterprises);
router.get('/enterprises/:id', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.getEnterpriseById);
router.put('/enterprises/:id', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.updateEnterprise);
router.delete('/enterprises/:id', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.archiveEnterprise);

module.exports = router;
