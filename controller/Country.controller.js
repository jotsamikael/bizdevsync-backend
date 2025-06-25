const {Country,Region} = require('../model')

const createError = require('http-errors');
const logger = require('./utils/logger.utils');
const { paginate } = require('./utils/paginate');

/**
 * @swagger
 * /countries/create:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               short_name:
 *                 type: string
 *               long_name:
 *                 type: string
 *               iso2:
 *                 type: string
 *               iso3:
 *                 type: string
 *               calling_code:
 *                 type: string
 *               is_un_member:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Country created
 */
exports.createCountry = async (req, res, next) => {
  try {
    const {
      short_name,
      long_name,
      iso2,
      iso3,
      calling_code,
      is_un_member,
    } = req.body;

    const country = await Country.create({
      short_name,
      long_name,
      iso2,
      iso3,
      calling_code,
      is_un_member,
      is_archived: false,
    });

    res.status(201).json({
      message: 'Country created successfully',
      data: country,
    });
  } catch (error) {
    logger.error(`Country creation error: ${error.message}`);
    next(createError(500, 'Error creating country', error.message));
  }
};

/**
 * @swagger
 * /countries/get-all:
 *   get:
 *     summary: Get all countries (paginated)
 *     tags: [Countries]
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
 *         description: List of countries
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
 *                     $ref: '#/components/schemas/Country'
 */
exports.getAllCountries = async (req, res, next) => {
  try {
    const limit = 200; const offset = 0 

    const countries = await Country.findAndCountAll({
      where: { is_archived: false },
      limit,
      offset,
    });

    res.status(200).json(countries);
  } catch (error) {
    logger.error(`Fetch countries error: ${error.message}`);
    next(createError(500, 'Error fetching countries', error.message));
  }
};

/**
 * @swagger
 * /countries/get-by-id/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Countries]
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
 *         description: Country details
 *         content:
 *            application/json:
 *               schema:
 *                $ref: '#/components/schemas/Country'
 */
exports.getCountryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findOne({
      where: { idCountry: id, is_archived: false },
      include: [
        {
          model: Region,
        }
      ]    });

    if (!country) {
      return next(createError(404, 'Country not found'));
    }

    res.status(200).json(country);
  } catch (error) {
    logger.error(`Fetch country error: ${error.message}`);
    next(createError(500, 'Error fetching country', error.message));
  }
};

/**
 * @swagger
 * /countries/update/{id}:
 *   patch:
 *     summary: Update a country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               short_name:
 *                 type: string
 *               long_name:
 *                 type: string
 *               iso2:
 *                 type: string
 *               iso3:
 *                 type: string
 *               calling_code:
 *                 type: string
 *               is_un_member:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Country updated
 */
exports.updateCountry = async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findByPk(id);

    if (!country) {
      return next(createError(404, 'Country not found'));
    }

    const updatedData = {
      short_name: req.body.short_name ?? country.short_name,
      long_name: req.body.long_name ?? country.long_name,
      iso2: req.body.iso2 ?? country.iso2,
      iso3: req.body.iso3 ?? country.iso3,
      calling_code: req.body.calling_code ?? country.calling_code,
      is_un_member: req.body.is_un_member ?? country.is_un_member,
    };

    await country.update(updatedData);

    res.status(200).json({
      message: 'Country updated successfully',
      data: country,
    });
  } catch (error) {
    logger.error(`Update country error: ${error.message}`);
    next(createError(500, 'Error updating country', error.message));
  }
};

/**
 * @swagger
 * /countries/delete/{id}:
 *   delete:
 *     summary: Archive a country (soft delete)
 *     tags: [Countries]
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
 *         description: Country archived
 */
exports.archiveCountry = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Country.update({ is_archived: true }, {
      where: { idCountry: id },
    });

    res.status(200).json({ message: 'Country archived successfully' });
  } catch (error) {
    logger.error(`Archive country error: ${error.message}`);
    next(createError(500, 'Error archiving country', error.message));
  }
};