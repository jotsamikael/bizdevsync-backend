const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jotsamikael@gmail.com',
    pass: 'bmutcptpxacspogj' // App password (not your real Gmail password)
  }
});

/**
 * Sends an activation email with a 4-digit code
 * @param {string} name - User's first name
 * @param {string} userEmail - User's email
 * @param {string} subject - Email subject
 * @param {string} code - Activation code
 */
const sendEmail = (name, userEmail, subject, code) => {
 
  const mailOptions = {
    from: '"BizdevSync" <jotsamikael@gmail.com>',
    to: userEmail,
    subject: subject,
    text: `Hello ${name},\n\nYour account activation code is: ${code}\n\nThis code will expire in 15 minutes.\n\nBest regards,\nBizdevSync Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error);
    } else {
      console.log('✅ Email sent: ' + info.response);
    }
  });
};

module.exports = { sendEmail };
