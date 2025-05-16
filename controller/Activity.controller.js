const { Activity, Followup } = require('../model');
const createError = require('../middleware/error');
const { paginate } = require('./utils/paginate');
const scoring = require('./utils/scoring.utils')

/**
 * CRUD functions with swagger documentation
 */
/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created
 */
exports.createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);

      // Recompute Followup score after creating the Activity
        const followupId = req.body.Followup_idFollowup || req.body.idFollowup;
        if (followupId) {
          await scoring.computeFollowupScore(followupId);
        }

    res.status(201).json({ message: 'Activity created', data: activity });
  } catch (error) {
    next(createError(500, 'Create activity error', error.message));
  }
};

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get all activities (paginated)
 *     tags: [Activities]
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
 *         description: List of activities
 */
exports.getAllActivities = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
    const activities = await Activity.findAndCountAll({
      where: { is_archived: false },
      include: [Followup],
      limit,
      offset
    });
    res.status(200).json(activities);
  } catch (error) {
    next(createError(500, 'Fetch activities error', error.message));
  }
};


/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Get an activity by ID
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Activity details
 */
exports.getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({
      where: { idActivity: req.params.id, is_archived: false },
      include: [Followup]
    });
    if (!activity) return next(createError(404, 'Activity not found'));
    res.status(200).json(activity);
  } catch (error) {
    next(createError(500, 'Get activity error', error.message));
  }
};


/**
 * @swagger
 * /activities/followups/{followupId}:
 *   get:
 *     summary: Get paginated activities for a followup
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: followupId
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
 *         description: Paginated list of activities
 */
exports.getActivitiesByFollowupId = async (req, res, next) => {
  try {
    const { followupId } = req.params;
    const { limit, offset } = require('./utils/paginate').paginate(req);

    const activities = await Activity.findAndCountAll({
      where: { Followup_idFollowup: followupId, is_archived: false },
      limit,
      offset
    });

    res.status(200).json(activities);
  } catch (error) {
    next(createError(500, 'Error fetching activities by followup', error.message));
  }
};

/**
 * @swagger
 * /activities/businesses/{businessId}:
 *   get:
 *     summary: Get paginated activities for a business
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: businessId
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
 *         description: Paginated list of activities
 */
exports.getActivitiesByBusinessId = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { limit, offset } = require('./utils/paginate').paginate(req);

    const activities = await Activity.findAndCountAll({
      where: { Business_idBusiness: businessId, is_archived: false },
      limit,
      offset
    });

    res.status(200).json(activities);
  } catch (error) {
    next(createError(500, 'Error fetching activities by business', error.message));
  }
};



/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Update an activity
 *     tags: [Activities]
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
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: Activity updated
 */
exports.updateActivity = async (req, res, next) => {
  try {
    await Activity.update(req.body, {
      where: { idActivity: req.params.id, is_archived: false }
    });
    res.status(200).json({ message: 'Activity updated' });
  } catch (error) {
    next(createError(500, 'Update activity error', error.message));
  }
};

/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Archive an activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Activity archived
 */
exports.archiveActivity = async (req, res, next) => {
  try {
    await Activity.update({ is_archived: true }, {
      where: { idActivity: req.params.id }
    });
    res.status(200).json({ message: 'Activity archived' });
  } catch (error) {
    next(createError(500, 'Archive activity error', error.message));
  }
};
