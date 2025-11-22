// backend/src/controllers/authController.js

// Use bcryptjs instead of bcrypt (lightweight & works on Windows)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sequelize } = require('../db');
const { Organisation, User, Log } = require('../models/associations');

const JWT_SECRET = process.env.JWT_SECRET;

// Helper: Create a log entry
const logAction = async (orgId, userId, action, meta) => {
    await Log.create({
        organisation_id: orgId,
        user_id: userId,
        action,
        meta
    });
};

// ---------------------------------------------
// REGISTER ORGANISATION + ADMIN USER
// ---------------------------------------------
exports.registerOrganisation = async (req, res) => {
    const { orgName, adminName, email, password } = req.body;

    const t = await sequelize.transaction();
    try {
        // Create Organisation
        const organisation = await Organisation.create(
            { name: orgName },
            { transaction: t }
        );

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create Admin User
        const user = await User.create(
            {
                organisation_id: organisation.id,
                name: adminName,
                email,
                password_hash
            },
            { transaction: t }
        );

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, orgId: organisation.id },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        await t.commit();

        // Log the action
        await logAction(organisation.id, user.id, "org_registered", {
            adminId: user.id,
            orgName
        });

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                orgId: organisation.id
            }
        });

    } catch (error) {
        await t.rollback();

        // Handle duplicate email (Postgres error code 23505)
        if (error.parent?.code === "23505") {
            return res.status(409).json({
                message: "User with this email already exists."
            });
        }

        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
};

// ---------------------------------------------
// LOGIN USER
// ---------------------------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare password using bcryptjs
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, orgId: user.organisation_id },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        // Log login action
        await logAction(user.organisation_id, user.id, "user_logged_in", {});

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                orgId: user.organisation_id
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Login failed."
        });
    }
};
