const { Activity, Followup } = require('../model');
const createError = require('../middleware/error');
const { paginate } = require('./utils/paginate');
const scoring = require('./utils/scoring.utils')

/**
 * CRUD functions with swagger documentation
 */
/**
 * @swagger
 * /activities/create:
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *               created_date:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               tags:
 *                 type: string
 *               priority:
 *                 type: string
 *               last_action:
 *                 type: string
 *               last_action_date:
 *                 type: string
 *               next_action:
 *                 type: string
 *               next_action_date:
 *                 type: string
 *               Followup_idFollowup:
 *                 type: number
 *               Business_idBusiness:
 *                 type: number
 *     responses:
 *       201:
 *         description: Activity created
 */
exports.createActivity = async (req, res, next) => {
  try {
        const userId = req.user.id;
         const activity = await Activity.create({
            title: req.body.title,
            detail:req.body.detail,
            created_date: new Date().toISOString(),
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            priority:req.body.priority,
            tags:req.body.tags,
            last_action: req.body.last_action,
            last_action_date: req.body.last_action_date,
            next_action: req.body.next_action,
            next_action_date: req.body.next_action_date,
            Followup_idFollowup: req.body.Followup_idFollowup,
            Business_idBusiness: req.body.Business_idBusiness,

            _idUser: userId
        });

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
 * /activities/get-all:
 *   get:
 *     summary: Get all activities of the logged-in user (paginated) 
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
    const userId = req.user.id;

    const { limit, offset } = paginate(req);
    const activities = await Activity.findAndCountAll({
      where: { is_archived: false, _idUser:userId },
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
 * /activities/get-by-id/{id}:
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
 * /activities/update/{id}:
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *               created_date:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               tags:
 *                 type: string
 *               priority:
 *                 type: string
 *               last_action:
 *                 type: string
 *               last_action_date:
 *                 type: string
 *               next_action:
 *                 type: string
 *               next_action_date:
 *                 type: string
 *               Followup_idFollowup:
 *                 type: number
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
 * /activities/delete/{id}:
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
