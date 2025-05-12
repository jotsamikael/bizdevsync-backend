const { Business, Lead, User, Activity, Meeting } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');

/**
 * @swagger
 * /businesses:
 *   post:
 *     summary: Create a new business opportunity
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Business'
 *     responses:
 *       201:
 *         description: Business created successfully
 */
exports.createBusiness = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const business = await Business.create({
      ...req.body,
      created_by_user_id: userId
    });
    res.status(201).json({ message: 'Business created successfully', data: business });
    logger.info(`Business created: ${business.idBusiness}`);
  } catch (error) {
    logger.error(`Create business error: ${error.message}`);
    next(createError(500, 'Could not create business', error.message));
  }
};

/**
 * @swagger
 * /businesses:
 *   get:
 *     summary: Get all businesses created by the logged-in user (paginated)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of businesses
 */
exports.getAllBusinesses = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
    const businesses = await Business.findAndCountAll({
      where: { created_by_user_id: req.user.id, is_archived: false },
      include: [Lead, Activity, Meeting],
      limit,
      offset
    });
    res.status(200).json(businesses);
  } catch (error) {
    logger.error(`Fetch businesses error: ${error.message}`);
    next(createError(500, 'Could not fetch businesses', error.message));
  }
};

/**
 * @swagger
 * /businesses/{id}:
 *   get:
 *     summary: Get a business by ID
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Business details
 */
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findOne({
      where: { idBusiness: req.params.id, is_archived: false },
      include: [Lead, Activity, Meeting]
    });
    if (!business) return next(createError(404, 'Business not found'));
    res.status(200).json(business);
  } catch (error) {
    next(createError(500, 'Could not get business', error.message));
  }
};

/**
 * @swagger
 * /businesses/{id}:
 *   put:
 *     summary: Update a business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Business'
 *     responses:
 *       200:
 *         description: Business updated
 */
exports.updateBusiness = async (req, res, next) => {
  try {
    await Business.update(req.body, {
      where: { idBusiness: req.params.id, is_archived: false }
    });
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (error) {
    next(createError(500, 'Could not update business', error.message));
  }
};

/**
 * @swagger
 * /businesses/{id}:
 *   delete:
 *     summary: Archive a business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Business archived
 */
exports.archiveBusiness = async (req, res, next) => {
  try {
    await Business.update({ is_archived: true }, {
      where: { idBusiness: req.params.id }
    });
    res.status(200).json({ message: 'Business archived successfully' });
  } catch (error) {
    next(createError(500, 'Could not archive business', error.message));
  }
};
