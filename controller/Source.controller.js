const { User } = require("../model");
const { Source } = require("../model");
const ENV = require("../config");
const createError = require("../middleware/error");
const logger = require("./utils/logger.utils");
const paginate = require("./utils/paginate");

/**
 * @swagger
 * /sources/create:
 *   post:
 *     summary: Create a new source
 *     tags: [Sources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label: { type: string }
 *               descrption: { type: string }             
 *     responses:
 *       201:
 *         description: Source created successfully
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Source'
 */
exports.createSource = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const source = await Source.create({
      label: req.body.label,
      description: req.body.description,
      _idUser: userId,
    });

    res.status(201).json({ message: "Source created successfully", data: source });
    logger.info(`Source created: ${source.label}`);
  } catch (error) {
    logger.error(`Source creation error: ${error.message}`);
    next(createError(500, "Could not create source", error.message));
  }
};
