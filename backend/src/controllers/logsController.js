const { Log, User } = require('../models/associations');
const { Op, fn, col } = require('sequelize');

// Ensure the User model is included if you ever need to fetch user details along with the logs,
// but for now, the associations model only exports Log, so we'll adjust the import above.

exports.getLogs = async (req, res) => {
    const orgId = req.user.orgId;
    const { action, userId, limit = 100, offset = 0 } = req.query;

    try {
        // Build where clause
        const whereClause = { organisation_id: orgId };
        
        if (action) {
            whereClause.action = action;
        }
        
        if (userId) {
            whereClause.user_id = userId;
        }

        const { count, rows } = await Log.findAndCountAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            // Optionally, include User information here if needed for display (e.g., who performed the action)
            // include: [{ model: User, attributes: ['id', 'name', 'email'] }] 
        });

        return res.json({
            total: count,
            logs: rows,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error("Get Logs Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve logs.' });
    }
};

// Get log statistics/summary for dashboard
exports.getLogsSummary = async (req, res) => {
    const orgId = req.user.orgId;

    try {
        // Get distinct actions and their counts
        const actionCounts = await Log.findAll({
            where: { organisation_id: orgId },
            attributes: [
                'action',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['action'],
            raw: true
        });

        // Get recent logs (last 10)
        const recentLogs = await Log.findAll({
            where: { organisation_id: orgId },
            order: [['timestamp', 'DESC']],
            limit: 10,
            raw: true
        });

        return res.json({
            actionCounts,
            recentLogs
        });
    } catch (error) {
        console.error("Get Logs Summary Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve log summary.' });
    }
};