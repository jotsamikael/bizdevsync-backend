const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../model");
const {Activation} = require('../model');

const ENV = require("../config");
const createError = require("../middleware/error");
const { where } = require("sequelize");
const mailService = require('./utils/mail')
const { generateActivationCode } = require('./utils/activationCodeGenerator');
const generatePasswordService = require('./utils/generatePassword')
const {PasswordReset} = require('../model')
const logger = require("./utils/logger.utils");


/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user (solo biz dev by default)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 */
exports.signup = async (req, res, next) => {
  logger.info("Signup initiated");
  try {

    //encrypt the password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const safeEmail = req.body.email.replace(/[@.]/g, "_");

    const avatarPath = req.file
      ? `/storage/users/${safeEmail}/${req.file.filename}`
      : '/img/placeholder.png';
    //create user
    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      avatar: avatarPath,
      password: encryptedPassword,
      enterprise_id: req.body.enterprise_id,
      is_activated: false,
      is_verified: false,
      role: "solo_biz_dev",
    });

    //create activation code
    const activationCode = generateActivationCode();
    const expiresAt = new Date(Date.now() + 45 * 60 * 1000); // 45 min expiry
    console.log(Activation)

    await Activation.create({
      code: activationCode,
      user_id: user.id,
      expires_at: expiresAt
    });

    mailService.sendEmail(req.body.first_name, req.body.email, "Account activation", activationCode)
    logger.info(`New user: ${req.body.email}`);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error(`Signup error: ${err.message}`);
    next(createError(500, "Error occured during signup", error.message));
  }
};

/** ACTIVATE ACCOUNT */
/**
 * @swagger
 * /user/activate-account:
 *   post:
 *     summary: Activate user account with code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 */
exports.activateAccount = async (req, res, next) => {
    const { email, code } = req.body;
      logger.info(`Activate account initiated for user with email ${email}`);

  
    try {
        //get user by email
      const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
      if (!user) {
        logger.error(`Activate account Failed. No for user with email ${email} Found`);

        return next(createError(404, "User not found"));
      }
        
      //get activation code by userId
      const activation = await Activation.findOne({
        where: {
          user_id: user.id,
          code,
          validated_at: null
        }
      });
  
      if (!activation){
      logger.error(`Activate account Failed for user with email ${email}. Invalid or expired code `);

       return next(createError(400, "Invalid or expired code"));
      }
  
      if (new Date() > activation.expires_at) {
        logger.error(`Activate account Failed for user with email ${email}. Activation code has expired`);

        return next(createError(400, "Activation code has expired"));
      }
  
      // Activate user
      await user.update({ is_activated: true });
      await activation.update({ validated_at: new Date() });
      logger.error(`Activate account Failed for user with email ${email} successfull`);

      res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
      logger.error(`Activate account Failed for user with email ${email}. Unexpected error occured`);

      next(error);
    }
  };
  
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login and token generation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 */
exports.signin = async (req, res, next) => {
      logger.info(`Login start for user with email ${req.body.email}`);
  try {
    //get user by email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user){
      logger.error(`Login Failed. No for user with email ${req.body.email} Found`);
      return next(createError(404, "User doesn't exist"));

    } 
    if(user.is_activated == false){
      logger.error(`Login Failed for user with email ${req.body.emai} User Account not activated`);

      return next(createError(404, "User Account not activated"));
    } 


    //verify password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword){
      logger.error(`Login Failed for user with email ${req.body.emai}. Wrong password`);

      return next(createError(400, "Wrong password"));
    } 

    //generate auth token
    const token = jwt.sign({ id: user.id, role:user.role, email:user.email, will_expire: user.will_expire
    }, ENV.TOKEN, { expiresIn: "24h" });

    //send user dto excluding password
    const { password, ...userData } = user.dataValues;
    //console.log({ password, ...userData });

    //create a cookie, token will be send through cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, //is true for https
        sameSite: "strict", //protect against CSRF attackes
        maxAge: 24 * 60 * 60 * 1000, //24h on milliseconds
      })
      .status(200)
      .json(userData);
      logger.info(`Login success for user with email ${req.body.email}`);

  } catch (error) {
      logger.error(`Login Failed for user with email ${email}. Unexpected error during signin`);

    next(createError(500, "Error occured during signin", error.message));
  }
};

/** GET ALL SOLOBIZDEVS */
/**
 * @swagger
 * /user/get-solo-bizdevs:
 *   post:
 *     summary: Get all solo business developers
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of solo biz devs
 */
exports.getSoloBizDevs = async (req, res, next) => {
  const { limit, offset } = require("./utils/paginate").paginate(req);

  try {
    const users = await User.findAndCountAll({
      where: { role: "solo_biz_dev" },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: users.count,
      page: Math.ceil(offset / limit) + 1,
      per_page: limit,
      data: users.rows,
    });
  } catch (err) {
    next(createError(500, "Error retrieving solo business developers"));
  }
};

/** GET ALL USERS OF ENTERPRISE */
/**
 * @swagger
 * /user/enterprise/{enterprise_id}:
 *   post:
 *     summary: Get all users of an enterprise
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: enterprise_id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Paginated list of users
 */
exports.getUsersByEnterprise = async (req, res, next) => {
  const { limit, offset } = require("./utils/paginate").paginate(req);
  const { enterprise_id } = req.params;

  try {
    const users = await User.findAndCountAll({
      where: { enterprise_id },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: users.count,
      page: Math.ceil(offset / limit) + 1,
      per_page: limit,
      data: users.rows,
    });
  } catch (err) {
    next(createError(500, "Error retrieving users for enterprise"));
  }
};

/**GET USER BY EMAIL ***********/
/**
 * @swagger
 * /user/get-user-by-email:
 *   get:
 *     summary: Get user details by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
exports.getUserByEmail = async (req, res, next) => {
    const email = req.query.email.trim().toLowerCase()
    console.log(email)

    try {
        const user = await User.findOne({ where: { email: email } });
        console.log(user.first_name)

    if (!user)
      return next(createError(404, `User with email ${email} doesn't exist`));
    //send user dto excluding password
    const { password, ...userData } = user.dataValues;
    res.status(200).json({userData})
  } catch (error) {
    next(createError(500, `Error finding user with email ${email}`));
  }
};

/** GET ALL SAAS STAFF */
/**
 * @swagger
 * /user/saas-staff:
 *   post:
 *     summary: Get all admin/operator/superadmin users
 *     tags: [Users]
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
 *         description: Paginated list of SaaS staff
 */
exports.getSaasAtaff = async (req, res, next) => {
  const { limit, offset } = require("./utils/paginate").paginate(req);

  try {
    const users = await User.findAndCountAll({
      where: {
        role: ["admin", "operator", "super_admin"], // Sequelize auto-maps this to IN()
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: users.count,
      page: Math.ceil(offset / limit) + 1,
      per_page: limit,
      data: users.rows,
    });
  } catch (err) {
    next(createError(500, "Error retrieving admin/operator/superadmin users"));
  }
};


/**PASSWORD RESET */
/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset password and send new password to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: New password sent to email
 */
exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return  next(createError(404, `User with email ${email} doesn't exist`));

    const newPassword = generatePasswordService.generateSecurePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await user.update({ password: hashedPassword });

    // Log in password_resets table
    await PasswordReset.create({
      email,
      new_password: hashedPassword,
    });

    // Send new password via email
   mailService.sendEmail('BizdevSync',email,'Your New Password for BizdevSync',`Hello,\n\nYour new password is: ${newPassword}\n\nPlease log in and change it immediately.\n\nBest,\nThe BizdevSync Team`)

    res.status(200).json({ message: 'New password sent to your email.' });
  } catch (err) {
    console.error(err);
    next(createError(500, "Error resetting password"));
  }
};



/**
 * @swagger
 * /user/staff-update/{id}:
 *   put:
 *     summary: Staff update a user's information
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: boolean
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
exports.staffUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

   // Prepare updated data object starting with current values
    const updateData = {
      first_name: req.body.first_name ?? user.first_name,
      last_name: req.body.last_name ?? user.last_name,
      email: req.body.email ?? user.email,
      status: req.body.status ?? user.status,
      avatar: user.avatar, // will be conditionally updated below
    };

    // Handle avatar upload if exists
    if (req.file) {
      const safeEmail = (req.body.email || user.email).replace(/[@.]/g, "_");
      updateData.avatar = `/storage/users/${safeEmail}/${req.file.filename}`;
    }

    await user.update(updateData);

    logger.info(`User updated: ${user.email}`);
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    next(createError(500, "Failed to update user", error.message));
  }
};




exports.updateProfile = async (req, res, next) => {
  try {
    const userEmail = req.user.email; // now using email from token/session
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
        logger.info(`No User found with email: ${userEmail}`);
      return next(createError(404, "User not found"));
    }

   // Prepare updated data object starting with current values
    const updateData = {
      first_name: req.body.first_name ?? user.first_name,
      last_name: req.body.last_name ?? user.last_name,
      email: req.body.email ?? user.email,
      status: req.body.status ?? user.status,
      avatar: user.avatar, // will be conditionally updated below
    };

    // Handle avatar upload if exists
    if (req.file) {
      const safeEmail = (req.body.email || user.email).replace(/[@.]/g, "_");
      updateData.avatar = `/storage/users/${safeEmail}/${req.file.filename}`;
    }

    await user.update(updateData);

    logger.info(`User updated: ${user.email}`);
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    next(createError(500, "Failed to update user", error.message));
  }
};


/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Change currently logged in user's password (requires old password confirmation)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *               - confirm_password
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error or wrong old password
 *       500:
 *         description: Failed to update password
 */
exports.updatePassword = async (req, res, next) => {
 try {
    const { old_password, new_password, confirm_password } = req.body;
    const userEmail = req.user.email; // now using email from token/session

    if (!old_password || !new_password || !confirm_password) {
      return next(createError(400, "All password fields are required."));
    }

    if (new_password !== confirm_password) {
      return next(createError(400, "New password and confirmation do not match."));
    }

    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return next(createError(400, "Old password is incorrect."));
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ password: hashedPassword });

    logger.info(`Password updated for user: ${user.email}`);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    next(createError(500, "Failed to update password", error.message));
  }
};
