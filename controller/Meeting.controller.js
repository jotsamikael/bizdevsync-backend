const { Meeting, Followup, Contact, ContactHasMeeting } = require("../model");
const createError = require("../middleware/error");
const { paginate } = require("./utils/paginate");
const scoring = require("./utils/scoring.utils");

/**
 * @swagger
 * /meetings/create:
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
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               summary:
 *                 type: string
 *               next_action:
 *                 type: string
 *               next_action_date:
 *                 type: string
 *               due_date:
 *                 type: string
 *               title:
 *                 type: string
 *               _idFollowup:
 *                 type: number
 *               _idBusiness:
 *                 type: number
 *               contact_emails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meeting created
 */
exports.createMeeting = async (req, res, next) => {
  const {title, summary, next_action, next_action_date, due_date, _idFollowup, _idBusiness } = req.body;
  let { contact_emails } = req.body; // Declare contact_emails with let to reassign
  const userId = req.user.id;

  try {
    // Parse contact_emails string into an array
    let parsedContactEmails = [];
    if (typeof contact_emails === 'string' && contact_emails.length > 0) {
      parsedContactEmails = contact_emails.split(',').map(email => email.trim());
    } else if (Array.isArray(contact_emails)) {
      // If it's already an array (e.g., if the frontend was updated to send an array)
      parsedContactEmails = contact_emails.map(email => email.trim());
    }

    const meeting = await Meeting.create({
      date: req.body.assignedToUser || userId, // Consider if 'date' should be 'assignedToUser' or 'created_date'
      created_date: new Date().toISOString(),
      title,
      summary,
      next_action,
      next_action_date,
      due_date,
      _idFollowup,
      _idBusiness,
      _idUser: userId,
    });

        console.log('idmeeting',meeting.idMeeting);


    // ✅ Link contacts by email
    if (parsedContactEmails.length > 0) {
      const contacts = await Contact.findAll({
        where: {
          email: parsedContactEmails, // Use the parsed array here
        }
      });

    console.log('emails',contacts);


      const linkPromises = contacts.map(contact => 
        ContactHasMeeting.create({
          contact_idContact: contact.id,
          meeting_idMeeting: meeting.idMeeting,
        })
      );

      await Promise.all(linkPromises);
    }

    // Recompute Followup score
    const followupId = _idFollowup || req.body.Followup_idFollowup || req.body.idFollowup;
    if (followupId) {
      await scoring.computeFollowupScore(followupId);
    }

    res.status(201).json({ message: "Meeting created", data: meeting });
  } catch (error) {
    console.log(error)
    next(createError(500, "Create meeting error", error.message));
  }
};


/**
 * @swagger
 * /meetings/get-all:
 *   get:
 *     summary: Get all meetings f the logged-in user (paginated) 
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
 *         description: List of Meetings
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
exports.getAllMeetings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { limit, offset } = paginate(req);
    const meetings = await Meeting.findAndCountAll({
      where: { is_archived: false, _idUser:userId },
      include: [Followup],
      limit,
      offset,
    });
    res.status(200).json(meetings);
  } catch (error) {
    next(createError(500, "Fetch meetings error", error.message));
  }
};

/**
 * @swagger
 * /meetings/get-by-id/{id}:
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
      include: [Followup],
    });
    if (!meeting) return next(createError(404, "Meeting not found"));
    res.status(200).json(meeting);
  } catch (error) {
    next(createError(500, "Get meeting error", error.message));
  }
};

/**
 * @swagger
 * /meetings/update/{id}:
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
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               summary:
 *                 type: string
 *               next_action:
 *                 type: string
 *               next_action_date:
 *                 type: string
 *               due_date:
 *                 type: string
 *               title:
 *                 type: string
 *               _idFollowup:
 *                 type: number
 *               _idBusiness:
 *                 type: number
 *     responses:
 *       200:
 *         description: Meeting updated
 */
exports.updateMeeting = async (req, res, next) => {
  try {
    await Meeting.update(req.body, {
      where: { idMeeting: req.params.id, is_archived: false },
    });
    res.status(200).json({ message: "Meeting updated" });
  } catch (error) {
    next(createError(500, "Update meeting error", error.message));
  }
};

/**
 * @swagger
 * /meetings/get-by-followup/{followupId}:
 *   get:
 *     summary: Get paginated meetings for a followup
 *     tags: [Meetings]
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
 *         description: List of Meetings
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
exports.getMeetingsByFollowupId = async (req, res, next) => {
  try {
    const { followupId } = req.params;
    const { limit, offset } = require("./utils/paginate").paginate(req);

    const meetings = await Meeting.findAndCountAll({
      where: { _idFollowup: followupId, is_archived: false },
      limit,
      offset,
    });

    res.status(200).json(meetings);
  } catch (error) {
    console.log(error)
    next(
      createError(500, "Error fetching meetings by followup", error.message)
    );
  }
}; 

/**
 * @swagger
 * /meetings/get-by-business/{businessId}:
 *   get:
 *     summary: Get paginated meetings for a business
 *     tags: [Meetings]
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
 *         description: Paginated list of meetings
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
exports.getMeetingsByBusinessId = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { limit, offset } = require("./utils/paginate").paginate(req);

    const meetings = await Meeting.findAndCountAll({
      where: {_idBusiness: businessId, is_archived: false },
      limit,
      offset,
    });

    res.status(200).json(meetings);
  } catch (error) {
    next(
      createError(500, "Error fetching meetings by business", error.message)
    );
  }
};

/**
 * @swagger
 * /meetings/delete/{id}:
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
  *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Meeting'
 */
exports.archiveMeeting = async (req, res, next) => {
  try {
    await Meeting.update(
      { is_archived: true },
      {
        where: { idMeeting: req.params.id },
      }
    );
    res.status(200).json({ message: "Meeting archived" });
  } catch (error) {
    next(createError(500, "Archive meeting error", error.message));
  }
};
