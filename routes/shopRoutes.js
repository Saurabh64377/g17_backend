// routes/shopRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createShop,
  getAllShops,
  getSingleShop,
  updateShop,
  deleteShop
} = require("../controllers/shopControllers");


// CREATE
router.post(
  "/create",
  upload.single("icon"),
  createShop
);


// GET ALL
router.get(
  "/all",
  getAllShops
);


// GET SINGLE
router.get(
  "/single/:id",
  getSingleShop
);


// UPDATE
router.put(
  "/update/:id",
  upload.single("icon"),
  updateShop
);


// DELETE
router.delete(
  "/delete/:id",
  deleteShop
);

module.exports = router;