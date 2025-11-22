// backend/src/routes/logs.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getLogs, getLogsSummary } = require('../controllers/logsController');

// All routes use authMiddleware
router.use(authMiddleware);

// GET /api/logs - Get organization logs with filtering
router.get('/', getLogs);

// GET /api/logs/summary - Get log statistics
router.get('/summary', getLogsSummary);

module.exports = router;
