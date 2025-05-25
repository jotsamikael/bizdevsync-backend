const { CompetitorHasBusiness, Competitor, Business } = require('../model');
const createError = require('../middleware/error');

/**
 * @swagger
 * /business-has-competitors/competitor-business/create:
 *   post:
 *     summary: Link a competitor to a business with additional insights
 *     tags: [CompetitorHasBusiness]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               market_position:
 *                 type: string
 *                 example: "Market Leader in SME Segment"
 *               weaknesses:
 *                 type: string
 *                 example: "Limited support in French-speaking regions"
 *               strengths:
 *                 type: string
 *                 example: "Excellent integration with existing CRMs"
 *               reference_clients:
 *                 type: string
 *                 example: "Orange, Canal+, TechSavvy Inc."
 *               risk_level:
 *                 type: string
 *                 example: "High"
 *               Competitor_idCompetitor:
 *                 type: integer
 *                 example: 3
 *               Business_idBusiness:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       201:
 *         description: Link created successfully
 */
exports.linkCompetitorToBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Business_idBusiness, strengths,market_position, weaknesses, risk_level } = req.body;

    const link = await CompetitorHasBusiness.create({
      market_position: req.body.market_position,
      weaknesses: req.body.weaknesses,
      strengths: req.body.strengths,
      reference_clients: req.body.reference_clients,
      risk_level: req.body.risk_level,
      Competitor_idCompetitor: req.body.Competitor_idCompetitor,
      Business_idBusiness: req.body.Business_idBusiness
    });

    res.status(201).json({ message: 'Competitor linked to Business', data: link });
  } catch (error) {
    next(createError(500, 'Error linking Competitor to Business', error.message));
  }
};

/**
 * @swagger
 * /business-has-competitors/link-business/{businessId}/{id}:
 *   put:
 *     summary: Update the link between a competitor and a business
 *     tags: [CompetitorHasBusiness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Competitor ID
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               market_position:
 *                 type: string
 *                 example: "Top 3 in the African logistics sector"
 *               weaknesses:
 *                 type: string
 *                 example: "Limited technical support"
 *               strengths:
 *                 type: string
 *                 example: "Affordable pricing, large regional presence"
 *               reference_clients:
 *                 type: string
 *                 example: "Transcom, QuickMove"
 *               risk_level:
 *                 type: string
 *                 example: "Medium"
 *     responses:
 *       200:
 *         description: Link updated successfully
 *       404:
 *         description: Link not found or archived
 */
exports.updateCompetitorBusinessLink = async (req, res, next) => {
  try {
    const { id, businessId } = req.params;

    // Attempt update
    const [updated] = await CompetitorHasBusiness.update(
      {
        market_position: req.body.market_position,
        weaknesses: req.body.weaknesses,
        strengths: req.body.strengths,
        reference_clients: req.body.reference_clients,
        risk_level: req.body.risk_level
      },
      {
        where: {
          Competitor_idCompetitor: id,
          Business_idBusiness: businessId,
          is_archived: false
        }
      }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'Link not found or already archived' });
    }

    res.status(200).json({ message: 'Link updated successfully', data: updated });
  } catch (error) {
    next(createError(500, 'Error updating link', error.message));
  }
};

/**
 * @swagger
 * /business-has-competitors/unlink-business/{businessId}/{id}:
 *   delete:
 *     summary: Unlink a competitor from a business (soft delete)
 *     tags: [CompetitorHasBusiness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Competitor ID
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Link removed successfully
 */
exports.unlinkCompetitorFromBusiness = async (req, res, next) => {
  try {
    const { id, businessId } = req.params;

    await CompetitorHasBusiness.update({ is_archived: true }, {
      where: {
        Competitor_idCompetitor: id,
        Business_idBusiness: businessId
      }
    });

    res.status(200).json({ message: 'Link removed successfully' });
  } catch (error) {
    next(createError(500, 'Error unlinking Competitor from Business', error.message));
  }
};

/**
 * @swagger
 * /business-has-competitors/businesses/{id}:
 *   get:
 *     summary: Get all businesses linked to a competitor
 *     tags: [CompetitorHasBusiness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Competitor ID
 *     responses:
 *       200:
 *         description: List of linked businesses
 */
exports.getCompetitorBusinesses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const links = await CompetitorHasBusiness.findAll({
      where: {
        Competitor_idCompetitor: id,
        is_archived: false
      },
      include: [Business]
    });

    res.status(200).json(links);
  } catch (error) {
    next(createError(500, 'Error fetching linked businesses', error.message));
  }
};
