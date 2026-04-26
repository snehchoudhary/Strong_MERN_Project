const multer = require("multer");

/* ===========================
   STORAGE (Memory)
=========================== */

const storage =
  multer.memoryStorage();

/* ===========================
   MULTER INSTANCE
=========================== */

const upload =
  multer({ storage });

/* ===========================
   EXPORT
=========================== */

module.exports = upload;