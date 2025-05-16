const { Followup, Lead } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');
const scoring = require('./utils/scoring.utils')

/**
 * @swagger
 * /followups:
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
 *               start_date: { type: string }
 *               source: { type: string }
 *               Lead_idLead: { type: integer }
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
 * /followups:
 *   get:
 *     summary: Get all followups (paginated)
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
            [db.Sequelize.Op.or]: [
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
 * /followups/{id}:
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
            [db.Sequelize.Op.or]: [
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
 * /followups/{id}:
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
 *             $ref: '#/components/schemas/Followup'
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
 * /followups/{id}:
 *   delete:
 *     summary: Archive a followup
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
 *         description: Followup archived
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
 * /followups/{followupId}/next-action:
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
 */
exports.getNextActionForFollowup = async (req, res, next) => {
  try {
    const { followupId } = req.params;

    const nextActivity = await Activity.findOne({
      where: {
        Followup_idFollowup: followupId,
        next_action_date: { [db.Sequelize.Op.gt]: new Date() },
        is_archived: false
      },
      order: [['next_action_date', 'ASC']]
    });

    const nextMeeting = await Meeting.findOne({
      where: {
        Followup_idFollowup: followupId,
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
    next(createError(500, 'Error fetching next action', error.message));
  }
};

/**
 * @swagger
 * /followups/{followupId}/overdue-actions:
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
        next_action_date: { [db.Sequelize.Op.lt]: new Date() },
        is_archived: false
      }
    });

    const overdueMeetings = await Meeting.findAll({
      where: {
        Followup_idFollowup: followupId,
        next_action_date: { [db.Sequelize.Op.lt]: new Date() },
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
