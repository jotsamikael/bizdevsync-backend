const express = require('express')
const router = express.Router();
const CONTROLLER = require('../controller/User.controller');
const upload = require('../controller/utils/fileupload')
const {registerSchema}  = require('../validator/user.validator')
const {loginSchema} = require('../validator/user.validator')
const {updateUserSchema} = require('../validator/user.validator')
const {updatePasswordSchema} = require('../validator/user.validator')

const validate = require('../middleware/validator.middleware')
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');


// Restrict to admin, super_admin, or operator
const AdminAccess = [ 'admin', 'super_admin', 'operator' ];
//Register
router.post('/register',upload.single('avatar'), validate(registerSchema), CONTROLLER.signup)
//Login
router.post('/login',validate(loginSchema) ,CONTROLLER.signin)
//Reset password
router.post('/reset-password', CONTROLLER.resetPassword);
//Activate account
router.post('/activate-account', CONTROLLER.activateAccount);
//update user
router.put('/staff-update/:id', upload.single('avatar'), validate(updateUserSchema), CONTROLLER.staffUpdateUser);

//change password
router.put('/change-password', authMiddleware, validate(updatePasswordSchema), CONTROLLER.updatePassword);


//GET all solobizdev, connected user must be staff i.e ('admin', 'super_admin' or 'operator')
router.post('/get-solo-bizdevs', authMiddleware, requireRole(AdminAccess),CONTROLLER.getSoloBizDevs)

//GET all users of enterprise, connected user must be staff i.e ('admin', 'super_admin' or 'operator')
router.post('/enterprise/:enterprise_id', CONTROLLER.getUsersByEnterprise);

//GET all saas staff ('admin', 'super_admin' or 'operator'), connected user must be 'super_admin'
router.post('/saas-staff',  authMiddleware, requireRole('super_admin'), CONTROLLER.getSaasAtaff);

//GET user by email, connected user must be staff i.e ('admin', 'super_admin' or 'operator')
router.get('/get-user-by-email', CONTROLLER.getUserByEmail);




module.exports = router