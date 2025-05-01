const express = require('express')
const router = express.Router();
const CONTROLLER = require('../controller/User.controller');


router.post('/register',CONTROLLER.signup)
router.post('/login',CONTROLLER.signin)
router.post('/get-solo-bizdevs',CONTROLLER.getSoloBizDevs)

router.post('/enterprise/:enterprise_id', CONTROLLER.getUsersByEnterprise);
router.post('/saas-staff', CONTROLLER.getSaasAtaff);
router.get('/get-user-by-email', CONTROLLER.getUserByEmail);
router.post('/activate-account', CONTROLLER.activateAccount);



module.exports = router