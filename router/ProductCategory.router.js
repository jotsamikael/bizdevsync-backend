const express = require('express');
const router = express.Router();
const controller = require('../controller/ProductCategory.controller');
const { CreateProductCategorySchema } = require('../validator/productCategory.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/product-categories', authMiddleware, requireRole(allowedRoles), validate(CreateProductCategorySchema), controller.createProductCategory);
router.get('/product-categories', authMiddleware, requireRole(allowedRoles), controller.getAllProductCategories);
router.put('/product-categories/:id', authMiddleware, requireRole(allowedRoles), controller.updateProductCategory);
router.delete('/product-categories/:id', authMiddleware, requireRole(allowedRoles), controller.archiveProductCategory);

module.exports = router;
