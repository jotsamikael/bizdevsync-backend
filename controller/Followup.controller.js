const { Followup, Lead, Activity, Meeting } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');
const scoring = require('./utils/scoring.utils')
const { Op } = require('sequelize');


/**
 * @swagger
 * /followups/create:
 *   post:
 *     summary: Create a new followup
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               Lead_idLead:
 *                 type: integer
 *               outcome:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [in_progress, completed, paused, cancelled]
 *               priority:
 *                 type: string
 *                 enum: [CRITICAL, IMPORTANT, HIGH, MEDIUM, LOW]
 *     responses:
 *       201:
 *         description: Followup created
 */
exports.createFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.create(req.body);
    res.status(201).json({ message: 'Followup created successfully', data: followup });
    logger.info(`Followup created: ${followup.idFollowup}`);
  } catch (error) {
    logger.error(`Create followup error: ${error.message}`);
    next(createError(500, 'Could not create followup', error.message));
  }
};

/**
 * @swagger
 * /followups/get-all:
 *   get:
 *     summary: Get all followups (paginated) of logged in user
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followups
 */
exports.getAllFollowups = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
    const followups = await Followup.findAndCountAll({
      where: { is_archived: false },
      include: [{
          model: Lead,
          required: true,
          where: {
            [Op.or]: [
              { created_by_user_id: req.user.id },
              { assigned_to_user_id: req.user.id }
            ]
          }
        }],
      limit,
      offset
    });
    res.status(200).json(followups);
  } catch (error) {
    logger.error(`Fetch followups error: ${error.message}`);
    next(createError(500, 'Could not fetch followups', error.message));
  }
};

/**
 * @swagger
 * /followups/get-by-id/{id}:
 *   get:
 *     summary: Get a followup by ID
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Followup details
 */

exports.getFollowupById = async (req, res, next) => {
  try {
    const followup = await Followup.findOne({
      where: { idFollowup: req.params.id, is_archived: false },
      include: [
          {
          model: Lead,
          required: true,
          where: {
            [Op.or]: [
              { created_by_user_id: req.user.id },
              { assigned_to_user_id: req.user.id }
            ]
          }
        }
      ]
    });

    if (!followup) return next(createError(404, 'Followup not found'));
    res.status(200).json(followup);
  } catch (error) {
    next(createError(500, 'Error getting followup', error.message));
  }
};

/**
 * @swagger
 * /followups/update/{id}:
 *   put:
 *     summary: Update a followup
 *     tags: [Followups]
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
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               _idLead:
 *                 type: integer
 *               outcome:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [in_progress, completed, paused, cancelled]
 *               priority:
 *                 type: string
 *                 enum: [CRITICAL, IMPORTANT, HIGH, MEDIUM, LOW]
 *     responses:
 *       200:
 *         description: Followup updated
 */

exports.updateFollowup = async (req, res, next) => {
  try {
    await Followup.update(req.body, {
      where: { idFollowup: req.params.id, is_archived: false }
    });
    res.status(200).json({ message: 'Followup updated successfully' });
  } catch (error) {
    next(createError(500, 'Error updating followup', error.message));
  }
};


/**
 * @swagger
 * /followups/delete/{id}:
 *   delete:
 *     summary: Archive a followup
 *     tags: [Followups]
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
 *         description: Followup archived successfully
  *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Followup'
 */
exports.archiveFollowup = async (req, res, next) => {
  try {
    await Followup.update({ is_archived: true }, {
      where: { idFollowup: req.params.id }
    });
    res.status(200).json({ message: 'Followup archived successfully' });
  } catch (error) {
    next(createError(500, 'Error archiving followup', error.message));
  }
};


/**
 * @swagger
 * /followups/next-action/{followupId}:
 *   get:
 *     summary: Get next scheduled action (activity/meeting) for a followup
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: followupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Next action (activity/meeting)
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
 *                     $ref: '#/components/schemas/Meeting'
 */
exports.getNextActionForFollowup = async (req, res, next) => {
  try {
    const { followupId } = req.params;

    const nextActivity = await Activity.findOne({
      where: {
        Followup_idFollowup: followupId,
        next_action_date: { [Op.gt]: new Date() },
        is_archived: false
      },
      order: [['next_action_date', 'ASC']]
    });

    const nextMeeting = await Meeting.findOne({
      where: {
        Followup_idFollowup: followupId,
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
    next(createError(500, 'Error fetching next action', error.message));
  }
};

/**
 * @swagger
 * /followups/overdue-actions/{followupId}:
 *   get:
 *     summary: Get overdue actions (activity/meeting) for a followup
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: followupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Overdue actions list
 */
exports.getOverdueActionsForFollowup = async (req, res, next) => {
  try {
    const { followupId } = req.params;

    const overdueActivities = await Activity.findAll({
      where: {
        Followup_idFollowup: followupId,
        status:{ [Op.ne]: "COMPLETED" }, // select rows where status is not complete, [Op.in]: ["PENDING", "IN_PROGRESS", "NOT_STARTED", "WAITING_FEEDBACK"]: include only certain status 
        end_date: { [Op.lt]: new Date() },
        is_archived: false
      }
    });

    const overdueMeetings = await Meeting.findAll({
      where: {
        Followup_idFollowup: followupId,
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
    next(createError(500, 'Error fetching overdue actions', error.message));
  }
};

/**
 * @swagger
 * /followups/update-score:
 *   put:
 *     summary: Update followup scores
 *     tags: [Followups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followup scores updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Followup scores updated
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 */
exports.updateAllFollowupScores = async (req, res, next) => {
  try {
    const followups = await Followup.findAll({ where: { is_archived: false } });
    const results = [];

    for (const f of followups) {
      const result = await scoring.computeFollowupScore(f.idFollowup);
      if (result) results.push(result);
    }

    res.status(200).json({ message: 'Followup scores updated', results });
  } catch (error) {
    next(createError(500, 'Error updating followup scores', error.message));
  }
};
