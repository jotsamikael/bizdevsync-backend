const express = require('express')
const router = express.Router();
const CONTROLLER = require('../controller/Source.controller');
const {CreateSourceSchema}  = require('../validator/source.validator')
const validate = require('../middleware/validator.middleware')
const authMiddleware = require('../middleware/authMiddleware');

const requireRole = require('../middleware/autorisationMiddleware');

// Restrict to solo_biz_dev and enterprise_admin
const canCreateSource = [ 'enterprise_admin', 'solo_business_developer' ];

//create source
router.post('/create',authMiddleware,requireRole(canCreateSource), validate(CreateSourceSchema), CONTROLLER.createSource)


module.exports = router;
