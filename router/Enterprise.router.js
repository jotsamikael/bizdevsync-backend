const express = require('express');
const router = express.Router();
const controller = require('../controller/Enterprise.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');
const {CreateEnterpriseSchema}  = require('../validator/enterprise.validator')
const validate = require('../middleware/validator.middleware')
const uploadEnterpriseLogo = require('../controller/utils/uploadEnterpriseLogo');

const onlyEnterpriseAdmin = ['enterprise_admin'];
const onlySaasStaff = ['admin','operator','super_admin'];


router.post('/create', uploadEnterpriseLogo.single('logo'), authMiddleware, requireRole(onlyEnterpriseAdmin), validate(CreateEnterpriseSchema), controller.createEnterprise);
router.get('/get-all', authMiddleware, requireRole(onlySaasStaff), controller.getAllEnterprises);
router.get('/get-by-id/:id', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.getEnterpriseById);
router.patch('/update/:id',uploadEnterpriseLogo.single('logo'), authMiddleware, requireRole(onlyEnterpriseAdmin), controller.updateEnterprise);
router.delete('/delete/:id', authMiddleware, requireRole(onlyEnterpriseAdmin), controller.archiveEnterprise);

module.exports = router;
