const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controller/Gateway.controller');

const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

// Restrict to admin, super_admin, or operator
const gatewayAccess = [ 'admin', 'super_admin', 'operator' ];

// Admin-only routes
router.post('/', verifyToken, requireRole(gatewayAccess), CONTROLLER.createGateway);
router.get('/', verifyToken, requireRole(gatewayAccess), CONTROLLER.getAllGateways);
router.put('/:id', verifyToken, requireRole(gatewayAccess), CONTROLLER.updateGateway);
router.delete('/:id', verifyToken, requireRole(gatewayAccess), CONTROLLER.deleteGateway);

module.exports = router;

