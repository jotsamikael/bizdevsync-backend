const { ContactHasMeeting, Contact, Meeting } = require('../model');
const createError = require('../middleware/error');

/**
 * @swagger
 * /contact-has-meeting/link-meeting/{id}:
 *   post:
 *     summary: Link a contact to a meeting
 *     tags: [ContactHasMeeting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meeting_idMeeting:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Contact linked to Meeting
 */
exports.linkContactToMeeting = async (req, res, next) => {
  try {
    const { id } = req.params; // contact id
    const { meeting_idMeeting } = req.body;

    const link = await ContactHasMeeting.create({
      contact_idContact: id,
      meeting_idMeeting
    });

    res.status(201).json({ message: 'Contact linked to Meeting', data: link });
  } catch (error) {
    next(createError(500, 'Error linking Contact to Meeting', error.message));
  }
};

/**
 * @swagger
 * /contact-has-meeting/unlink-meeting/{meetingId}/{id}:
 *   delete:
 *     summary: Unlink a contact from a meeting
 *     tags: [ContactHasMeeting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *       - name: meetingId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Contact unlinked from Meeting
 */
exports.unlinkContactFromMeeting = async (req, res, next) => {
  try {
    const { id, meetingId } = req.params;

    await ContactHasMeeting.update({ is_archived: true }, {
      where: {
        contact_idContact: id,
        meeting_idMeeting: meetingId
      }
    });

    res.status(200).json({ message: 'Contact unlinked from Meeting' });
  } catch (error) {
    next(createError(500, 'Error unlinking Contact from Meeting', error.message));
  }
};

/**
 * @swagger
 * /contact-has-meeting/meetings/{id}:
 *   get:
 *     summary: Get all meetings linked to a contact
 *     tags: [ContactHasMeeting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: List of linked meetings
 */
exports.getMeetingsOfContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const links = await ContactHasMeeting.findAll({
      where: {
        contact_idContact: id,
        is_archived: false
      },
      include: [Meeting]
    });

    res.status(200).json(links);
  } catch (error) {
    next(createError(500, 'Error fetching contact meetings', error.message));
  }
};



/**
 * @swagger
 * /contact-has-meeting/contacts/{id}:
 *   get:
 *     summary: Get all contacts linked to a contact
 *     tags: [ContactHasMeeting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: List of linked contacts
 */
exports.getContactsLinkedToMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;

    const links = await ContactHasMeeting.findAll({
      where: {
        meeting_idMeeting: id,
        is_archived: false
      },
      include: [Contact]
    });

    res.status(200).json(links);
  } catch (error) {
    next(createError(500, 'Error fetching meetings contact', error.message));
  }
};