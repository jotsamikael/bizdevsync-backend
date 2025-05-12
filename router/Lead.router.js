const express = require('express')
const router = express.Router();
const controller = require('../controller/Lead.controller');
const upload = require('../controller/utils/fileupload')
const {CreateLeadSchema, UpdateLeadSchema}  = require('../validator/lead.validator')
const validate = require('../middleware/validator.middleware')
const authMiddleware = require('../middleware/authMiddleware');

const requireRole = require('../middleware/autorisationMiddleware');

// Restrict to solo_biz_dev and enterprise_admin
const canCreateLead = [ 'enterprise_admin', 'solo_biz_dev' ];


router.post('/', authMiddleware, requireRole(canCreateLead), upload.single('logo'), validate(CreateLeadSchema), controller.createLead);


router.get('/assigned', authMiddleware, controller.getLeadsByAssignedUser);


router.get('/created', authMiddleware, controller.getLeadsByCreator);


router.put('/:id', authMiddleware, validate(UpdateLeadSchema), controller.updateLead);

router.delete('/:id', authMiddleware, controller.archiveLead);

module.exports = router;