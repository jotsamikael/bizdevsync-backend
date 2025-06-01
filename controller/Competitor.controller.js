const { Competitor, Business } = require('../model');
const createError = require('../middleware/error');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');

/**
 * @swagger
 * /competitors/create:
 *   post:
 *     summary: Create a new competitor
 *     tags: [Competitors]
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
 *                 example: "TechNova"
 *               sector:
 *                 type: string
 *                 example: "Cloud Services"
 *               headquater_location:
 *                 type: string
 *                 example: "San Francisco, USA"
 *               reference_clients:
 *                 type: string
 *                 example: "Acme Corp, GlobalTel, Fintech Group"
 *               product_line:
 *                 type: string
 *                 example: "Enterprise cloud storage, backup solutions"
 *               website:
 *                 type: string
 *                 nullable: true
 *                 example: "https://www.technova.com"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Known for aggressive pricing and strong customer support."
 *     responses:
 *       201:
 *         description: Competitor created successfully
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Competitor'
 */
exports.createCompetitor = async (req, res, next) => {
  try {
    const userId = req.user.id;

      // Create competitor
    const competitor = await Competitor.create({
      name: req.body.name,
      sector: req.body.sector,
      headquater_location: req.body.headquater_location,
      reference_clients: req.body.reference_clients,
      product_line: req.body.product_line,
      website: req.body.website,
      notes: req.body.notes,
      last_updated: new Date().toISOString(),
      _idUser: userId
    });

    res.status(201).json({ message: 'Competitor created successfully', data: competitor });
    logger.info(`Competitor created: ${competitor.idCompetitor}`);
  } catch (error) {
    logger.error(`Competitor creation error: ${error.message}`);
    next(createError(500, 'Could not create competitor', error.message));
  }
};

/**
 * @swagger
 * /competitors/get-all:
 *   get:
 *     summary: Get all competitors (paginated)
 *     tags: [Competitors]
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
 *         description: List of competitors
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
 *                     $ref: '#/components/schemas/Competitor'
 */
exports.getAllCompetitors = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req);
    const competitors = await Competitor.findAndCountAll({
      where: { is_archived: false },
      include: [Business],
      limit,
      offset
    });

    res.status(200).json(competitors);
  } catch (error) {
    logger.error(`Fetch competitors error: ${error.message}`);
    next(createError(500, 'Could not fetch competitors', error.message));
  }
};

/**
 * @swagger
 * /competitors/get-by-id/{id}:
 *   get:
 *     summary: Get a competitor by ID
 *     tags: [Competitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Competitor details
 */
exports.getCompetitorById = async (req, res, next) => {
  try {
    const competitor = await Competitor.findOne({
      where: { idCompetitor: req.params.id, is_archived: false },
      include: [Business]
    });

    if (!competitor) return next(createError(404, 'Competitor not found'));

    res.status(200).json(competitor);
  } catch (error) {
    logger.error(`Fetch competitor error: ${error.message}`);
    next(createError(500, 'Could not fetch competitor', error.message));
  }
};

/**
 * @swagger
 * /competitors/update/{id}:
 *   put:
 *     summary: Update a competitor
 *     tags: [Competitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the competitor to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TechNova"
 *               sector:
 *                 type: string
 *                 example: "Cloud Services"
 *               headquater_location:
 *                 type: string
 *                 example: "San Francisco, USA"
 *               reference_clients:
 *                 type: string
 *                 example: "Acme Corp, GlobalTel"
 *               product_line:
 *                 type: string
 *                 example: "Backup solutions, cloud storage"
 *               website:
 *                 type: string
 *                 nullable: true
 *                 example: "https://www.technova.com"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Leading in government contracts"
 *     responses:
 *       200:
 *         description: Competitor updated successfully
 *       404:
 *         description: Competitor not found or already archived
 */
exports.updateCompetitor = async (req, res, next) => {
  try {
     // Perform update
    const [updatedRows] = await Competitor.update(
      {
        name: req.body.name,
        sector: req.body.sector,
        headquater_location: req.body.headquater_location,
        reference_clients: req.body.reference_clients,
        product_line: req.body.product_line,
        website: req.body.website,
        notes: req.body.notes
      },
      {
        where: {
          idCompetitor: req.params.id,
          is_archived: false
        }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Competitor not found or already archived' });
    }

    res.status(200).json({ message: 'Competitor updated successfully' });
  } catch (error) {
    logger.error(`Update competitor error: ${error.message}`);
    next(createError(500, 'Could not update competitor', error.message));
  }
};

/**
 * @swagger
 * /competitors/delete/{id}:
 *   delete:
 *     summary: Archive a competitor
 *     tags: [Competitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Competitor archived
 */
exports.archiveCompetitor = async (req, res, next) => {
  try {
    await Competitor.update({ is_archived: true }, {
      where: { idCompetitor: req.params.id }
    });

    res.status(200).json({ message: 'Competitor archived successfully' });
  } catch (error) {
    logger.error(`Archive competitor error: ${error.message}`);
    next(createError(500, 'Could not archive competitor', error.message));
  }
};


/**
 * @swagger
 * /competitors/businesses/{businessId}:
 *   get:
 *     summary: Get paginated competitors linked to a business
 *     tags: [Competitors]
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
 *         description: Paginated list of competitors
 */
exports.getCompetitorsByBusinessId = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { limit, offset } = require('./utils/paginate').paginate(req);

    const links = await CompetitorHasBusiness.findAndCountAll({
      where: { Business_idBusiness: businessId, is_archived: false },
      limit,
      offset,
      include: [Competitor]
    });

    res.status(200).json({
      count: links.count,
      rows: links.rows.map(link => link.Competitor)
    });
  } catch (error) {
    next(createError(500, 'Error fetching competitors by business', error.message));
  }
};
