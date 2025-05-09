const {Order} = require('../model');
const {Plan} = require('../model');
const {Gateway} = require('../model');
const {User} = require('../model');
const { Op } = require('sequelize');
const createError = require('../middleware/error');

// Generate unique invoice number
const generateInvoice = () => 'INV-' + Math.floor(100000 + Math.random() * 900000);

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
  