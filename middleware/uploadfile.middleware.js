const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const cloudStoage = new CloudinaryStorage({
    cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);

    return {
      folder: 'graduationProject',
      resource_type: 'auto',
      public_id: `${Date.now()}${ext}`
    };
  }
})

const upload = multer({ storage: cloudStoage })
module.exports = {upload}