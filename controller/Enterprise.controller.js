const { Enterprise,Country,Region } = require('../model');
const createError = require("../middleware/error");
const logger = require('./utils/logger.utils');

/**
 * @swagger
 * /enterprises/create:
 *   post:
 *     summary: Create a new enterprise
 *     tags: [Enterprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sector:
 *                 type: string
 *                 enum: [Technology, Healthcare, Education, Finance, Retail, Logistics, Manufacturing, Media]
 *               email_domain:
 *                 type: string
 *               website:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               country:
 *                 type: integer
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 */
exports.createEnterprise = async (req, res, next) => {
  logger.info('Enterprise creation initiated');

  try {
   console.log(req.body)
    // Step 2: Derive a safe folder name
    const domain = req.body.email_domain || req.body.website || req.body.name;
    const safeDomain = domain.replace(/[^a-zA-Z0-9]/g, '_');

    // Step 3: Set the logo path
    const logoPath = req.file
      ? `/storage/enterprise/${safeDomain}/${req.file.filename}`
      : '/img/default-logo.png';

    // Step 4: Create the enterprise
    const enterprise = await Enterprise.create({
      name: req.body.name,
      logo: logoPath,
      sector: req.body.sector,
      email_domain: req.body.email_domain,
      website: req.body.website,
      contact_email: req.body.contact_email,
      address: req.body.address,
      Country_idCountry: req.body.country,
      is_verified: false,
      subscription_status: 'active',
      is_archived: false
    });

    res.status(201).json({
      message: 'Enterprise created successfully',
      data: enterprise
    });

    logger.info(`Enterprise created: ${enterprise.name}`);
  } catch (error) {
    logger.error(`Enterprise creation error: ${error.message}`);
    next(createError(500, 'Error creating enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises/get-all:
 *   get:
 *     summary: Get all enterprises (paginated)
 *     tags: [Enterprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of enterprises
 */
exports.getAllEnterprises = async (req, res, next) => {
  try {
    const { limit, offset } = require("./utils/paginate").paginate(req);
    const enterprises = await Enterprise.findAndCountAll({
      where: { is_archived: false },
      limit,
      offset,
      include: [{ model: Country }]

    });

    res.status(200).json(enterprises);
  } catch (error) {
    logger.error(`Fetch enterprises error: ${error.message}`);
    next(createError(500, 'Error fetching enterprises', error.message));
  }
};

/**
 * @swagger
 * /enterprises/get-by-id/{id}:
 *   get:
 *     summary: Get an enterprise by ID
 *     tags: [Enterprises]
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
 *         description: Enterprise details
 */
exports.getEnterpriseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const enterprise = await Enterprise.findOne({
      where: { idEnterprise: id, is_archived: false },
      include: [Country]
      

    });

    if (!enterprise) {
      return next(createError(404, 'Enterprise not found'));
    }

    res.status(200).json(enterprise);
  } catch (error) {
    logger.error(`Fetch enterprise error: ${error.message}`);
    next(createError(500, 'Error fetching enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises/update/{id}:
 *   patch:
 *     summary: Update an existing enterprise
 *     description: Partially updates an enterprise's information
 *     tags:
 *       - Enterprises
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the enterprise to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Enterprise name
 *               sector:
 *                 type: string
 *                 description: Enterprise sector
 *               email_domain:
 *                 type: string
 *                 description: Enterprise email domain
 *               website:
 *                 type: string
 *                 description: Enterprise website URL
 *               contact_email:
 *                 type: string
 *                 description: Enterprise contact email
 *               address:
 *                 type: string
 *                 description: Enterprise physical address
 *               country:
 *                 type: string
 *                 description: Enterprise country identifier
 *               logo:
 *                 type: string
 *                 format: binary
 *             example:
 *               name: Tech Corp
 *               sector: Technology
 *               email_domain: techcorp.com
 *               website: https://techcorp.com
 *               contact_email: contact@techcorp.com
 *               address: 123 Main St
 *               country: US
 *     responses:
 *       200:
 *         description: Enterprise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Enterprise updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Enterprise'
 */
exports.updateEnterprise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enterprise = await Enterprise.findByPk(id);

    if (!enterprise) {
      return next(createError(404, "Enterprise not found"));
    }

    // Prepare updated data object starting with current values
    const updateData = {
      name: req.body.name ?? enterprise.name,
      logo: enterprise.logoPath,
      sector: req.body.sector ?? enterprise.sector,
      email_domain: req.body.email_domain ?? enterprise.email_domain,
      website: req.body.website ?? enterprise.website,
      contact_email: req.body.contact_email ?? enterprise.contact_email,
      address: req.body.address ?? enterprise.address,
      Country_idCountry: req.body.country ?? enterprise.Country_idCountry,
      is_verified: enterprise.is_verified,
      subscription_status: enterprise.subscription_status,
    };

    // Handle avatar upload if exists
    if (req.file) {
      const domain = req.body.email_domain || req.body.website || req.body.name;
      const safeDomain = domain.replace(/[^a-zA-Z0-9]/g, '_');

      updateData.logo = `/storage/enterprise/${safeDomain}/${req.file.filename}`|| '/img/default-logo.png';
    }

    await enterprise.update(updateData);

    logger.info(`Enterprise updated: ${enterprise.contact_email}`);
    res.status(200).json({ message: 'Enterprise updated successfully', data: updated });
  } catch (error) {
    logger.error(`Enterprise update error: ${error.message}`);
    next(createError(500, 'Error updating enterprise', error.message));
  }
};

/**
 * @swagger
 * /enterprises/delete/{id}:
 *   delete:
 *     summary: Archive an enterprise (soft delete)
 *     tags: [Enterprises]
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
 *         description: Enterprise archived
 */
exports.archiveEnterprise = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Enterprise.update({ is_archived: true }, {
      where: { idEnterprise: id }
    });

    res.status(200).json({ message: 'Enterprise archived successfully' });
  } catch (error) {
    logger.error(`Archive enterprise error: ${error.message}`);
    next(createError(500, 'Error archiving enterprise', error.message));
  }
};
