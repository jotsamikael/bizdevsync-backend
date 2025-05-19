const ENV = require('../config')
const { Product, ProductCategory, Enterprise, User } = require('../model');
const createError = require('../middleware/error');
const logger = require("./utils/logger.utils");
const { paginate } = require("./utils/paginate");

/** Create Product */
/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               ProductCategory_idProductCategory:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 */
exports.createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const product = await Product.create({
      label: req.body.label,
      price: req.body.price,
      description: req.body.description,
      ProductCategory_idProductCategory: req.body.ProductCategory_idProductCategory,
      User_idUser: userId
    });

    res.status(201).json({ message: 'Product created successfully', data: product });
    logger.info(`Product created: ${product.label}`);
  } catch (error) {
    logger.error(`Product creation error: ${error.message}`);
    next(createError(500, "Error creating product", error.message));
  }
};

/** Get all Products (paginated) */
/**
 * @swagger
 * /products/get-all:
 *   get:
 *     summary: Get all products created by the logged-in user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const products = await Product.findAndCountAll({
      where: {  
        User_idUser: req.user.id
        ,is_archived: false },
      limit,
      offset,
      include: [ProductCategory] //include iis used for eager loading and will attach the product catgeory to response
    });
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Fetch products error: ${error.message}`);
    next(createError(500, "Error fetching products", error.message));
  }
};

/** Update Product */
/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               ProductCategory_idProductCategory:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await Product.update(req.body, {
      where: { idProduct: id, is_archived: false }
    });
    res.status(200).json({ message: 'Product updated successfully', data: updated });
  } catch (error) {
    logger.error(`Product update error: ${error.message}`);
    next(createError(500, "Error updating product", error.message));
  }
};

/** Archive Product */
/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Archive a product (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product archived successfully
 */
exports.archiveProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Product.update({ is_archived: true }, {
      where: { idProduct: id }
    });
    res.status(200).json({ message: 'Product archived successfully' });
  } catch (error) {
    logger.error(`Archive product error: ${error.message}`);
    next(createError(500, "Error archiving product", error.message));
  }
};


/**
 * @swagger
 * /products/get-all-by-id/{categoryId}:
 *   get:
 *     summary: Get paginated products for a category
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { limit, offset } = require('./utils/paginate').paginate(req);

    const products = await Product.findAndCountAll({
      where: {
        ProductCategory_idProductCategory: categoryId,
        is_archived: false
      },
      limit,
      offset
    });

    res.status(200).json(products);
  } catch (error) {
    next(createError(500, 'Error fetching products by category', error.message));
  }
};
