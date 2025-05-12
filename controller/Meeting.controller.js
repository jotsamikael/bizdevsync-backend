const { Meeting, Followup } = require('../model');
const createError = require('../middleware/error');
const { paginate } = require('./utils/paginate');

/**
 * @swagger
 * /meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Meeting created
 */
exports.createMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.create(req.body);
    res.status(201).json({ message: 'Meeting created', data: meeting });
  } catch (error) {
    next(createError(500, 'Create meeting error', error.message));
  }
};

/**
 * @swagger
 * /meetings:
 *   get:
 *     summary: Get all meetings (paginated)
 *     tags: [Meetings]
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
 *         description: List of meetings
 */
exports.getAllMeetings = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
    const meetings = await Meeting.findAndCountAll({
      where: { is_archived: false },
      include: [Followup],
      limit,
      offset
    });
    res.status(200).json(meetings);
  } catch (error) {
    next(createError(500, 'Fetch meetings error', error.message));
  }
};


/**
 * @swagger
 * /meetings/{id}:
 *   get:
 *     summary: Get a meeting by ID
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Meeting details
 */
exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({
      where: { idMeeting: req.params.id, is_archived: false },
      include: [Followup]
    });
    if (!meeting) return next(createError(404, 'Meeting not found'));
    res.status(200).json(meeting);
  } catch (error) {
    next(createError(500, 'Get meeting error', error.message));
  }
};


/**
 * @swagger
 * /meetings/{id}:
 *   put:
 *     summary: Update a meeting
 *     tags: [Meetings]
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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: Meeting updated
 */
exports.updateMeeting = async (req, res, next) => {
  try {
    await Meeting.update(req.body, {
      where: { idMeeting: req.params.id, is_archived: false }
    });
    res.status(200).json({ message: 'Meeting updated' });
  } catch (error) {
    next(createError(500, 'Update meeting error', error.message));
  }
};

/**
 * @swagger
 * /meetings/{id}:
 *   delete:
 *     summary: Archive a meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Meeting archived
 */

exports.archiveMeeting = async (req, res, next) => {
  try {
    await Meeting.update({ is_archived: true }, {
      where: { idMeeting: req.params.id }
    });
    res.status(200).json({ message: 'Meeting archived' });
  } catch (error) {
    next(createError(500, 'Archive meeting error', error.message));
  }
};
