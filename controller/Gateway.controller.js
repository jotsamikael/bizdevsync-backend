const {Gateway} = require('../model');
const createError = require('../middleware/error'); // Assuming you have a custom error creator

// Create a new payment gateway (Admin only)
exports.createGateway = async (req, res, next) => {
    try {
      const gateway = await Gateway.create(req.body);
      res.status(201).json({ message: 'Gateway created successfully', data: gateway });
    } catch (error) {
      next(createError(500, 'Failed to create gateway', error.message));
    }
  };
  
  // Get all active gateways (visible to users)
  exports.getActiveGateways = async (req, res, next) => {
    try {
      const gateways = await Gateway.findAll({ where: { status: 1 } });
      res.status(200).json(gateways);
    } catch (error) {
      next(createError(500, 'Failed to retrieve gateways', error.message));
    }
  };
  
  // Admin: get all gateways regardless of status
  /**
 * @swagger
 * /gateways:
 *   get:
 *     summary: Get all payment gateways (admin only)
 *     description: Retrieve all configured payment gateways regardless of their status.
 *     tags: [Gateways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all gateways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   currency:
 *                     type: string
 *                   status:
 *                     type: integer
 *                     description: 1 = active, 0 = inactive
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (not allowed role)
 */
  exports.getAllGateways = async (req, res, next) => {
    try {
      const gateways = await Gateway.findAll();
      res.status(200).json(gateways);
    } catch (error) {
      next(createError(500, 'Failed to retrieve gateways', error.message));
    }
  };
  
  // Update a specific gateway
  exports.updateGateway = async (req, res, next) => {
    const { id } = req.params;
    try {
      const gateway = await Gateway.findByPk(id);
      if (!gateway) return next(createError(404, 'Gateway not found'));
  
      await gateway.update(req.body);
      res.status(200).json({ message: 'Gateway updated successfully', data: gateway });
    } catch (error) {
      next(createError(500, 'Failed to update gateway', error.message));
    }
  };
  
  // Soft delete a gateway (status = 0)
  exports.deleteGateway = async (req, res, next) => {
    const { id } = req.params;
    try {
      const gateway = await Gateway.findByPk(id);
      if (!gateway) return next(createError(404, 'Gateway not found'));
  
      await gateway.update({ status: 0 });
      res.status(200).json({ message: 'Gateway deleted (soft) successfully' });
    } catch (error) {
      next(createError(500, 'Failed to delete gateway', error.message));
    }
  };