// middleware/upload.js

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }

});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.mimetype)) {

    return cb(
      new Error("Only image files allowed"),
      false
    );

  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;