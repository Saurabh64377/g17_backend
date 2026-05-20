// routes/shopRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
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


router.post("/create",upload.single("icon"),createShop);
router.get("/all",getAllShops);
router.get("/single/:id",getSingleShop);
router.put("/update/:id",upload.single("icon"),updateShop);
router.delete("/delete/:id",deleteShop);

// auth controllers
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authMiddleware, getUsers);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);


module.exports = router;