// controllers/shopController.js
const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");


exports.registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            number,
            role_id
        } = req.body;
       

        // VALIDATION

        if (!name || !email || !password || !role_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // CHECK EMAIL EXISTS

        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT USER

        await db.query(
            `INSERT INTO users 
            (name, email, password, number, role_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                number,
                role_id
            ]
        );

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // CHECK EMAIL

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const user = rows[0];

        // CHECK PASSWORD

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // CHECK STATUS

        if (user.status === 0) {
            return res.status(403).json({
                success: false,
                message: "Account Deactivated"
            });
        }

        // GENERATE TOKEN

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getUsers = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT 
                users.*,
                roles.name AS role_name
            FROM users
            LEFT JOIN roles 
            ON users.role_id = roles.id
        `);

        return res.status(200).json({
            success: true,
            users: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            number,
            role_id,
            status
        } = req.body;

        await db.query(
            `UPDATE users
            SET
                name = ?,
                email = ?,
                number = ?,
                role_id = ?,
                status = ?
            WHERE id = ?`,
            [
                name,
                email,
                number,
                role_id,
                status,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};