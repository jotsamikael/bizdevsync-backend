const express = require('express')
const router = express.Router();
const CONTROLLER = require('../controller/User.controller');
const upload = require('../controller/utils/fileupload')
const {registerSchema}  = require('../validator/user.validator')
const {loginSchema} = require('../validator/user.validator')
const validate = require('../middleware/validator.middleware')

router.post('/register',upload.single('avatar'), validate(registerSchema), CONTROLLER.signup)

router.post('/login',validate(loginSchema) ,CONTROLLER.signin)
router.post('/get-solo-bizdevs',CONTROLLER.getSoloBizDevs)

router.post('/enterprise/:enterprise_id', CONTROLLER.getUsersByEnterprise);
router.post('/saas-staff', CONTROLLER.getSaasAtaff);
router.get('/get-user-by-email', CONTROLLER.getUserByEmail);
router.post('/activate-account', CONTROLLER.activateAccount);
router.post('/reset-password', CONTROLLER.resetPassword);




module.exports = router