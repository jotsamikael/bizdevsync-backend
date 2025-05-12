const { Enterprise } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');

/**
 * @swagger
 * /enterprises:
 *   post:
 *     summary: Create a new enterprise
 *     tags: [Enterprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               sector:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enterprise created successfully
 */
exports.createEnterprise = async (req, res, next) => {
  try {
    const enterprise = await Enterprise.create({
      name: req.body.name,
      logo: req.body.logo,
      sector: req.body.sector,
      Country_idCountry: req.body.Country_idCountry

    });

    res.status(201).json({ message: 'Enterprise created successfully', data: enterprise });
    logger.info(`Enterprise created: ${enterprise.name}`);
  } catch (error) {
    logger.error(`Enterprise creation error: ${error.message}`);
    next(createError(500, 'Error creating enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises:
 *   get:
 *     summary: Get all enterprises (paginated)
 *     tags: [Enterprises]
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
 *         description: List of enterprises
 */
exports.getAllEnterprises = async (req, res, next) => {
  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const enterprises = await Enterprise.findAndCountAll({
      where: { is_archived: false },
      limit,
      offset,
      include: [{ model: Country }]

    });

    res.status(200).json(enterprises);
  } catch (error) {
    logger.error(`Fetch enterprises error: ${error.message}`);
    next(createError(500, 'Error fetching enterprises', error.message));
  }
};

/**
 * @swagger
 * /enterprises/{id}:
 *   get:
 *     summary: Get an enterprise by ID
 *     tags: [Enterprises]
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
 *         description: Enterprise details
 */
exports.getEnterpriseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const enterprise = await Enterprise.findOne({
      where: { idEnterprise: id, is_archived: false },
      include: [{ model: Country }]

    });

    if (!enterprise) {
      return next(createError(404, 'Enterprise not found'));
    }

    res.status(200).json(enterprise);
  } catch (error) {
    logger.error(`Fetch enterprise error: ${error.message}`);
    next(createError(500, 'Error fetching enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises/{id}:
 *   put:
 *     summary: Update an enterprise
 *     tags: [Enterprises]
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
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               sector:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enterprise updated
 */
exports.updateEnterprise = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await Enterprise.update(req.body, {
      where: { idEnterprise: id, is_archived: false }
    });

    res.status(200).json({ message: 'Enterprise updated successfully', data: updated });
  } catch (error) {
    logger.error(`Enterprise update error: ${error.message}`);
    next(createError(500, 'Error updating enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises/{id}:
 *   delete:
 *     summary: Archive an enterprise (soft delete)
 *     tags: [Enterprises]
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
 *         description: Enterprise archived
 */
exports.archiveEnterprise = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Enterprise.update({ is_archived: true }, {
      where: { idEnterprise: id }
    });

    res.status(200).json({ message: 'Enterprise archived successfully' });
  } catch (error) {
    logger.error(`Archive enterprise error: ${error.message}`);
    next(createError(500, 'Error archiving enterprise', error.message));
  }
};
