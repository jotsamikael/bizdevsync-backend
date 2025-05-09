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


exports.signup = async (req, res, next) => {
  try {
    console.log("req.file:", req.file);           // 👈 Check if file is present
    console.log("req.body:", req.body);
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
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Signup error:', error); // ✅ This shows full error stack

    next(createError(500, "Error occured during signup", error.message));
  }
};

/** ACTIVATE ACCOUNT */
exports.activateAccount = async (req, res, next) => {
    const { email, code } = req.body;
  
    try {
        //get user by email
      const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
      if (!user) return next(createError(404, "User not found"));
  
      //get activation code by userId
      const activation = await Activation.findOne({
        where: {
          user_id: user.id,
          code,
          validated_at: null
        }
      });
  
      if (!activation) return next(createError(400, "Invalid or expired code"));
  
      if (new Date() > activation.expires_at) {
        return next(createError(400, "Activation code has expired"));
      }
  
      // Activate user
      await user.update({ is_activated: true });
      await activation.update({ validated_at: new Date() });
  
      res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
      next(error);
    }
  };
  

exports.signin = async (req, res, next) => {
  console.log(req.body.email);
  try {
    //get user by email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return next(createError(404, "User doesn't exist"));
    if (user.is_activated == false) return next(createError(404, "User Account not activated"));


    //verify password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) return next(createError(400, "Wrong password"));

    //generate auth token
    const token = jwt.sign({ id: user.id, role:user.role, email:user.email, will_expire: user.will_expire
    }, ENV.TOKEN, { expiresIn: "24h" });

    //send user dto excluding password
    const { password, ...userData } = user.dataValues;
    console.log({ password, ...userData });

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
  } catch (error) {
    next(createError(500, "Error occured during signin", error.message));
  }
};

/** GET ALL SOLOBIZDEVS */

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

exports.getUsersByEnterprise = async (req, res, next) => {
  const { limit, offset } = require("../utils/pagination").paginate(req);
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
exports.getSaasAtaff = async (req, res, next) => {
  const { limit, offset } = require("../utils/pagination").paginate(req);

  try {
    const users = await User.findAndCountAll({
      where: {
        role: ["admin", "operator", "superadmin"], // Sequelize auto-maps this to IN()
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

