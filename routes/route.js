// routes/shopRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createShop,
  getAllShops,
  getSingleShop,
  updateShop,
  deleteShop,
  getShopsForDropdown,
  totalShops,
} = require("../modules/shop/controllers");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsByShop,
  totalproducts,
} = require("../modules/products/controllers");

const {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../modules/auth/controllers");

router.post("/createshop", createShop);
router.get("/allshops", getAllShops);
router.get("/singleshop/:id", getSingleShop);
router.put("/updateshop/:id", updateShop);
router.delete("/deleteshop/:id", deleteShop);
router.get("/shops-dropdown", getShopsForDropdown);
router.get("/total-shops", totalShops);

router.post("/createproduct", createProduct);
router.get("/allproducts", getAllProducts);
router.get("/singleproduct/:id", getSingleProduct);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.get("/products-by-shop/:shop_id", getProductsByShop);
router.get("/total-products", totalproducts);

// auth controllers
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authMiddleware, getUsers);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);

module.exports = router;