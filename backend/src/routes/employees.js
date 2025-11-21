// backend/src/routes/employees.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

// All routes use authMiddleware
router.use(authMiddleware); 

// CRUD operations
router.get('/', listEmployees);          // GET /api/employees
router.post('/', createEmployee);        // POST /api/employees
router.get('/:id', getEmployee);         // GET /api/employees/:id
router.put('/:id', updateEmployee);      // PUT /api/employees/:id
router.delete('/:id', deleteEmployee);   // DELETE /api/employees/:id

module.exports = router;