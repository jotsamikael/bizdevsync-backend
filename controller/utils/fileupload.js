const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email;
    const name = req.body.name;

    if (!email && !name) return cb(new Error('Email or Name is required to determine storage path'));

    if(!name){
      const safeEmail = email.replace(/[@.]/g, "_");
      const folder = path.join(__dirname, '..', '..', 'storage', 'users', safeEmail);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  
    }
    if(!email){
      const safeName = name.replace(/[@.\s]/g, "_");

      const folder = path.join(__dirname, '..', '..', 'storage', 'users', safeName);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

      cb(null, folder);
    }
  
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, `avatar_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const isValid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    isValid ? cb(null, true) : cb(new Error('Only image files are allowed'));
  }
});

module.exports = upload;
