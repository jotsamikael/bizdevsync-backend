const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controller/Plan.controller');

// TODO: Add authMiddleware and roleMiddleware if needed
router.post('/', CONTROLLER.createPlan);
router.get('/', CONTROLLER.getAllPlans);
router.put('/:id', CONTROLLER.updatePlan);
router.delete('/:id', CONTROLLER.deletePlan);

module.exports = router;
