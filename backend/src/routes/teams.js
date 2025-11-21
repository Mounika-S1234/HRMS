// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { 
    listTeams, 
    createTeam, 
    getTeam, 
    updateTeam, 
    deleteTeam, 
    assignEmployees, 
    unassignEmployee 
} = require('../controllers/teamController');

// Apply authentication middleware to all routes in this file
router.use(authMiddleware); 

// --- Core CRUD Operations ---

// GET /api/teams - List all teams for the organization
router.get('/', listTeams);          

// POST /api/teams - Create a new team
router.post('/', createTeam);        

// GET /api/teams/:id - Get a single team and its assigned employees
router.get('/:id', getTeam);         

// PUT /api/teams/:id - Update a team's details
router.put('/:id', updateTeam);      

// DELETE /api/teams/:id - Delete a team
router.delete('/:id', deleteTeam);   

// --- Assignment Operations (Many-to-Many) ---

// POST /api/teams/:teamId/assign 
// Body: { employeeId: X } or { employeeIds: [X, Y] }
router.post('/:teamId/assign', assignEmployees);     

// DELETE /api/teams/:teamId/unassign 
// Body: { employeeId: X } (Uses DELETE verb but requires body for employeeId)
router.delete('/:teamId/unassign', unassignEmployee); 

module.exports = router;