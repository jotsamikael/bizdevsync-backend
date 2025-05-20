const express = require('express');
const router = express.Router();
const controller = require('../controller/Contact.controller');
const { CreateContactSchema } = require('../validator/contact.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateContactSchema), controller.createContact);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllContacts);

router.get('/get-contacts-by-lead/:leadId', authMiddleware, requireRole(allowedRoles), controller.getContactsByLead);
router.get('/get-by-id/:id', authMiddleware, requireRole(allowedRoles), controller.getContactById);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateContact);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveContact);

router.get('/get-by-meeting/:meetingId', controller.getContactsByMeetingId);


module.exports = router;
