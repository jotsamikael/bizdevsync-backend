const express = require('express');
const router = express.Router();
const controller = require('../controller/Country.controller');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');
const CreateCountrySchema = require('../validator/country.validator')
const allowedRoles = ['enterprise_admin', 'solo_business_developer'];
const validate = require('../middleware/validator.middleware');



router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateCountrySchema), controller.createCountry);

router.get('/get-all', authMiddleware,  controller.getAllCountries);

router.get('/get-by-id/:id', authMiddleware,  controller.getCountryById);

router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateCountry);

router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveCountry);


module.exports = router;
