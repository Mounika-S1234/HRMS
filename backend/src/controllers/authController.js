// backend/src/controllers/authController.js
// Change bcrypt to bcryptjs
const bcrypt = require('bcryptjs'); 
// ... rest of the file ... // <--- CORRECTED LINE
const jwt = require('jsonwebtoken');
const { sequelize } = require('../db');
const { Organisation, User, Log } = require('../models/associations');
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to create log entries
const logAction = async (orgId, userId, action, meta) => {
    await Log.create({ organisation_id: orgId, user_id: userId, action, meta });
};

exports.registerOrganisation = async (req, res) => {
    const { orgName, adminName, email, password } = req.body;
    const t = await sequelize.transaction();

    try {
        const organisation = await Organisation.create({ name: orgName }, { transaction: t });
        // Use bcryptjs for hashing
        const password_hash = await bcrypt.hash(password, 10); 
        
        const user = await User.create({
            organisation_id: organisation.id,
            name: adminName,
            email: email,
            password_hash: password_hash
        }, { transaction: t });

        const token = jwt.sign(
            { userId: user.id, orgId: organisation.id }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        await t.commit();
        
        await logAction(organisation.id, user.id, 'org_registered', { adminId: user.id, orgName: orgName });

        return res.status(201).json({ token, user: { id: user.id, name: user.name, orgId: organisation.id } });

    } catch (error) {
        await t.rollback();
        // Check for duplicate email error (code 23505 in Postgres)
        if (error.parent && error.parent.code === '23505') {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        console.error("Registration Error:", error);
        return res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Use bcryptjs for comparison
        const match = await bcrypt.compare(password, user.password_hash); 

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user.id, orgId: user.organisation_id }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        await logAction(user.organisation_id, user.id, 'user_logged_in', {});

        return res.json({ 
          token, 
          user: { id: user.id, name: user.name, orgId: user.organisation_id, email: user.email } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: 'Login failed.' });
    }
};