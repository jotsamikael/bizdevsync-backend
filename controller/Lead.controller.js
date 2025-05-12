const {User} = require('../model')
const {Lead} = require('../model')

const ENV = require('../config')
const createError = require('../middleware/error')
const logger = require("./utils/logger.utils");
const paginate = require("./utils/paginate");



/** CREATE LEAD */
/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               descrption: { type: string }
 *               country: { type: string }
 *               activitySector: { type: string }
 *               logo: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
exports.createLead = async (req, res, next) => {
    logger.info("Lead creation initiated");
    console.log(req.body)
    try {
        const userId = req.user.id;
        const leadName = req.body.name;
        const logoPath = req.file
            ? `/storage/leads/${leadName}/${req.file.filename}`
            : '/img/placeholder.png';

        const lead = await Lead.create({
            assigned_to_user_id: req.body.assignedToUser || userId,
            created_by_user_id: userId,
            name: leadName,
            description: req.body.description,
            logo: logoPath,
            Country_idCountry: req.body.country,
            activitySector: req.body.activitySector,
            is_private: req.body.is_private || false
        });

        res.status(201).json({ message: 'Lead created successfully', data: lead });
        logger.info(`New lead created: ${leadName}`);
    } catch (error) {
        logger.error(`Lead creation error: ${error.message}`);
        next(createError(500, "Error occurred during lead creation", error.message));
    }
};

/**GET LEADS BY ASSIGNED TO USER */
/**
 * @swagger
 * /leads/assigned:
 *   get:
 *     summary: Get all leads assigned to the logged-in user
 *     tags: [Leads]
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
 *         description: List of leads
 */
exports.getLeadsByAssignedUser = async (req, res, next) => {
    try {
        const { limit, offset } = require("./utils/paginate").paginate(req);
        const leads = await Lead.findAndCountAll({
            where: { 
                assigned_to_user_id: req.user.id,
                is_archived: false,
             },
            limit,
            offset
        });
        res.status(200).json(leads);
    } catch (error) {
        logger.error(`Fetch assigned leads error: ${error.message}`);
        next(createError(500, "Could not retrieve leads", error.message));
    }
};


/**GET LEADS BY CREATOR */
/**
 * @swagger
 * /leads/created:
 *   get:
 *     summary: Get all leads created by the logged-in user
 *     tags: [Leads]
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
 *         description: List of leads
 */
exports.getLeadsByCreator = async (req, res, next) => {
    try {
        const { limit, offset } = require("./utils/paginate").paginate(req);
        const leads = await Lead.findAndCountAll({
            where: { 
                created_by_user_id: req.user.id,
                is_archived: false,
             },
            limit,
            offset
        });
        res.status(200).json(leads);
    } catch (error) {
        logger.error(`Fetch created leads error: ${error.message}`);
        next(createError(500, "Could not retrieve leads", error.message));
    }
};

/**UPDATE */
/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
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
 *             $ref: '#/components/schemas/UpdateLead'
 *     responses:
 *       200:
 *         description: Lead updated
 */
exports.updateLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const updated = await Lead.update(req.body, { where: { id: leadId, is_archived: false } });
        res.status(200).json({ message: 'Lead updated successfully', data: updated });
    } catch (error) {
        logger.error(`Update lead error: ${error.message}`);
        next(createError(500, "Could not update lead", error.message));
    }
};


/**DELETE */

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Archive a lead (soft delete)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lead archived
 */
exports.archiveLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        await Lead.update({ is_archived: true }, { where: { id: leadId } });
        res.status(200).json({ message: 'Lead archived successfully' });
    } catch (error) {
        logger.error(`Archive lead error: ${error.message}`);
        next(createError(500, "Could not archive lead", error.message));
    }
};