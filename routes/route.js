// routes/shopRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
    createShop,
    getAllShops,
    getSingleShop,
    updateShop,
    deleteShop
} = require("../modules/shop/controllers");

const {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser
} = require("../modules/auth/controllers");


router.post("/createshop",createShop);
router.get("/allshops",getAllShops);
router.get("/singleshop/:id",getSingleShop);
router.put("/updateshop/:id",updateShop);
router.delete("/deleteshop/:id",deleteShop);

// auth controllers
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authMiddleware, getUsers);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);


module.exports = router;