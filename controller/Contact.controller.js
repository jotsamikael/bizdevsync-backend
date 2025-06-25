const { Contact, Lead, Country } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { Op } = require('sequelize');


/**
 * @swagger
 * /contacts/create:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedToUser: { type: integer }
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               position: { type: string }
 *               language: { type: string }
 *               notes: { type: string }
 *               _idLead: { type: integer }
 *               _idCountry: { type: integer }
 *     responses:
 *       201:
 *         description: Contact created
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Contact'
 */
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({
      ...req.body
    });

    res.status(201).json({ message: 'Contact created successfully', data: contact });
    logger.info(`Contact created: ${contact.first_name} ${contact.last_name}`);
  } catch (error) {
    logger.error(`Contact creation error: ${error.message}`);
  next(
        createError(
          500,
          `Error occurred during contact creation: ${error.errors[0].message}`,
          error.errors[0].message
        )
      );  }
};

/**
 * @swagger
 * /contacts/get-all:
 *   get:
 *     summary: Get all contacts (paginated)
 *     tags: [Contacts]
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
 *         description: List of contacts
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
 *                     $ref: '#/components/schemas/Contact'
 */
exports.getAllContacts = async (req, res, next) => {
  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const contacts = await Contact.findAndCountAll({
      where: { is_archived: false },
      limit,
      offset,
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
        },
        {
          model: Country
        }
      ],
      order: [['createdAt', 'DESC']]

    });

    res.status(200).json(contacts);
  } catch (error) {
    logger.error(`Fetch contacts error: ${error.message}`);
    next(createError(500, 'Error fetching contacts', error.message));
  }
};

/**
 * @swagger
 * /contacts/get-contacts-by-lead/{leadId}:
 *   get:
 *     summary: Get all contacts for a specific lead
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: leadId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Lead
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of contacts for the specified lead
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
 *                     type: object
 *       500:
 *         description: Error fetching contacts
 */
exports.getContactsByLead = async (req, res, next) => {
  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const { leadId } = req.params;

    const contacts = await Contact.findAndCountAll({
      where: {
        is_archived: false,
        _idLead: leadId
      },
      limit,
      offset,
      include: [
        { model: Lead }, // optional if you want lead data
        { model: Country }
      ]
    });

    res.status(200).json(contacts);
  } catch (error) {
    logger.error(`Fetch contacts by lead error: ${error.message}`);
    next(createError(500, 'Error fetching contacts for this lead', error.message));
  }
};
/**
 * @swagger
 * /contacts/get-by-id/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contact detail
 */
exports.getContactById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findOne({
      where: { id, is_archived: false },
      include: [Lead, Country]
    });

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json(contact);
  } catch (error) {
    logger.error(`Fetch contact error: ${error.message}`);
    next(createError(500, 'Error fetching contact', error.message));
  }
};

/**
 * @swagger
 * /contacts/update/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contact updated
 */
exports.updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await Contact.update(req.body, {
      where: { id, is_archived: false }
    });

    res.status(200).json({ message: 'Contact updated successfully', data: updated });
  } catch (error) {
    logger.error(`Contact update error: ${error.message}`);
    next(createError(500, 'Error updating contact', error.message));
  }
};

/**
 * @swagger
 * /contacts/delete/{id}:
 *   delete:
 *     summary: Archive a contact (soft delete)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contact archived
 */
exports.archiveContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Contact.update({ is_archived: true }, {
      where: { id }
    });

    res.status(200).json({ message: 'Contact archived successfully' });
  } catch (error) {
    logger.error(`Archive contact error: ${error.message}`);
    next(createError(500, 'Error archiving contact', error.message));
  }
};



/**
 * @swagger
 * /contacts/get-by-meeting/{meetingId}:
 *   get:
 *     summary: Get paginated contacts linked to a meeting
 *     tags: [ContactHasMeeting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: meetingId
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
 *         description: Paginated list of contacts
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
 *                     $ref: '#/components/schemas/Contact'
 */
exports.getContactsByMeetingId = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { limit, offset } = require('./utils/paginate').paginate(req);

    const links = await ContactHasMeeting.findAndCountAll({
      where: { meeting_idMeeting: meetingId, is_archived: false },
      limit,
      offset,
      include: [Contact]
    });

    res.status(200).json({
      count: links.count,
      rows: links.rows.map(link => link.Contact)
    });
  } catch (error) {
    next(createError(500, 'Error fetching contacts by meeting', error.message));
  }
};

