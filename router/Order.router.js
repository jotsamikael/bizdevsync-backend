const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.controller');
const authMiddleware = require('../middleware/authMiddleware');

const requireRole = require('../middleware/autorisationMiddleware');

// Restrict to solo_biz_dev and enterprise_admin
const subscriptionAccess = [ 'enterprise_admin', 'solo_business_developer' ];

// Restrict to admin, super_admin, or operator
const gatewayAccess = [ 'admin', 'super_admin', 'operator' ];

router.post('/create', authMiddleware, requireRole(subscriptionAccess),  orderController.createOrder);
router.post('/confirm', authMiddleware, requireRole(gatewayAccess), orderController.confirmOrder); // for manual confirmations

module.exports = router;
