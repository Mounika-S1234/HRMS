// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerOrganisation, login } = require('../controllers/authController');

// POST /api/auth/register (Create Organisation and Admin User)
router.post('/register', registerOrganisation);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;