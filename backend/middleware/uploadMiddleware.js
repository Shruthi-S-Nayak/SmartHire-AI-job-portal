const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store files directly on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "smarthire-resumes",
    allowed_formats: ["pdf"],
    resource_type:  "raw", // needed for PDF files
    public_id: (req, file) => `resume-${req.user._id}-${Date.now()}`,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files allowed"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
