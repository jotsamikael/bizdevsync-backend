const { Business, Lead, User, Activity, Meeting } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');
const { Op } = require('sequelize');


/**
 * @swagger
 * /businesses/create:
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
 *             type: object
 *             properties:
 *               need:
 *                 type: string
 *                 example: "Improve supply chain efficiency"
 *               approach:
 *                 type: string
 *                 example: "Product presentation followed by workshop"
 *               stage:
 *                 type: string
 *                 example: "opportunity"
 *               client_constraints:
 *                 type: string
 *                 nullable: true
 *                 example: "Client requires government certification"
 *               business_type:
 *                 type: string
 *                 example: "Software subscription"
 *               case_level:
 *                 type: string
 *                 example: "Strategic"
 *               total_turnover:
 *                 type: string
 *                 nullable: true
 *                 example: "3M EUR"
 *               potential_time_for_delivery:
 *                 type: string
 *                 nullable: true
 *                 example: "Q3 2025"
 *               case_started_date:
 *                 type: string
 *                 example: "2025-05-19"
 *               current_supplier:
 *                 type: string
 *                 nullable: true
 *                 example: "Oracle"
 *               previous_vc:
 *                 type: string
 *                 nullable: true
 *                 example: "None"
 *               turnover_signable:
 *                 type: string
 *                 nullable: true
 *                 example: "500K EUR"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Client showed interest in our new integration API."
 *               closed_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2025-08-01"
 *               _idLead:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Business created successfully
  *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Business'
 */
exports.createBusiness = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const business = await Business.create({
      need: req.body.need,
      approach: req.body.approach,
      stage: req.body.stage,
      client_constraints: req.body.client_constraints,
      business_type: req.body.business_type,
      case_level: req.body.case_level,
      total_turnover: req.body.total_turnover,
      potential_time_for_delivery: req.body.potential_time_for_delivery,
      case_started_date: req.body.case_started_date,
      current_supplier: req.body.current_supplier,
      previous_vc: req.body.previous_vc,
      turnover_signable: req.body.turnover_signable,
      notes: req.body.notes,
      closed_date: req.body.closed_date,
      Lead_idLead: req.body.Lead_idLead,
      created_by_user_id: userId,
      created_date: new Date().toISOString()
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
 * /businesses/get-all:
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
 *                     $ref: '#/components/schemas/Business'
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
 * /businesses/get-by-id/{id}:
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
            [Op.or]: [
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
 * /businesses/get-by-lead-id/{idLead}:
 *   get:
 *     summary: Get a business by lead id
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idLead
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
 *         description: List of businesses
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
 *                     $ref: '#/components/schemas/Business'
 */
exports.getBusinessByLeadId = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
     const businesses = await Business.findAndCountAll({
      where: { created_by_user_id: req.user.id, _idLead: req.params.idLead ,is_archived: false },
      include: [Lead],
      limit,
      offset
    });
   
    if (!businesses) return next(createError(404, 'No business  found'));
    res.status(200).json(businesses);
  } catch (error) {
    next(createError(500, 'Could not get business(es)', error.message));
  }
};

/**
 * @swagger
 * /businesses/update/{id}:
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
 *             type: object
 *             properties:
 *               need:
 *                 type: string
 *                 example: "Improve supply chain efficiency"
 *               approach:
 *                 type: string
 *                 example: "Product presentation followed by workshop"
 *               stage:
 *                 type: string
 *                 example: "opportunity"
 *               client_constraints:
 *                 type: string
 *                 nullable: true
 *                 example: "Client requires government certification"
 *               business_type:
 *                 type: string
 *                 example: "Software subscription"
 *               case_level:
 *                 type: string
 *                 example: "Strategic"
 *               total_turnover:
 *                 type: string
 *                 nullable: true
 *                 example: "3M EUR"
 *               potential_time_for_delivery:
 *                 type: string
 *                 nullable: true
 *                 example: "Q3 2025"
 *               case_started_date:
 *                 type: string
 *                 example: "2025-05-19"
 *               current_supplier:
 *                 type: string
 *                 nullable: true
 *                 example: "Oracle"
 *               previous_vc:
 *                 type: string
 *                 nullable: true
 *                 example: "None"
 *               turnover_signable:
 *                 type: string
 *                 nullable: true
 *                 example: "500K EUR"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Client showed interest in our new integration API."
 *               closed_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2025-08-01"
 *               _idLead:
 *                 type: integer
 *                 example: 7
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
 * /businesses/delete/{id}:
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
 * /businesses/next-action/{businessId}:
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
        _idBusiness: businessId,
        next_action_date: { [Op.gt]: new Date() },
        is_archived: false
      },
      order: [['next_action_date', 'ASC']]
    });

    const nextMeeting = await Meeting.findOne({
      where: {
        _idBusiness: businessId,
        next_action_date: { [Op.gt]: new Date() },
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
 * /businesses/overdue-actions/{businessId}:
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
        _idBusiness: businessId,
        status:{ [Op.ne]: "COMPLETED" }, // select rows where status is not complete, [Op.in]: ["PENDING", "IN_PROGRESS", "NOT_STARTED", "WAITING_FEEDBACK"]: include only certain status 
        end_date: { [Op.lt]: new Date() },
        is_archived: false
      }
    });

    const overdueMeetings = await Meeting.findAll({
      where: {
        _idBusiness: businessId,
        status:{ [Op.ne]: "COMPLETED" },
        due_date: { [Op.lt]: new Date() },
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
