const { ProductCategory } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');

/**
 * @swagger
 * /product-categories/create:
 *   post:
 *     summary: Create a new product category
 *     tags: [ProductCategories]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product category created
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ProductCategory'
 */
exports.createProductCategory = async (req, res, next) => {
      const userId = req.user.id;

  try {
    const category = await ProductCategory.create({
      label: req.body.label,
      description: req.body.description,
      User_idUser: userId
    });

    res.status(201).json({ message: 'Product category created successfully', data: category });
    logger.info(`Product category created: ${category.label}`);
  } catch (error) {
    logger.error(`Product category creation error: ${error.message}`);
    next(createError(500, 'Error creating product category', error.message));
  }
};

/**
 * @swagger
 * /product-categories/get-all:
 *   get:
 *     summary: Get all product categories for currently loggedin user
 *     tags: [ProductCategories]
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
 *         description: List of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductCategory'
 */
exports.getAllProductCategories = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const categories = await ProductCategory.findAndCountAll({
      where: { is_archived: false,  User_idUser: userId },
      limit,
      offset
    });

    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Fetch product categories error: ${error.message}`);
    next(createError(500, 'Error fetching product categories', error.message));
  }
};

/**
 * @swagger
 * /product-categories/update/{id}:
 *   put:
 *     summary: Update a product category
 *     tags: [ProductCategories]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product category updated
 */
exports.updateProductCategory = async (req, res, next) => {
    const userId = req.user.id;
  try {
    const id = req.params.id;
    const updated = await ProductCategory.update(req.body, {
      where: { idProductCategory: id, is_archived: false, User_idUser: userId }
    });

    res.status(200).json({ message: 'Product category updated successfully', data: updated });
  } catch (error) {
    logger.error(`Product category update error: ${error.message}`);
    next(createError(500, 'Error updating product category', error.message));
  }
};

/**
 * @swagger
 * /product-categories/delete/{id}:
 *   delete:
 *     summary: Archive a product category (soft delete)
 *     tags: [ProductCategories]
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
 *         description: Product category archived
 */
exports.archiveProductCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    await ProductCategory.update({ is_archived: true }, {
      where: { idProductCategory: id }
    });

    res.status(200).json({ message: 'Product category archived successfully' });
  } catch (error) {
    logger.error(`Archive product category error: ${error.message}`);
    next(createError(500, 'Error archiving product category', error.message));
  }
};
