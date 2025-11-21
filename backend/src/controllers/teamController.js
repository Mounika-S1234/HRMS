// backend/src/controllers/teamController.js
const { Team, Employee, Log, EmployeeTeam } = require('../models/associations');
const { sequelize } = require('../db');
const { Op } = require('sequelize'); // Needed for batch lookups

// Helper function to create log entries
const logAction = async (orgId, userId, action, meta) => {
    await Log.create({ organisation_id: orgId, user_id: userId, action, meta });
};

// --- CRUD Operations for Teams ---

// 1. LIST Teams (GET /api/teams)
exports.listTeams = async (req, res) => {
    const orgId = req.user.orgId;
    try {
        const teams = await Team.findAll({
            where: { organisation_id: orgId },
            // Include Employees association and count them
            include: [{ 
                model: Employee, 
                as: 'Employees', 
                attributes: ['id', 'first_name', 'last_name'],
                through: { attributes: [] } // Don't include join table data directly
            }],
            order: [['name', 'ASC']]
        });
        return res.json(teams);
    } catch (error) {
        console.error("List Teams Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve teams.' });
    }
};

// 2. GET Team by ID (GET /api/teams/:id)
exports.getTeam = async (req, res) => {
    const { id } = req.params;
    const orgId = req.user.orgId;
    
    try {
        const team = await Team.findOne({
            where: { id: id, organisation_id: orgId },
            include: [{ 
                model: Employee, 
                as: 'Employees', 
                attributes: ['id', 'first_name', 'last_name', 'email'],
                through: { attributes: ['assigned_at'] }
            }]
        });

        if (!team) {
            return res.status(404).json({ message: 'Team not found or unauthorized.' });
        }
        return res.json(team);
    } catch (error) {
        console.error("Get Team Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve team.' });
    }
};

// 3. CREATE Team (POST /api/teams)
exports.createTeam = async (req, res) => {
    const { name, description } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    if (!name) {
        return res.status(400).json({ message: 'Team name is required.' });
    }

    try {
        const team = await Team.create({ name, description, organisation_id: orgId });
        
        await logAction(orgId, userId, 'team_created', { teamId: team.id, name: name });
        return res.status(201).json(team);
    } catch (error) {
        console.error("Create Team Error:", error);
        return res.status(500).json({ message: 'Failed to create team.' });
    }
};

// 4. UPDATE Team (PUT /api/teams/:id)
exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    try {
        const [updatedRows] = await Team.update(
            { name, description },
            { where: { id: id, organisation_id: orgId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Team not found or unauthorized.' });
        }

        await logAction(orgId, userId, 'team_updated', { teamId: id, changes: req.body });
        return res.json({ message: 'Team updated successfully.' });
    } catch (error) {
        console.error("Update Team Error:", error);
        return res.status(500).json({ message: 'Failed to update team.' });
    }
};

// 5. DELETE Team (DELETE /api/teams/:id)
exports.deleteTeam = async (req, res) => {
    const { id } = req.params;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    try {
        const deletedRows = await Team.destroy({
            where: { id: id, organisation_id: orgId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Team not found or unauthorized.' });
        }

        // Cascade delete should handle EmployeeTeam entries automatically
        await logAction(orgId, userId, 'team_deleted', { teamId: id });
        return res.status(204).send();
    } catch (error) {
        console.error("Delete Team Error:", error);
        return res.status(500).json({ message: 'Failed to delete team.' });
    }
};


// --- Team Assignment / Unassignment ---

// 6. ASSIGN Employee(s) to a Team (POST /api/teams/:teamId/assign)
exports.assignEmployees = async (req, res) => {
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body; // Can accept single ID or array
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    
    // Ensure we have an array of IDs to process
    const idsToAssign = employeeIds ? employeeIds : (employeeId ? [employeeId] : []);

    if (idsToAssign.length === 0) {
        return res.status(400).json({ message: 'Employee ID(s) required for assignment.' });
    }

    try {
        // 1. Find the target team (must belong to the org)
        const team = await Team.findOne({ where: { id: teamId, organisation_id: orgId } });
        if (!team) {
            return res.status(404).json({ message: 'Team not found or unauthorized.' });
        }

        // 2. Find the employees (must belong to the org)
        const employees = await Employee.findAll({ 
            where: { 
                id: { [Op.in]: idsToAssign },
                organisation_id: orgId
            } 
        });

        if (employees.length === 0) {
            return res.status(404).json({ message: 'No valid employees found for assignment.' });
        }

        // 3. Assign using Sequelize magic (addEmployee(s))
        // Note: This only adds employees that are NOT ALREADY assigned.
        await team.addEmployees(employees); 

        // 4. Log the action
        await logAction(orgId, userId, 'assigned_employee_to_team', { 
            teamId: teamId, 
            teamName: team.name, 
            employeeIds: employees.map(e => e.id)
        });

        return res.status(200).json({ 
            message: `Successfully assigned ${employees.length} employee(s) to team ${team.name}.`
        });
    } catch (error) {
        console.error("Assign Employee Error:", error);
        return res.status(500).json({ message: 'Failed to assign employees.' });
    }
};

// 7. UNASSIGN Employee from a Team (DELETE /api/teams/:teamId/unassign)
exports.unassignEmployee = async (req, res) => {
    const { teamId } = req.params;
    const { employeeId } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    if (!employeeId) {
        return res.status(400).json({ message: 'Employee ID required for unassignment.' });
    }

    try {
        // 1. Find the target team and employee
        const team = await Team.findOne({ where: { id: teamId, organisation_id: orgId } });
        const employee = await Employee.findOne({ where: { id: employeeId, organisation_id: orgId } });

        if (!team || !employee) {
            return res.status(404).json({ message: 'Team or Employee not found or unauthorized.' });
        }

        // 2. Remove assignment using Sequelize magic (removeEmployee)
        const result = await team.removeEmployee(employee);

        if (result === 0) {
            // Employee wasn't assigned in the first place
            return res.status(409).json({ message: 'Employee was not assigned to this team.' });
        }

        // 3. Log the action
        await logAction(orgId, userId, 'unassigned_employee_from_team', { 
            teamId: teamId, 
            employeeId: employeeId
        });

        return res.status(200).json({ message: 'Employee successfully unassigned.' });
    } catch (error) {
        console.error("Unassign Employee Error:", error);
        return res.status(500).json({ message: 'Failed to unassign employee.' });
    }
};