const {Plan} = require('../model');
const createError = require('../middleware/error'); // Assuming you have a custom error creator

// Create a new subscription plan (admin only)
/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 description: Name of the plan
 *               labelcolor:
 *                 type: string
 *                 description: Label color for UI badge (e.g. '#FF0000')
 *               iconname:
 *                 type: string
 *                 description: Name of the icon for UI
 *               price:
 *                 type: number
 *                 description: Price of the plan
 *               is_featured:
 *                 type: integer
 *               is_recommended:
 *                 type: integer
 *               is_trial:
 *                 type: integer
 *               days:
 *                 type: integer
 *                 description: Validity period in days
 *               trial_days:
 *                 type: integer
 *               data:
 *                 type: string
 *                 description: JSON string containing feature limits and access (e.g. '{"leads_limit":"200"}')
 *     responses:
 *       201:
 *         description: Product archived successfully
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Plan'
 */
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
/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update a specific subscription plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               labelcolor:
 *                 type: string
 *               iconname:
 *                 type: string
 *               price:
 *                 type: number
 *               is_featured:
 *                 type: integer
 *               is_recommended:
 *                 type: integer
 *               is_trial:
 *                 type: integer
 *               days:
 *                 type: integer
 *               trial_days:
 *                 type: integer
 *               data:
 *                 type: string
 *                 description: JSON string containing feature limits and flags
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Failed to update plan
 */
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
/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Soft delete a specific subscription plan (sets status to 0)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the plan to soft delete
 *     responses:
 *       200:
 *         description: Plan deleted (soft) successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Failed to delete plan
 */
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
