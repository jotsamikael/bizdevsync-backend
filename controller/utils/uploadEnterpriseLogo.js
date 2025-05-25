const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('uplo')
      console.log(req.body)

    const domain = req.body.email_domain;

    if (!domain) {
      return cb(new Error('Enterprise email domain is required to determine storage path'));
    }

    const safeDomain = domain.replace(/[^a-zA-Z0-9]/g, '_'); // sanitize folder name
    const folder = path.join(__dirname, '..', '..', 'storage', 'enterprise', safeDomain);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, `logo_${uniqueSuffix}${ext}`);
  }
});

const uploadEnterpriseLogo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const isValid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    isValid ? cb(null, true) : cb(new Error('Only image files are allowed'));
  }
});

module.exports = uploadEnterpriseLogo;
