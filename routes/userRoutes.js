const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/all-users", authMiddleware, getUsers);

router.put("/update/:id", authMiddleware, updateUser);

router.delete("/delete/:id", authMiddleware, deleteUser);

module.exports = router;