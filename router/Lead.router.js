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


router.post('/create', authMiddleware, requireRole(canCreateLead), upload.single('logo'), validate(CreateLeadSchema), controller.createLead);

//get leads assigned to loggedIn user
router.get('/assigned-to-me', authMiddleware, controller.getLeadsByAssignedUser);

//get leads created by to loggedIn user
router.get('/created-by-me', authMiddleware, controller.getLeadsByCreator);


router.put('/update/:id', authMiddleware, validate(UpdateLeadSchema), controller.updateLead);

router.delete('/delete/:id', authMiddleware, controller.archiveLead);

module.exports = router;