// Config File for multer
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Pando",
    allowedFormats: ["jpg", "png", "mp4"],
    resource_type: "auto", // Allows both images & videos
  },
});

const upload = multer({ storage });

module.exports = upload;
