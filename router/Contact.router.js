const express = require('express');
const router = express.Router();
const controller = require('../controller/Contact.controller');
const { CreateContactSchema } = require('../validator/contact.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/contacts', authMiddleware, requireRole(allowedRoles), validate(CreateContactSchema), controller.createContact);
router.get('/contacts', authMiddleware, requireRole(allowedRoles), controller.getAllContacts);
router.get('/contacts/:id', authMiddleware, requireRole(allowedRoles), controller.getContactById);
router.put('/contacts/:id', authMiddleware, requireRole(allowedRoles), controller.updateContact);
router.delete('/contacts/:id', authMiddleware, requireRole(allowedRoles), controller.archiveContact);

module.exports = router;
