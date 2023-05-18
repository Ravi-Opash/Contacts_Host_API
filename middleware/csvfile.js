"use strict";
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const folderName = path.join(__dirname, "../images");
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single("image");

module.exports = { upload };

