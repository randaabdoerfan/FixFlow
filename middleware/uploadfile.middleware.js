const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudStoage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'graduationProject' }
})

const upload = multer({ storage: cloudStoage })
module.exports = {upload}