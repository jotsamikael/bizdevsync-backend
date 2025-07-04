const { User } = require("../model");
const { Lead, Country, Source } = require("../model");

const ENV = require("../config");
const createError = require("../middleware/error");
const logger = require("./utils/logger.utils");
const paginate = require("./utils/paginate");

/** CREATE LEAD */
/**
 * @swagger
 * /leads/create:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               country:
 *                 type: integer
 *               activitySector:
 *                 type: string
 *               assigned_to_user_id:
 *                 type: integer
 *               website:
 *                 type: string
 *               status:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               address:
 *                 type: string
 *               town:
 *                 type: string
 *               tags:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *               source:
 *                 type: integer
 *               lead_value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Lead'
 */
exports.createLead = async (req, res, next) => {
  logger.info("Lead creation initiated");
  console.log(req.body);
  try {
    const userId = req.user.id;
    const leadName = req.body.name;

    const lead = await Lead.create({
      assigned_to_user_id: req.body.assignedToUser || userId,
      created_by_user_id: userId,
      name: leadName,
      website: req.body.website,
      status: req.body.status,
      email: req.body.email,
      telephone: req.body.telephone,
      address: req.body.address,
      town: req.body.town,
      tags: req.body.tags,
      description: req.body.description,
      _idCountry: req.body.country,
      activitySector: req.body.activitySector,
      is_private: req.body.is_private || false,
      _idSource: req.body.source,
      lead_value: req.body.lead_value,
      //dates
      last_activity: new Date().toISOString(),
      date_assigned: new Date().toISOString(),
      last_status_change: new Date().toISOString(),
      date_converted: new Date().toISOString(),
    });
    console.log(lead);

    res.status(201).json({ message: "Lead created successfully", data: lead });
    logger.info(`New lead created: ${leadName}`);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(error.parent.sqlMessage); // or error.original.sqlMessage
      // or for a more general approach:
      console.log(error.errors[0].message); // "name must be unique"
      logger.error(`Lead creation error: ${error.errors[0].message}`);
      next(
        createError(
          500,
          `Error occurred during lead creation: ${error.errors[0].message}`,
          error.errors[0].message
        )
      );
    }
    logger.error(`Lead creation error: ${error.message}`);
    next(
      createError(
        500,
        `Error occurred during lead creation: ${error.message}`,
        error.message
      )
    );
  }
};

/**GET LEADS BY ASSIGNED TO USER */
/**
 * @swagger
 * /leads/assigned-to-me:
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
 *                     $ref: '#/components/schemas/Lead'
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
      offset,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["first_name", "first_name"],
        },
        { model: Country, attributes: ["short_name", "short_name"] },
        { model: Source, attributes: ["label", "label"] },
      ],
      order: [["createdAt", "DESC"]],
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
 * /leads/created-by-me:
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
 *                     $ref: '#/components/schemas/Lead'
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
      offset,
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
 * /leads/update/{id}:
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
 *            schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               country:
 *                 type: string
 *               activitySector:
 *                 type: string
 *               assigned_to_user_id:
 *                 type: integer
 *               website:
 *                 type: string
 *               status:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               address:
 *                 type: string
 *               town:
 *                 type: string
 *               tags:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *               source:
 *                 type: integer
 *               lead_value:
 *                 type: number
 *               last_activity:
 *                 type: string
 *               date_assigned:
 *                 type: string
 *               last_status_change:
 *                 type: string
 *               date_converted:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead updated
 */
exports.updateLead = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const lead = {
      assigned_to_user_id: req.body.assignedToUser,
      name: req.body.name,
      website: req.body.website,
      status: req.body.status,
      email: req.body.email,
      telephone: req.body.telephone,

      address: req.body.address,
      town: req.body.town,
      tags: req.body.tags,
      description: req.body.description,
      _idCountry: req.body.country,
      activitySector: req.body.activitySector,
      is_private: req.body.is_private,
      _idSource: req.body.source,
      lead_value: req.body.lead_value,
      //dates
      last_activity: req.body.last_activity,
      date_assigned: req.body.date_assigned,
      last_status_change: req.body.last_status_change,
      date_converted: req.body.date_converted,
    };
    const updated = await Lead.update(lead, {
      where: { id: leadId, is_archived: false },
    });
    res
      .status(200)
      .json({ message: "Lead updated successfully", data: updated });
  } catch (error) {
    logger.error(`Update lead error: ${error.message}`);
    next(createError(500, "Could not update lead", error.message));
  }
};

/**DELETE */

/**
 * @swagger
 * /leads/delete/{id}:
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
    res.status(200).json({ message: "Lead archived successfully" });
  } catch (error) {
    logger.error(`Archive lead error: ${error.message}`);
    next(createError(500, "Could not archive lead", error.message));
  }
};
