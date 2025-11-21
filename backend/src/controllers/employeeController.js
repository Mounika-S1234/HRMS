// backend/src/controllers/employeeController.js
const { Employee, Log, Team } = require('../models/associations');
const { sequelize } = require('../db');

// Helper function to create log entries
const logAction = async (orgId, userId, action, meta) => {
    await Log.create({ organisation_id: orgId, user_id: userId, action, meta });
};

exports.listEmployees = async (req, res) => {
    const orgId = req.user.orgId;
    try {
        const employees = await Employee.findAll({ 
            where: { organisation_id: orgId },
            // Include Teams association for displaying assignments
            include: [{ model: Team, as: 'Teams', attributes: ['id', 'name'] }]
        });
        return res.json(employees);
    } catch (error) {
        console.error("List Employee Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve employees.' });
    }
};

exports.createEmployee = async (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    try {
        const employee = await Employee.create({ 
            first_name, 
            last_name, 
            email, 
            phone, 
            organisation_id: orgId 
        });
        
        await logAction(orgId, userId, 'employee_created', { employeeId: employee.id, name: `${first_name} ${last_name}` });
        return res.status(201).json(employee);
    } catch (error) {
        console.error("Create Employee Error:", error);
        return res.status(500).json({ message: 'Failed to create employee.' });
    }
};

exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    try {
        const [updatedRows] = await Employee.update(
            { first_name, last_name, email, phone },
            { where: { id: id, organisation_id: orgId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Employee not found or unauthorized.' });
        }

        await logAction(orgId, userId, 'employee_updated', { employeeId: id, changes: req.body });
        return res.json({ message: 'Employee updated successfully.' });
    } catch (error) {
        console.error("Update Employee Error:", error);
        return res.status(500).json({ message: 'Failed to update employee.' });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    try {
        const deletedRows = await Employee.destroy({
            where: { id: id, organisation_id: orgId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Employee not found or unauthorized.' });
        }

        await logAction(orgId, userId, 'employee_deleted', { employeeId: id });
        return res.status(204).send();
    } catch (error) {
        console.error("Delete Employee Error:", error);
        return res.status(500).json({ message: 'Failed to delete employee.' });
    }
};

exports.getEmployee = async (req, res) => {
    const { id } = req.params;
    const orgId = req.user.orgId;

    try {
        const employee = await Employee.findOne({
            where: { id: id, organisation_id: orgId },
            include: [{ model: Team, as: 'Teams', attributes: ['id', 'name'] }]
        });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        return res.json(employee);
    } catch (error) {
        console.error("Get Employee Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve employee data.' });
    }
};