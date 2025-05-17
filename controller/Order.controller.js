const {Order} = require('../model');
const {Plan} = require('../model');
const {Gateway} = require('../model');
const {User} = require('../model');
const { Op } = require('sequelize');
const createError = require('../middleware/error');

// Generate unique invoice number
const generateInvoice = () => 'INV-' + Math.floor(100000 + Math.random() * 900000);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a subscription order for a plan using a payment gateway
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *               - gateway_id
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 description: ID of the selected subscription plan
 *               gateway_id:
 *                 type: integer
 *                 description: ID of the selected payment gateway
 *     responses:
 *       201:
 *         description: Order created successfully, with payment instructions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 gateway_instructions:
 *                   type: object
 *       404:
 *         description: Plan or gateway not found or inactive
 *       500:
 *         description: Error creating subscription order
 */
exports.createOrder = async (req, res, next) => {
  const { plan_id, gateway_id } = req.body;
  const user_id = req.user.id; // assuming user is authenticated

  try {
    // Fetch plan & gateway
    const plan = await Plan.findByPk(plan_id);
    const gateway = await Gateway.findByPk(gateway_id);

    if (!plan || plan.status !== 1) {
      return next(createError(404, 'Selected plan not found or inactive'));
    }

    if (!gateway || gateway.status !== 1) {
      return next(createError(404, 'Selected payment gateway not available'));
    }

    const totalAmount = plan.price + (gateway.charge || 0);
    const willExpire = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000);

    const order = await Order.create({
      invoice_no: generateInvoice(),
      payment_id: null,
      user_id,
      plan_id,
      gateway_id,
      amount: totalAmount,
      tax: 0,
      status: 0, // 0 = pending
      will_expire: willExpire,
      meta: '{}',
    });

    // Return order and payment instructions
    res.status(201).json({
      message: 'Order created. Proceed with payment.',
      order,
      gateway_instructions: gateway.data ? JSON.parse(gateway.data) : null
    });

  } catch (error) {
    next(createError(500, 'Error creating subscription order', error.message));
  }
};

/**
 * @swagger
 * /orders/confirm:
 *   post:
 *     summary: Confirm an order manually and activate the subscription
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID of the order to confirm
 *     responses:
 *       200:
 *         description: Subscription activated successfully
 *       404:
 *         description: Order not found or already processed
 *       500:
 *         description: Error confirming order
 */
exports.confirmOrder = async (req, res, next) => {
    const { order_id } = req.body;
    try {
      const order = await Order.findByPk(order_id);
      if (!order || order.status !== 0) {
        return next(createError(404, 'Order not found or already processed'));
      }
  
      // Update order status
      await order.update({
        status: 1,
        payment_id: 'MANUAL-' + Date.now(),
      });
  
      // Update user subscription
      const user = await User.findByPk(order.user_id);
      await user.update({
        plan_id: order.plan_id,
        will_expire: order.will_expire
      });
  
      res.status(200).json({ message: 'Subscription activated successfully' });
    } catch (error) {
      next(createError(500, 'Error confirming order', error.message));
    }
  };
  