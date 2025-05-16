const { CompetitorHasBusiness, Competitor, Business } = require('../model');
const createError = require('../middleware/error');

/**
 * @swagger
 * /competitors/{id}/link-business:
 *   post:
 *     summary: Link a competitor to a business with attributes
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompetitorHasBusiness'
 *     responses:
 *       201:
 *         description: Competitor linked to Business
 */
exports.linkCompetitorToBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Business_idBusiness, strengths, weaknesses, risk_level } = req.body;

    const link = await CompetitorHasBusiness.create({
      Competitor_idCompetitor: id,
      Business_idBusiness,
      strengths,
      weaknesses,
      risk_level
    });

    res.status(201).json({ message: 'Competitor linked to Business', data: link });
  } catch (error) {
    next(createError(500, 'Error linking Competitor to Business', error.message));
  }
};

/**
 * @swagger
 * /competitors/{id}/link-business/{businessId}:
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
 *             $ref: '#/components/schemas/CompetitorHasBusiness'
 *     responses:
 *       200:
 *         description: Link updated successfully
 */
exports.updateCompetitorBusinessLink = async (req, res, next) => {
  try {
    const { id, businessId } = req.params;

    const updated = await CompetitorHasBusiness.update(req.body, {
      where: {
        Competitor_idCompetitor: id,
        Business_idBusiness: businessId,
        is_archived: false
      }
    });

    res.status(200).json({ message: 'Link updated successfully', data: updated });
  } catch (error) {
    next(createError(500, 'Error updating link', error.message));
  }
};

/**
 * @swagger
 * /competitors/{id}/unlink-business/{businessId}:
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
 * /competitors/{id}/businesses:
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
