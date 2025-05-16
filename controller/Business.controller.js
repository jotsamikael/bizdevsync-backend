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
      include: [  {
          model: Lead,
          required: true,
          where: {
            [db.Sequelize.Op.or]: [
              { created_by_user_id: req.user.id },
              { assigned_to_user_id: req.user.id }
            ]
          }
        }, {model:Activity},
         {model:Meeting}]
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


/**
 * @swagger
 * /businesses/{businessId}/next-action:
 *   get:
 *     summary: Get next scheduled action (activity/meeting) for a business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Next action (activity or meeting) for the business
 */
exports.getNextActionForBusiness = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const nextActivity = await Activity.findOne({
      where: {
        Business_idBusiness: businessId,
        next_action_date: { [db.Sequelize.Op.gt]: new Date() },
        is_archived: false
      },
      order: [['next_action_date', 'ASC']]
    });

    const nextMeeting = await Meeting.findOne({
      where: {
        Business_idBusiness: businessId,
        next_action_date: { [db.Sequelize.Op.gt]: new Date() },
        is_archived: false
      },
      order: [['next_action_date', 'ASC']]
    });

    const nextAction = [nextActivity, nextMeeting]
      .filter(Boolean)
      .sort((a, b) => new Date(a.next_action_date) - new Date(b.next_action_date))[0];

    res.status(200).json(nextAction || { message: 'No upcoming actions' });
  } catch (error) {
    next(createError(500, 'Error fetching next action for business', error.message));
  }
};


/**
 * @swagger
 * /businesses/{businessId}/overdue-actions:
 *   get:
 *     summary: Get overdue actions (activity/meeting) for a business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Business ID
 *     responses:
 *       200:
 *         description: List of overdue activities and meetings for the business
 */
exports.getOverdueActionsForBusiness = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const overdueActivities = await Activity.findAll({
      where: {
        Business_idBusiness: businessId,
        next_action_date: { [db.Sequelize.Op.lt]: new Date() },
        is_archived: false
      }
    });

    const overdueMeetings = await Meeting.findAll({
      where: {
        Business_idBusiness: businessId,
        next_action_date: { [db.Sequelize.Op.lt]: new Date() },
        is_archived: false
      }
    });

    res.status(200).json({
      overdue_activities: overdueActivities,
      overdue_meetings: overdueMeetings
    });
  } catch (error) {
    next(createError(500, 'Error fetching overdue actions for business', error.message));
  }
};
