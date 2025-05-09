const {Plan} = require('../model');
const createError = require('../middleware/error'); // Assuming you have a custom error creator

// Create a new subscription plan (admin only)
exports.createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ message: 'Plan created successfully', data: plan });
  } catch (error) {
    next(createError(500, 'Failed to create plan', error.message));
  }
};


/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all active plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of plans
 */
exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await Plan.findAll({ where: { status: 1 } }); // only active plans
    res.status(200).json(plans);
  } catch (error) {
    next(createError(500, 'Failed to retrieve plans', error.message));
  }
};

// Update a specific plan
exports.updatePlan = async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) return next(createError(404, 'Plan not found'));

    await plan.update(req.body);
    res.status(200).json({ message: 'Plan updated successfully', data: plan });
  } catch (error) {
    next(createError(500, 'Failed to update plan', error.message));
  }
};

// Soft delete a plan (status = 0)
exports.deletePlan = async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) return next(createError(404, 'Plan not found'));

    await plan.update({ status: 0 }); // soft delete
    res.status(200).json({ message: 'Plan deleted (soft) successfully' });
  } catch (error) {
    next(createError(500, 'Failed to delete plan', error.message));
  }
};
