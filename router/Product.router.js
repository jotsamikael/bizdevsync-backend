const express = require('express');
const router = express.Router();
const controller = require('../controller/Product.controller');
const { CreateProductSchema } = require('../validator/product.validator');
const validate = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/autorisationMiddleware');

const allowedRoles = ['enterprise_admin', 'solo_biz_dev'];

router.post('/create', authMiddleware, requireRole(allowedRoles), validate(CreateProductSchema), controller.createProduct);
router.get('/get-all', authMiddleware, requireRole(allowedRoles), controller.getAllProducts);
router.put('/update/:id', authMiddleware, requireRole(allowedRoles), controller.updateProduct);
router.delete('/delete/:id', authMiddleware, requireRole(allowedRoles), controller.archiveProduct);
router.get('/get-all-by-id/:categoryId',authMiddleware, requireRole(allowedRoles), controller.getProductsByCategoryId);

module.exports = router;
